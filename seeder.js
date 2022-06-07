const seeder = require('mongoose-seed')

// Connect to MongoDB via Mongoose
const db = 'mongodb://localhost:27017/cursos-ifro'
seeder.connect(db, function () {
  seeder.loadModels([
    './src/models/Usuario',
    './src/models/Curso'
  ])

  seeder.clearModels(['Usuario', 'Curso'], function () {
    seeder.populateModels(data, function () {
      seeder.disconnect()
    })
  })
})

let data = [
  {
    model: 'Usuario',
    documents: [
      {
        nome: 'Maria da Silva',
        dataDeNascimento: '1998/03/21',
        email: 'mariasilva_@gmail.com',
        senha: '123',
        fotoDePerfil: 'vazio'
      },
      {
        nome: 'Arthur Amaral Gomes',
        dataDeNascimento: '1974/08/04',
        email: 'arthur.gomes@uol.com.br',
        senha: 'AVeryDYN',
        fotoDePerfil: 'vazio'
      },
      {
        nome: 'Matheus Machado Amaral',
        cpf: '536.308.790-12',
        dataDeNascimento: '1960/06/27',
        email: 'matheus.amaral@hotmail.com',
        senha: 'tujeQULe',
        fotoDePerfil: 'vazio'
      },
      {
        nome: 'Bernardo Machado Ducati',
        cpf: '655.879.760-76',
        dataDeNascimento: '2000/05/13',
        email: 'bernardo.ducati@icloud.com',
        senha: 'ysYTEqUP',
        fotoDePerfil: 'vazio'
      },
      {
        nome: 'Lara Ducati Amaral',
        cpf: '288.247.332-04',
        dataDeNascimento: '1999/02/23',
        email: 'lara.amaral@yahoo.com',
        senha: 'ajyMYzym',
        fotoDePerfil: 'vazio'
      },
      {
        nome: 'Alice Amaral Gomes',
        cpf: '442.880.225-09',
        dataDeNascimento: '1998/12/18',
        email: 'alice.gomes@hotmail.com',
        senha: 'YJUXYnyL',
        fotoDePerfil: 'vazio'
      },
      {
        nome: 'Isabela Machado Amaral',
        cpf: '831.613.322-96',
        dataDeNascimento: '1989/03/19',
        email: 'isabela.amaral@icloud.com',
        senha: 'NUmedaDu',
        fotoDePerfil: 'vazio'
      }

    ]
  },
  {
    model: 'Curso',
    documents: [
      {
        nome: 'Curso de JavaScript',
        duracao: 12,
        dataDeCriacao: '2021/09/12',
        descricao: 'Curso de JavaScript para web',
        tag: ['Informatica', 'Tecnologia']
      },
      {
        nome: 'Curso de HTML',
        duracao: 10,
        dataDeCriacao: '2021/09/12',
        descricao: 'Curso de HTML para web',
        tag: ['Informatica', 'Tecnologia']
      },
      {
        nome: 'Curso de CSS',
        duracao: 8,
        dataDeCriacao: '2021/09/12',
        descricao: 'Curso de estilização com CSS',
        tag: ['Informatica', 'Tecnologia']
      },
      {
        nome: 'Curso de Python',
        duracao: 20,
        dataDeCriacao: '2021/09/12',
        descricao: 'Curso de programação com Python',
        tag: ['Informatica', 'Tecnologia']
      },
      {
        nome: 'Curso de Node.js',
        duracao: 15,
        dataDeCriacao: '2021/09/12',
        descricao: 'Curso de Node.js para desenvolvimento de API Rest',
        tag: ['Informatica', 'Tecnologia']
      }
    ]
  }
]
