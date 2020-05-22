const express = require('express')
const path = require('path')
const hbs = require('hbs')

const userRouter = require('./routers/user')
const mailRouter = require('./routers/mail')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended:false}))

app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(userRouter)
app.use(mailRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})