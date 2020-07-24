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
 * Find all emails in the DB located within the User mailbox
 * @param {*} mailBox list of Mails id in User Mailbox
 */
mailSchema.statics.findAllMails = async (mailbox) => {
    return mailList = await Mail.find({
        _id: {$in: mailbox}
    })
}

const Mail = mongoose.model('Mail', mailSchema)

module.exports = Mail