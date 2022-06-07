const mongoose = require('../connection')
const Schema = mongoose.Schema

const cursoSchema = new Schema({

  nome: {
    type: String,
    required: true
  },
  duracao: {
    type: Number,
    required: true
  },
  dataDeCriacao: {
    type: Date,
    require: true
  },
  ultimaAtualizacao: {
    type: Date,
    required: false
  },
  descricao: {
    type: String,
    required: true
  },
  tag: {
    type: Array,
    required: false
  },
  aulas: [{
    nome: {
      type: String,
      required: true
    },
    descricao: {
      type: String,
      required: true
    },
    topicos: [{
      titulo: {
        type: String,
        required: true
      },
      conteudo:{
        type: String,
        required: true
      }
    }]
  }]
})

const Curso = mongoose.model('Curso', cursoSchema)
module.exports = Curso
