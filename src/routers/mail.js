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

    await upload(req, res, (err) => {
        if(err){ console.log(e) } })

    const newMail = new Mail({
        remitent: req.user.email,
        recipients,
        dateSent: Date(),
        ...req.body //Adds in the remaining ones
    })

    await User.receiveMail(recipients, newMail._id)
    await req.user.saveMailInFolder('Enviados', newMail._id)
    
    console.log('Y ahora carpetas:\n',req.user.folders)

    await newMail.save()
        .then(() => {
            debugger
            console.log('Mail enviado con exito!')
            console.log(recipients, newMail)

            res.render('inbox', {
                name: req.user.name,
                mail: mailList,
                layout: 'main',
                title: 'Inbox',
                folders: req.user.folders
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
        .catch((e) => {
            res.status(404).render('404', {
                layout: 'main',
                title: '404'
            })        
        })
})

//Delete Mails
router.delete('/mail', ensureAuthenticated, (req, res) => {
    req.user.deleteMails(req.body.selected)
        .then(() => {
            //alertMessage('Mails eliminados con exito!')
        })
        .catch((e) => { console.log(e) })
})

//Inbox
router.get('/', ensureAuthenticated,(req, res) => {
    console.log(req.user.name, 'logged in!')
    Mail.findAllMails(req.user.mailbox)
        .then((mailbox) => {
            //console.log(mailList)
            res.render('inbox', {
                name: req.user.name,
                mail: mailList,
                layout: 'main',
                title: 'Inbox',
                folders: req.user.folders
            })
        })
})

router.get('/:folderName', ensureAuthenticated, (req, res) => {
    Mail.findAllMails(req.user.folders[req.params.folderName])
        .then((mailbox) => {
            res.render('inbox', {
                name: req.user.name,
                mail: mailList,
                layout: 'main',
                title: 'Inbox',
                folders: req.user.folders
            })
        })
})

//Read Mail Content
router.get('/mail/:id', ensureAuthenticated, (req,res) => {

    Mail.findOne({
        _id: req.params.id,
        recipients: req.user.email
    })
    .then((mail) => {
        res.render('mailContent', {
            mail,
            layout: 'main',
            title: mail.subject
        })
    })
    .catch((e) => { 
        res.render('404', {
            layout: 'main',
            title: '404'
        })
     })
})

router.get('/*', (req, res) => {
    res.status(404).render('404', {
        layout: 'main',
        title: '404'
    })
})



module.exports = router