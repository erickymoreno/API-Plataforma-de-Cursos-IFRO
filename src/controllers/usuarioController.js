const Usuario = require('../models/Usuario')
const Curso = require('../models/Curso')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');

// inserindo usuários
exports.inserir = async (req, res) => {
    try {
        const usuario = await new Usuario(req.body)

            usuario.save((erro, dados) => {
                if (erro) {
                    return res.status(400).send(erro.message)
                } else {
                    dados.senha = undefined
                    return res.status(201).send(dados)
                }
            })

    } catch (erro) {
        res.status(500).send({ mensagem: erro.message })
    }
}

// Cadastra um novo administrador/instrutor
exports.inserirAdmin = async (req, res) => {
    try {

        const usuario = await Usuario.findById(req.usuario_id).lean()

        if (usuario.administrador === false) {
          return res.status(401).send({ mensagem: 'Usuário não autorizado' })
        }

        const novoUsuario = await new Usuario(req.body)

        novoUsuario.save((erro, dados) => {
                if (erro) {
                    return res.status(400).send(erro.message)
                } else {
                    dados.senha = undefined
                    return res.status(201).send(dados)
                }
            })

    } catch (erro) {
        res.status(500).send({ mensagem: erro.message })
    }
}

// Realiza login do usuário
exports.login = async (req, res) => {
    try {
        const email = req.body.email
        const senha = req.body.senha


            const usuario = await Usuario.findOne({ email: email }).select('+senha')

            if (usuario == null) {
                return res.status(400).send({ message: 'Email ou senha inválidos' })
            }

            if (!await bcrypt.compare(senha, usuario.senha)) {
                res.status(400).send({ message: 'Senha inválida' })
            }
            const authToken = jwt.sign({
                id: usuario.id
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE_TIME
            })
            res.status(200).json({
                auth: true,
                token: authToken
            })
        
    } catch (erro) {
        res.status(500).send({ message: erro.message })
    }
}

// Realiza lofgout do usuário
exports.logout = (req, res) => {
    res.json({
      auth: false,
      token: null
    })
  }
  
// Alterar usuários
exports.alterar = async (req, res) => {
    try {
        const id = req.usuario_id

        const novousuario = await req.body
       

            Usuario.findByIdAndUpdate(id, novousuario, {new: true}, (erro, dados) => {
                if (erro) {
                    return res.status(500).send({ message: erro.mensage })
                } else {
                    res.status(200).send(dados)
                }
            })
        
    } catch (erro) {
        return res.status(500).send({ mensagem: erro.message })
    }
}

// exiber
exports.ExibirPorId = (req, res) => {
    try {
        const id = req.usuario_id

        Usuario.findById(id, (erro, dados) => {
            if (dados) {
                return res.status(200).send(dados)
            } else {
                return res.status(500).send({ mensagem: 'Usuário não encontrado'})
            }
        })
    } catch (erro) {
        return res.status(500).send({ mensagem: erro.message })
    }
}

// Listar todos usuarios (apenas para testes)
exports.listarTodos = (req, res) => {
    try {
        Usuario.find().then((dados) => {
            return res.status(200).send(dados)
        })
    } catch (erro) {
        return res.status(500).send({ mensagem: erro.message })
    }
}

// Deletando um usuario com base em seu id (apenas para teste)
exports.deletar = async (req, res) => {
    try {
        const id = req.usuario_id
        const existusuario = await Usuario.findById(id).lean()

        if(existusuario === null){ return res.status(404).send({ menssagem: 'Usuário não encontrado'})}

        Usuario.findByIdAndDelete(id, (erro) => {
            if (erro) {
                res.status(404).send({ mensagem: erro.message })
            } else {
                res.status(204).send()
            }
        })
    } catch (erro) {
        res.status(500)
        res.send({ mensagem: erro.message })
    }
}

// inscrever em um curso
exports.matricularEmCurso = (req, res) => {
    try {
        const cursoid = req.params.id
        const usuarioId = req.usuario_id

        Curso.findById(cursoid, (erro) => {
            if (erro) {
                return res.status(404).send({ mensagem: 'Curso não encontrado' })
            } else {
                Usuario.findById(usuarioId, (erro, usuario) => {
                    let exists = false
                    if (erro) {
                        return res.status(500).send({ mensagem: erro.message })
                    } else {
                        usuario.cursa.forEach((curso) => {
                            if (curso._id == cursoid) {
                                exists = true
                            }
                        })
                        if (exists) {
                            res.status(400).send({ mensagem: 'Usuário já está matriculado nesse curso' })
                        } else {
                            usuario.cursa.push({ _id: cursoid, dataDeInicio: new Date(), status: 'Cursando'})

                            Usuario.findByIdAndUpdate(usuarioId, usuario, {new: true}, (erro, dados) => {
                                if (erro) {
                                    return res.status(500).send({ messagem: erro.message })
                                } else {
                                    return res.status(200).send(dados)
                                }
                            })
                        }
                    }
                })
            }
        })
    } catch (erro) {
        res.status(500).send({ mensagem: erro.message })
    }
}

