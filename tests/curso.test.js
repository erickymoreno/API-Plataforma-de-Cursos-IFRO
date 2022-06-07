require('dotenv').config()
const app = require('../src/index')

let request = require('supertest')
request = request(app)

describe('Testando a listagem de cursos', () => {
  it('Dado um id do curso valido como parâmetros, a rota deve retornar um status 200', async () => {
    const response = await request.get('/api/v1/curso/620aac1865d9a91efff30d5f')
      .expect(200)
  })// Lembre-se de passar um id referente a um registro existente no banco

  it('Dado um id do curso invalido como parâmetros, a rota deve retornar um status 404', async () => {
    const response = await request.get('/api/v1/curso/620aac1865d9a91efff3043k')
      .expect(404)
  })
})
