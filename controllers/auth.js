const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')



router.get('/signup', (req, res) => {
  res.render('auth/signup.ejs')
})



router.post('/signup', async (req, res) => {
  try {


    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword
    })
    req.session.user = newUser
    res.redirect('/games')
  } catch (err) {
    console.error(err)
    res.send('Error signing up. Username might already exist.')
  }
})


router.get('/login', (req, res) => {
  res.render('auth/login.ejs')
})


router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.send('user not found 404')



    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.send('incorrect try again')

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
