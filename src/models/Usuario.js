const mongoose = require('../connection')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const usuarioSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  dataDeNascimento: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true,
    select: false
  },
  fotoDePerfil: {
    type: String,
    required: false
  },
  cursa: [{
    id_curso:{
      type: mongoose.ObjectId,
      required: true
    },
    status: {
      type: String,
      required: true
    }
    ,
    aulas:[{
      id_aula:{
        type: mongoose.ObjectId,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      topicosConcluidos:{
        type: Array,
        required: true
      }
  }],
  certificado: {
    type: String,
    required: true
  },
  dataDeinicio: {
    type: Date,
    required: true
  },
  dataDeTermino: {
    type: Date,
    required: true
  }
}],
  instrutor: {
    type: Boolean,
    required: false, 
    default: false
  },
  administrador: {
    type: Boolean,
    required: false, 
    default: false
  }
})

usuarioSchema.pre('save', async function (next) {
  const hashPassword = await bcrypt.hash(this.senha, 10)
  this.senha = hashPassword
  next()
})

const Usuario = mongoose.model('Usuario', usuarioSchema)
module.exports = Usuario
