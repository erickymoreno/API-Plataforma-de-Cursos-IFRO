const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

// Rotas
const router = require('./routes')
app.use('/api/v1/', router)

// Documentação da API
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/api.yaml')
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

if (process.env.NODE_ENV !== 'test') {
 app.listen(process.env.PORT, () => {
   console.log(`Servidor rodando na porta ${process.env.PORT}`)
 })
}

module.exports = app