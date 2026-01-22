const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const correctPassword = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && correctPassword)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id.toString(),
  }

  const token = jwt.sign(
    userForToken, 
    process.env.JWT_SECRET,
    { expiresIn: 60*60 }
  )

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})


module.exports = loginRouter