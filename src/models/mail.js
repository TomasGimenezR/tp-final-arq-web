const mongoose = require('mongoose')

const mailSchema = new mongoose.Schema ({
    remitent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recipients: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String
    },
    message: {
        type: String
    },
    files: {
        type: Buffer
    }

})

const Mail = mongoose.model('Mail', mailSchema)

module.exports = Mail