const User = require('../models/user')
const jwt = require('jsonwebtoken')

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = await User.findById(decodedToken.id)

  } else {      

    req.user = null
  }
    
 next()
}

module.exports = userExtractor