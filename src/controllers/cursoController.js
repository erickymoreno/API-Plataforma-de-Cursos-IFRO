const Curso = require('../models/Curso')
const Usuario = require('../models/Usuario')
const mongoose = require('mongoose')

// Inserindo um novo curso
exports.inserir = async (req, res) => {

  try {
    const usuario = await Usuario.findById(req.usuario_id).lean()
    
    console.log(usuario)

    if (usuario.instrutor === false && usuario.administrador === false) {
      return res.status(401).send({ mensagem: 'Usuário não autorizado' })
    }

    const curso = new Curso(req.body)
    curso.dataDeCriacao = new Date()
    curso.ultimaAtualizacao = new Date()

    curso.save((erro, curso) => {
      if (erro) {
        return res.status(500).send(erro.message)
      } else {
        return res.status(201).send(curso)
      }
    })
  } catch (erro) {
    return res.status(500).send({
      mensagem: erro.message
    })
  }
}

// Deletando um curso com base em seu id
exports.deletar = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario_id).lean()

    if (usuario.instrutor === false && usuario.administrador === false) {
      return res.status(401).send({ mensagem: 'Usuário não autorizado' })
    }
    const id = req.params.id

    Curso.findByIdAndDelete(id, (erro) => {
      if (erro) {
        return res.status(404).send({
          mensagem: 'Curso não encontrado'
        })
      } else {
        return res.status(204).send({
          mensagem: 'Curso deletado com sucesso'
        })
      }
    })
  } catch (erro) {
    return res.status(500).send({
      mensagem: erro.message
    })
  }
}

// Exibir detalhes de um curso com base em seu id
exports.listarPorId = (req, res) => {
  try {
    const id = req.params.id

    Curso.findById(id, (erro, dados) => {
      if (erro) {
        return res.status(404).send({
          mensagem: 'Curso não encontrado'
        })
      } else {
        return res.status(200).send(dados)
      }
    })
  } catch (erro) {
    res.status(500).send({
      mensagem: erro.message
    })
  }
}

// Exibir datelhes de um curso com base em seu nome
exports.listarPorNome = (req, res) => {
  try {
    const nome = req.params.nome

    Curso.find({ nome: { $regex: new RegExp(nome, 'ig') } }, (erro, dados) => {
      if (erro) {
        return res.status(404).send({ mensagem: 'Nenhum curso encontrado' })
      } else {
        return res.status(200).send(dados)
      }
    })
  } catch (erro) {
    res.status(500).send({ mensagem: erro.message })
  }
}

// Alterando informações de um curso com base em seu id
exports.alterar = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario_id).lean()

    if (usuario.instrutor === false && usuario.administrador === false) {
      return res.status(401).send({ mensagem: 'Usuário não autorizado' })
    }
    const id = req.params.id
    const novoCurso = {
      nome: req.body.nome,
      duracao: req.body.duracao,
      descricao: req.body.descricao,
      tag: req.body.tag,
      ultimaAtualizacao: new Date() 
    }

    Curso.findByIdAndUpdate(id, novoCurso, {new: true}, (erro, dados) => {
      if (erro) {
        return res.status(404).send({ mensagem: 'Curso não encontrado' })
      } else {
        return res.status(200).send(dados)
      }
    })
  } catch (erro) {
    return res.status(500).send({
      mensagem: erro.message
    })
  }
}

// Listagem dos cursos
exports.paginatedResults = async (req, res, next) => {
  const page = parseInt(req.query.page)
  const limit = parseInt(10)
  const skipIndex = (page - 1) * limit
  const results = {}

  try {
    results.results = await Curso.find()
      .sort({
        _id: 1
      })
      .limit(limit)
      .skip(skipIndex)
      .exec()
    res.paginatedResults = results
    res.send(results)
    next()
  } catch (erro) {
    return res.status(500).send({
      message: erro.message
    })
  }
}

