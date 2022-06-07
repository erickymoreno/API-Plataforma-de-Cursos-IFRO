require('dotenv').config()
const jwt = require('jsonwebtoken')

function verifyToken (req, res, next) {
  const token = req.headers['x-api-token']
  if (!token) {
    return res.status(403).send({
      auth: false,
      message: 'Não foi fornecido o Token.'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
    if (error) {
      return res.status(500).send({
        auth: false,
        message: 'Token inválido, realize a autenticação novamente.',
        error
      })
    }
    req.usuario_id = decoded.id
    next()
  })
}
module.exports = verifyToken
