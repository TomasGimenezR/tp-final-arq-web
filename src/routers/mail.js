const express = require('express')
const Mail = require('../models/mail')
const { ensureAuthenticated } = require('../../config/auth')
const User = require('../models/user')
const router = new express.Router()

router.get('/mail', ensureAuthenticated, (req,res) => {
    res.render('newMail', {
        layout: 'index'
    })
})

router.post('/mail', async (req, res) => {
    var recipients = req.body.recipients.split(',')
    delete (req.body.recipients)

    const newMail = new Mail({
        remitent: req.user.email,
        recipients: recipients,
        dateSent: Date(),
        ...req.body //Incorpora todo el contenido enviado para crear el mail.
    })

    //Saves mails in recipients mailbox
    User.receiveMail(recipients, newMail._id)

    console.log('Mail enviado:\n',recipients, newMail)
    await newMail.save()
        .then(() => {
            console.log('Mail enviado con exito!')
            res.render('inbox', {
                name: req.user.name,
                mail: mailList,
                layout: 'index'
            })
        })
        .catch((err) => console.log(err))
})

router.delete('/mail', (req, res) => {
    req.user.deleteMails(req.body.selected)
        .then(() => {
            alertMessage('Mails eliminados con exito!')
        })
        .catch((e) => { alert('Error', e) })
})

router.get('/index', ensureAuthenticated,(req, res) => {
    console.log(req.user.name, 'logged in!')
    Mail.findAllMails(req.user.mailbox)
        .then((mailbox) => {
            console.log(mailList)
            res.render('inbox', {
                name: req.user.name,
                mail: mailList,
                layout: 'index'
            })
        })
})

// router.post('/deleteMails', ensureAuthenticated, (req, res) => {
//     console.log('222',req.body)
//     User.findById(req.user._id)
//         .then((user) => {
//             console.log(user)
//             res.sendStatus(200) 
//         })
// })

router.get('/mail/:id', ensureAuthenticated, (req,res) => {
    Mail.findById(req.params.id)
        .then((mail) => {
            res.render('mailContent', {
                mail,
                layout: 'index'
            })
        })
        .catch((e) => { console.log(e) })
})



module.exports = router