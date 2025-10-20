const express = require('express')
const router = express.Router()
const Game = require('../models/game')




function isLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect('/login')
  next()
}




router.get('/', isLoggedIn, async (req, res) => {
  try {
    const games = await Game.find({ owner: req.session.user._id })
    res.render('games/index.ejs', { games })
  } catch (err) {
    console.error(err)
    res.send('Error loading games')
  }
})




router.get('/new', isLoggedIn, (req, res) => {
  res.render('games/new.ejs')
})




router.post('/', isLoggedIn, async (req, res) => { 
  try {
    req.body.completed = req.body.completed === 'on'
    req.body.owner = req.session.user._id 
    await Game.create(req.body)
    res.redirect('/games')
  } catch (error) {
    console.log(error)
    res.send('error creating new game in library')
  }
})




router.get('/:id', isLoggedIn, async (req, res) => {
  const game = await Game.findById(req.params.id)
  if (!game || !game.owner.equals(req.session.user._id)) return res.redirect('/games')
  res.render('games/show.ejs', { game })
})




router.get('/:id/edit', isLoggedIn, async (req, res) => {
  const game = await Game.findById(req.params.id)
  if (!game || !game.owner.equals(req.session.user._id)) return res.redirect('/games')
  res.render('games/edit.ejs', { game })
})



router.put('/:id', isLoggedIn, async (req, res) => {
  req.body.completed = req.body.completed === 'on'
  await Game.findOneAndUpdate(
    { _id: req.params.id, owner: req.session.user._id },
    req.body,
    { new: true }
  )
  res.redirect('/games')
})




router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    await Game.findOneAndDelete({ _id: req.params.id, owner: req.session.user._id })
    res.redirect('/games')
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

module.exports = router
