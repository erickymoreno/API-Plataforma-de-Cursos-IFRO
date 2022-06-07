require('dotenv').config()
const app = require('../src/index')

let request = require('supertest')
request = request(app)

describe('Teste POST /cadastro - Criação de usuários', () => {
  it('Dado um corpo de requisição válido, a rota deve retornar um status 201', async () => {
    const response = await request.post('/api/v1/cadastro').send({// Lembre-se de mudar o email a cada teste, pois, caso não o faça, retornará erro
      nome: "Márcia Sousa Velasco",
      dataDeNascimento: "11-10-1994",
      email: "marcia.velasco@geradornv.com.br", // Deve-se trocar o email a todas vez que o testes são chamados
      senha: "837UKFf#q3rf",
      fotoDePerfil: "8da8sdha9d3"
    }).expect(201)
  })

  it('Dado uma senha com menos de 8 caracteres no corpo de requisição, a rota deve retornar um status 400', async () => {
    const response = await request.post('/api/v1/cadastro').send({
        nome: 'Márcia Sousa Velasco',
        dataDeNascimento: '18/11/1994',
        email: 'marcia.velasco@geradornv.com.br',
        senha: '837',
        fotoDePerfil: '8da8sdha9d3'
    }).expect(400)
  })
})


describe('Teste GET /usuario - Listagem dos dados do usário logado', () => {
  // Pode ser necessário alterar os tokens
  it('Dado um token de autenticação válido, a rota deve retornar um status 200', async () => {
    const response = await request.get('/api/v1/usuario').set('x-api-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMmQxNmY5MmIzNzExYmI4MTUwNjg0MCIsImlhdCI6MTY0NzEyMzk5MCwiZXhwIjoxNjQ3MjEwMzkwfQ.dT0dEXA1z9_sBcCsaK-z8ziqoyrDHmzoea7y3Y-7Fok')
      .expect(200)
  })

  it('Dado um token de autenticação inválido, a rota deve retornar um status 500', async () => {
    const response = await request.get('/api/v1/usuario').set('x-api-token', 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEyLCJpYXQiOjE2Mzg1NDk0OTMsImV4cCI6MTYzODYzNTg5M30.ZF2HMe1Z91cdrrtwqpW27dOaBqCNt9zDYcmZSW9-aMM')
      .expect(500)
  })

  it('Caso não seja informado o token de autenticação, a rota deve retornar um status 403', async () => {
    const response = await request.get('/api/v1/usuario').expect(403)
  })
})