const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const { forwardAuthenticated } = require('../middleware/auth')

const router = new express.Router()

router.get('/users/register', forwardAuthenticated,(req, res) => {
    res.render('register', {
        layout: 'loggedOut',
        title: 'Register'
    })
})

router.post('/users/register', (req, res) => {
    const { name, surname, address, phoneNumber, city, country, province, password, password2, email } = req.body

    User.findOne({ email })
        .then(async (user) => {
            if(user){
                res.render('register',{
                    message: 'El email se encuentra en uso. Por favor pruebe otro.',
                    layout: 'loggedOut',
                    title: 'Register'
                })
                return new Error({ error: 'Email already in use!' })
            } else {
                if(!password.localeCompare(password2)){
                    debugger
                    //Save user
                    const newUser = new User({ name, surname, address, phoneNumber, city, country, province, password, email })
                    newUser.createNewFolder('Enviados')
                    newUser.save()
                        .then(() => {
                            res.status(201).redirect('/')
                        })
                }
                else{
                    res.render('register',{
                        message: 'Las claves no coinciden.',
                        layout: 'loggedOut',
                        title: 'Register'
                    })
                }
            }
        })
        .catch((err) => {
            res.status(400).send(err)
        })
})

router.get('/users/login', forwardAuthenticated,(req, res) => {
    res.render('login', {
        layout: 'loggedOut',
        title: 'TGR Mail Service'
    })
})

router.post('/users/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
});

router.post('/users/newFolder', (req, res) => {
    req.user.createFolder(req.body.folderName)
})

router.post('/users/moveToFolder', (req, res) => {
    req.user.saveMailInFolder(req.body.folderName, req.body.selected)
})

router.get('/users/*', (req, res) => {
    res.status(404).render('404', {
        layout: 'main',
        title: '404'
    })
})

module.exports = router