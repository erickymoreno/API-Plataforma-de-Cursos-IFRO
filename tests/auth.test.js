require('dotenv').config()
const app = require('../src/index')

let request = require('supertest')
request = request(app)

describe('Testando a funcionalidade de autenticação', () => {
  it('Informados os dados de login de um usuário válido, a rota deve retornar um status 200', async () => {
    const response = await request.post('/api/v1/login').send({
      email: 'marcia.velasco@geradornv.com.br',
      senha: '837UKFf#q3rf'
    }).expect(200)
  })/

  it('Informados os dados inválidos de login, a rota deve retornar um status 400', async () => {
    const response = await request.post('/api/v1/login').send({
      email: 'emanuela.furtunato@geradornv.com.br',
      senha: 'Oef88@z5$Vk3'
    }).expect(400)
  })
})