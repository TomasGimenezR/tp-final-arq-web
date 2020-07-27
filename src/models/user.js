const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: Number
    },
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    province: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Email is invalid')
            }
        }
    },
    mailbox: [{
        type: String
    }],
    folders: {
        type: mongoose.Schema.Types.Mixed
    }
})

//Encrypt password
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.receiveMail = async (emails, mailId) => {
    emails.forEach(async (email) => {
        const user = await User.findOne({ email })
            .catch((e) => {throw Error('User not found', e)})
        if(user){
            user.mailbox.push(mailId)
            await user.save()
        }
    })
}

userSchema.methods.deleteMails = async function (mailList) {
    try{
        user = this
        console.log('IIs de mails existentes en Mailbox:\n', user.mailbox)
        console.log('IDs a eliminar:', mailList)
        user.mailbox = user.mailbox.filter((element) => !mailList.includes(element))
        console.log('Mails restantes: ', user.mailbox)
        await user.save()
    } catch(e) { throw new Error('An error occurred trying to update DB') }
}

/**
 * Finds User with the specified credentials 
 * @param {*} email User email
 * @param {*} password User password
 */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User