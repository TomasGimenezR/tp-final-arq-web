const express = require('express')
const path = require('path')
const hbs = require('hbs')
const passport = require('passport')
const session = require('express-session');

const userRouter = require('./routers/user')
const mailRouter = require('./routers/mail')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport Config
require('./passport')(passport);

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())
require('./passport')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
hbs.registerHelper('ifNotEquals', function(arg1, arg2, options) {
  return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(userRouter)
app.use(mailRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})