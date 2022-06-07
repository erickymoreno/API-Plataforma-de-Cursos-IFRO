const Joi = require('joi')

exports.criarUsuario = async (req, res, next) => {
    try {
        const schema = Joi.object({
            nome: Joi.string().trim().required(),
            email: Joi.string().email().trim().required(),
            dataDeNascimento: Joi.date().required(),
            senha: Joi.string().trim().min(8).max(50).required(),
            fotoDePerfil: Joi.string(),
        })
        const { error } = schema.validate(req.body, { abortEarly: false })
        if (error){
             throw error
        }else{
            return next();
        }

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

exports.alterarUsuario = async (req, res, next) => {
    try {
        const schema = Joi.object({
            nome: Joi.string().trim(),
            email: Joi.string().email().trim(),
            dataDeNascimento: Joi.date(),
            senha: Joi.string().trim().min(8).max(50),
            fotoDePerfil: Joi.string(),
        })
        const { error } = schema.validate(req.body, { abortEarly: false })
        if (error){
             throw error
        }else{
            return next();
        }

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

exports.criarAdm = async (req, res, next) => {
    if(checkusuario === false) { return res.status(401).json('Usuário sem autorização')}
    try {
        const schema = Joi.object({
            nome: Joi.string().trim().required(),
            email: Joi.string().email().trim().required(),
            dataDeNascimento: Joi.date().required(),
            senha: Joi.string().trim().min(8).max(50).required(),
            fotoDePerfil: Joi.string(),
            instrutor: Joi.boolean().required(),
            administrador: Joi.boolean().required()

        })
        const { error } = schema.validate(req.body, { abortEarly: false })
        if (error){
             throw error
        }else{
            return next();
        }

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

async function checkusuario(){
    const userid = req.usuario_id

    Usuario.findById(userid,(erro, usuario) => {
        if(usuario.administrator === true){
            return true
        } else { return false }
    })

}