const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const { forwardAuthenticated } = require('../../config/auth')

const router = new express.Router()

router.get('', (req, res) => {
    res.redirect('users/login')
})

router.get('/users/register', forwardAuthenticated,(req, res) => {
    res.render('register')
})

router.post('/users/register', (req, res) => {
    const { name, surname, address, phoneNumber, city, country, province, password, email } = req.body

    User.findOne({ email })
        .then(async (user) => {
            if(user){
                res.render('register',{
                    message: 'El email se encuentra en uso. Por favor pruebe otro.'
                })
                return new Error({ error: 'Email already in use!' })
            } else {
                //Save user
                const newUser = new User({ name, surname, address, phoneNumber, city, country, province, password, email })
                newUser.save()
                    .then(() => res.status(201).redirect('/index'))
            }
        })
        .catch((err) => {
            res.status(400).send(err)
        })
})

router.get('/users/login', forwardAuthenticated,(req, res) => {
    res.render('login')
})

router.post('/users/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/index',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next)
  });

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
});

router.get('/users/*', (req, res) => {
    res.status(404).send('404 PAGE NOT FOUND')
})

module.exports = router