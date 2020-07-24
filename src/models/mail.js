const mongoose = require('mongoose')

const mailSchema = new mongoose.Schema ({
    remitent: {
        type: String,
        required: true,
    },
    recipients: [
        String
    ],
    subject: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    files: [{
        type: String
    }],
    dateSent: {
        type: Date
    }

})

/**
 * Find all emails in the DB with email as the recepient
 * @param {*} email email of the recipient
 */
mailSchema.statics.findAllMails = (email) => {
    var regex = new RegExp(["^", email, "$"].join(""), "i");
    const mails =  Mail.find( { recipients: {$regex: regex } } ).lean()
    return mails
}


const Mail = mongoose.model('Mail', mailSchema)

module.exports = Mail