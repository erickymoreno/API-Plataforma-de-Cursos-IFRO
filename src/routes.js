const express = require('express')
const router = express.Router()
const cursoController = require('./controllers/cursoController')
const usuarioController = require('./controllers/usuarioController')
const validateusuario = require('./validation/usuario')
const validatecurso = require('./validation/curso')
const verifyToken = require('./security/verifyToken')

// Rotas dos cursos
router.post('/curso', verifyToken, validatecurso.criarCurso, cursoController.inserir)
router.get('/curso', cursoController.paginatedResults)
router.get('/curso/nome/:nome', cursoController.listarPorNome)
router.get('/curso/:id', cursoController.listarPorId)
router.delete('/curso/:id', verifyToken, cursoController.deletar)
router.put('/curso/:id', verifyToken, validatecurso.atualzarCurso, cursoController.alterar)
router.post('/curso/:id/aula', verifyToken, cursoController.inserirAula)
router.put('/curso/:idcurso/aula/:idaula', verifyToken, cursoController.alterarAula)
router.delete('/curso/:idcurso/aula/:idaula', verifyToken, cursoController.deletarAula)

// Rotas para usuário
router.post('/login', usuarioController.login)
router.post('/cadastro', validateusuario.criarUsuario, usuarioController.inserir)
router.post('/cadastro/admin', verifyToken, validateusuario.criarAdm, usuarioController.inserirAdmin)
router.put('/usuario', verifyToken, validateusuario.alterarUsuario, usuarioController.alterar)
router.get('/usuario', verifyToken, usuarioController.ExibirPorId)
router.get('/usuario/all', usuarioController.listarTodos)// rota apenas para testes
router.post('/curso/:id/matricular', verifyToken, usuarioController.matricularEmCurso)
router.delete('/usuario', verifyToken, usuarioController.deletar)
router.get('/curso/:idcurso/aula/:idaula/topico/:idtopico/finalizar', verifyToken, usuarioController.finalizarTopico)
router.get('/curso/:idcurso/aula/:idaula/finalizar', verifyToken, usuarioController.finalizarAula)
router.get('/curso/:idcurso/finalizar', verifyToken, usuarioController.finalizarCurso)
router.get('/certificado/:idcertificado', verifyToken, usuarioController.validaCertificado)

module.exports = router
