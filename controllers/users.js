const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1})
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'username or password is missing' })
    }
    if (username.length < 3) {
        return res.status(400).json({ error: 'username is shorter than the minimun allowed (3)' })
    } 
    if (password.length < 3) {
        return res.status(400).json({ error: 'password is shorter than the minimun allowed (3)' })
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    
    const user = new User({
        username,
        name,
        passwordHash
    })
    
    const saveUser = await user.save()
    res.status(201).json(saveUser)
})

module.exports = usersRouter