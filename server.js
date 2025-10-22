const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const app = express()

mongoose.connect(process.env.DATABASE_URL)
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.set('view engine', 'ejs')


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'encryptedpass',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      ttl: 14 * 24 * 60 * 60
    })
  })
)

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

const authController = require('./controllers/auth')
const gameController = require('./controllers/games')

app.use('/auth', authController)
app.use('/games', gameController)

app.get('/', (req, res) => res.redirect('/games'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