// Adiciondo aulas em curso
exports.inserirAula = async (req, res) => {
  const id = req.params.id
  const aulas = req.body

  try {

    const usuario = await Usuario.findById(req.usuario_id).lean()

    if (usuario.instrutor === false && usuario.administrador === false) {
      return res.status(401).send({ mensagem: 'Usuário não autorizado' })
    }

    for (let i = 0; i < aulas.length; i++) {
      aulas[i]._id = new mongoose.Types.ObjectId()
      for (let j = 0; j < aulas[i].topicos.length; j++) {
        aulas[i].topicos[j]._id = new mongoose.Types.ObjectId()
      }
    }

    Curso.findById(id, (erro, curso) => {

      if (erro) return res.status(404).send({ mensagem: 'Curso não encontrado' })

      if (curso) {
        aulas.forEach((aula) => {
          curso.aulas.push(aula)
        })

        curso.ultimaAtualizacao = new Date()

        Curso.findByIdAndUpdate(id, curso, {new: true}, (erro, dados) => {
          if (erro) {
            return res.status(500).send({ mensagem: erro.message })
          } else {
            return res.status(200).send(dados)
          }
        })
      }
    })
  } catch (erro) {
    return res.status(500).send({ mensagem: erro.message })
  }
}

// Alterar aula
exports.alterarAula = async (req, res) => {
  const { idcurso, idaula } = req.params

  try {

    const usuario = await Usuario.findById(req.usuario_id).lean()

    if (usuario.instrutor === false && usuario.administrador === false) {
      return res.status(401).send({ mensagem: 'Usuário não autorizado' })
    }

    Curso.findById(idcurso, (erro, curso) => {
      if (erro) {
        return res.status(404).send({ mensagem: 'Curso não encontrado' })
      } else {
        const aulas = curso.aulas
        let aux = false
        aulas.forEach(aula => {
          if (aula._id == idaula) {
            aula.nome = (req.body.nome !== undefined) ? req.body.nome : aula.nome
            aula.descricao = (req.body.descricao !== undefined) ? req.body.descricao : aula.descricao
            aula.topicos = (req.body.topicos !== undefined) ? req.body.topicos : aula.topicos
            aux = true
          }
        })
        if (!aux) {
          return res.status(404).send({ mensagem: 'Nenhuma aula encotrada' })
        } else {
          curso.ultimaAtualizacao = new Date()
          curso.aulas = aulas
          Curso.findByIdAndUpdate(idcurso, curso, {new: true}, (erro, dados) => {
            if (erro) {
              return res.status(500).send({ mensagem: erro.message })
            } else {
              return res.status(200).send(dados)
            }
          })
        }
      }
    })
  } catch (erro) {
    return res.status(500).send({ mensagem: erro.message })
  }
}

// Deletar aula
exports.deletarAula = async (req, res) => {
  const { idcurso, idaula } = req.params

  try {
    const usuario = await Usuario.findById(req.usuario_id).lean()

    if (usuario.instrutor === false && usuario.administrador === false) {
      return res.status(401).send({ mensagem: 'Usuário não autorizado' })
    }

    Curso.findById(idcurso, (erro, curso) => {
      if (erro) {
        return res.status(404).send({ mensagem: 'Curso não encontrado' })
      } else {
        const aulas = curso.aulas
        let aux = false
        const indexaula = aulas.findIndex((aula) => {
          if (aula._id == idaula) {
            return aux = true
          }
          return false
        })

        if (aux === false) {
          return res.status(404).send({ mensagem: 'Nenhuma aula encotrada' })
        } else {
          aulas.splice(indexaula, 1)
          curso.aulas = aulas
          curso.ultimaAtualizacao = new Date()

          Curso.findByIdAndUpdate(idcurso, curso, (erro) => {
            if (erro) {
              return res.status(500).send({ mensagem: erro.message })
            } else {
              return res.status(204).json({ mensagem: 'Aula deletada com sucesso' })
            }
          })
        }
      }
    })
  } catch (erro) {
    res.status(500).send({ mensagem: erro.message })
  }
}
