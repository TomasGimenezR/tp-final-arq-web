const express = require('express')
const Mail = require('../models/mail')
var upload = require('../utils/multer')
const { ensureAuthenticated } = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()

//Compose new Mail
router.get('/mail', ensureAuthenticated, (req,res) => {
    res.render('newMail', {
        layout: 'main',
        title: 'Compose Mail'
    })
})

//Send mail
router.post('/mail', async (req, res) => {
    var recipients = req.body.recipients.split(',')
    delete (req.body.recipients)

    // upload(req, res, (errormsg) => {
    //     if(errormsg){
    //         res.render('newMail', {
    //             layout: 'main',
    //             errormsg
    //         })
    //     }
    // })

    const newMail = new Mail({
        remitent: req.user.email,
        recipients,
        dateSent: Date(),
        ...req.body //Incorpora todo el contenido enviado para crear el mail.
    })

    User.receiveMail(recipients, newMail._id)
    //req.user.saveSentMail(newMail._id)

    console.log('Mail enviado:\n',recipients, newMail)
    await newMail.save()
        .then(() => {
            console.log('Mail enviado con exito!')
            res.render('inbox', {
                name: req.user.name,
                mail: mailList,
                layout: 'main',
                title: 'Inbox'
            })
        })
        .catch((err) => console.log(err))
})

//Reply mail
router.get('/mail/r/:id', ensureAuthenticated, (req,res) => {
    Mail.findById(req.params.id)
        .then((mail) => {
            res.render('newMail', {
                recipients: mail.remitent,
                subject: 'Re: ' + mail.subject,
                message: '<p> <blockquote>' + mail.message + '</blockquote>',
                layout: 'main',
                title: 'Compose Mail'
            })
        })
})

//Reply to all mail
router.get('/mail/ra/:id', ensureAuthenticated, (req,res) => {
    Mail.findById(req.params.id)
        .then((mail) => {
            var recipients = mail.recipients.filter((element) => element.trim() != req.user.email)
                .join(',') + ', ' + mail.remitent
            res.render('newMail', {
                recipients: recipients,
                subject: 'Re: ' + mail.subject,
                message: '<p> <blockquote>' + mail.message + '</blockquote>',
                layout: 'main',
                title: 'Compose Mail'
            })
        })
})

//Forward mail
router.get('/mail/f/:id', ensureAuthenticated, (req,res) => {
    Mail.findById(req.params.id)
        .then((mail) => {
            res.render('newMail', {
                subject: 'Fwd: ' + mail.subject,
                message: '<p> <blockquote>' + mail.message + '</blockquote>',
                layout: 'main',
                title: 'Compose Mail'
            })
        })
})

router.delete('/mail', ensureAuthenticated, (req, res) => {
    req.user.deleteMails(req.body.selected)
        .then(() => {
            alertMessage('Mails eliminados con exito!')
        })
        .catch((e) => { console.log(e) })
})

//Inbox
router.get('/', ensureAuthenticated,(req, res) => {
    console.log(req.user.name, 'logged in!')
    Mail.findAllMails(req.user.mailbox)
        .then((mailbox) => {
            console.log(mailList)
            res.render('inbox', {
                name: req.user.name,
                mail: mailList,
                layout: 'main',
                title: 'Inbox'
            })
        })
})

//Read Mail Content
router.get('/mail/:id', ensureAuthenticated, (req,res) => {
    Mail.findById(req.params.id)
        .then((mail) => {
            res.render('mailContent', {
                mail,
                layout: 'main',
                title: mail.subject
            })
        })
        .catch((e) => { console.log(e) })
})



module.exports = router