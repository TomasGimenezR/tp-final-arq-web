const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.get('', (req, res) => {
    res.redirect('users/login')
})

router.get('/users/register', (req, res) => {
    res.render('register')
})

router.post('/users/register', (req, res) => {
    const { name, surname, address, phoneNumber, city, country, province, password, email } = req.body

    User.findOne({ email })
        .then((user) => {
            if(user){
                res.render('register',{
                    message: 'El email se encuentra en uso. Pruebe otro.'
                })
                return new Error({ error: 'Email already in use!' })
            } else {
                //Save user
                const newUser = new User({ name, surname, address, phoneNumber, city, country, province, password, email })
                console.log(newUser)
                newUser.save()
                    .then(() => res.redirect('/index'))
            }
        })
        .catch((err) => {
            console.log(e)
        })
})

router.get('/users/login', (req, res) => {
    res.render('login')
})

router.post('/users/login', async (req, res) => {
    const {email, password} = req.body

    const user = await User.findByCredentials(email, password)
    if(user){
        res.redirect('/index')
        console.log('Successfully logged in!')
    }
})

router.get('/index', (req, res) => {
    res.render('index')
})

module.exports = router