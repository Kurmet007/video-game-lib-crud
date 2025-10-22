const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const fiveSecs = require('../tools/fiveSecs')


router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("⚠️ Password and confirm password must match")
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    req.body.password = hashedPassword

    const newUser = await User.create(req.body)

    req.session.user = newUser

    res.redirect('/games')
  } catch (err) {
    fiveSecs(err, res)
  }
})


router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.send('User not found 404')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.send('Incorrect password, try again')

    req.session.user = user
    res.redirect('/games')
  } catch (err) {
    console.error(err)
    res.send('Error logging in')
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
})

module.exports = router
