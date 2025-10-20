const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    platform: String,
    genre: {type: String},
    releaseYear: Number,
    completed: {type: Boolean},
    rating: Number,

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

})


const Game = mongoose.model('game', gameSchema)

module.exports = Game