// finalizar um topico
exports.finalizarTopico = async (req, res) => {

    try {
        const iduser = req.usuario_id
        const { idcurso, idaula, idtopico } = req.params
        const cursoPaylod = await Curso.findById(idcurso).lean()
        const usuario = await Usuario.findById(iduser).lean()
        const cursa = usuario.cursa
        let existCurso = false
        let existAula = false
        let existTopico = false

        if (cursoPaylod === null) { return res.status(404).send({ messagem: 'Curso não encontrado' }) }

        cursoPaylod.aulas.forEach((aula) => {
            if (JSON.stringify(aula._id) === JSON.stringify(idaula)) {
                aula.topicos.forEach((topico) => {
                    if (JSON.stringify(topico._id) === JSON.stringify(idtopico)) {
                        return existTopico = true
                    }
                })
                return existAula = true
            }
        })

        if (!existAula) { return res.status(404).send({ messagem: 'Aula não encontrada' }) }
        if (!existTopico) { return res.status(404).send({ messagem: 'Topico não encontrado' }) }

            cursa.forEach((curso) => {
                if (curso._id == idcurso) {
                    if(curso.aulas.length > 0) {
                    curso.aulas.forEach((aula) => {
                        if (aula._id == idaula) {
                            if (aula.topicosConcluidos.includes(idtopico)) {
                                return true
                            } else {
                                aula.topicosConcluidos.push(idtopico)
                            }
                            existAula = true
                        }  
                        
                    })
                } else {existAula = false}
                    existCurso = true
                }
            })

        if (existCurso === false) {
            return res.status(404).send({ mensagem: 'Usuário não está matriculado no curso'})
        }
    
        if(existAula === false) {
            cursa.forEach((curso) => {
                if (curso._id == idcurso) {
                    curso.aulas.push({_id: idaula, status: 'cursando', topicosConcluidos:[idtopico]})
                }
            })
        }
        
        usuario.cursa = cursa

        Usuario.findByIdAndUpdate(iduser, usuario, {new: true}, (erro, usuario) => {
            if (erro) { return res.status(500).send({ erro: erro.mensage }) }
            res.status(200).send(usuario)
        })

    } catch (erro) {
        return res.status(500).send({ error: erro.message })
    }
}

// finalizar aula
exports.finalizarAula = async (req, res) => {
    const iduser = req.usuario_id
    const { idcurso, idaula } = req.params
    let quantTopicosAula = 0
    let quantTopicosConcluidos = 0
    try {
        const curso = await Curso.findById(idcurso).lean()
        const usuario = await Usuario.findById(iduser).lean()
        const cursa = usuario.cursa
        
        curso.aulas.forEach((aula) => {
            if (aula._id == idaula) {
                quantTopicosAula += aula.topicos.length
            }
        })

        cursa.forEach((curso) => {
            if (curso._id == idcurso) {
                curso.aulas.forEach((aula) => {
                    if (aula._id == idaula) {
                        quantTopicosConcluidos += aula.topicosConcluidos.length
                    }
                })
            }
        })

        if(quantTopicosConcluidos === quantTopicosAula){
            cursa.forEach((curso) => {
                if (curso._id == idcurso) {
                    curso.aulas.forEach((aula) => {
                        if (aula._id == idaula) {
                            aula.status = "concluido"
                        }
                    })
                }
            })
        }
        else {
            return res.status(200).send({ mensagem: 'Usuário não concluiu todos os topicos'})
        }
        usuario.cursa = cursa

        Usuario.findByIdAndUpdate(iduser, usuario,(erro) =>{
            if(erro){ return res.status(500).send({erro: erro.mensage})}
            return res.status(200).send({ mensagem: 'Aula finalizada com sucesso'})
        })

    } catch (erro) {
        return res.status(500).send({ error: erro.message })
    }
}

//finalizar curso
exports.finalizarCurso = async (req, res) => {
    const iduser = req.usuario_id
    const { idcurso } = req.params
    let quantAulasCurso = 0
    let quantAulasConcluidos = 0
    try {
        const curso = await Curso.findById(idcurso).lean()
        const usuario = await Usuario.findById(iduser).lean()
        const cursa = usuario.cursa
        
        quantAulasCurso = curso.aulas.length
      
        cursa.forEach((curso) => {
            if (curso._id == idcurso) {
                curso.aulas.forEach((aula) => {
                    if (aula.status = "concluido") {
                        quantAulasConcluidos += 1
                    }
                })
            }
        })
        if(quantAulasConcluidos ===  quantAulasCurso){
            cursa.forEach((curso) => {
                if (curso._id == idcurso) {
                    curso.status = "concluido"
                    curso.dataDeTermino = new Date()
                    curso.certificado  = uuidv4()
                }
            })
        } else{
            return res.status(200).send({ mensagem: 'Usuário não concluiu todas as aulas'})
        }

        usuario.cursa = cursa

        Usuario.findByIdAndUpdate(iduser, usuario,(erro) =>{
            if(erro){ return res.status(500).send({erro: erro.mensage})}
            return res.status(200).send({ mensagem: 'Curso finalizado com sucesso'})
        })
        
    } catch (erro) {
        return res.status(500).send({ error: erro.message })
    }
}

// validar certificado
exports.validaCertificado = async (req, res) => {
    try {
    
        const {idcertificado} = req.params
        const usuarios = await Usuario.find().lean()
        let existCertificado = false
        
        usuarios.forEach((usuario) =>{
            usuario.cursa.forEach((curso)=>{
                if(curso.status === 'concluido'){
                    if(curso.certificado == idcertificado){
                        return existCertificado = true                
                    }
                }
            })
        })

        if(existCertificado){
            return res.status(200).send({ messagem: 'Certificado válido'})
        } else {
            return res.status(200).send({ messagem: 'Certificado inválido'})
        }
    
    } catch (erro) {
        return res.status(500).send({ error: erro.message })   
    }
}