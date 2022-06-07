const Joi = require('joi')

exports.criarCurso =  (req, res, next) => { 
    try {
        const schemaCurso = Joi.object({
            nome: Joi.string().trim().required(),
            descricao: Joi.string().trim().required(),
            duracao: Joi.number().integer().required(),
            dataDeCriacao: Joi.date().required(),
            ultimaAtualizacao: Joi.date().required(),
            tag: Joi.array().items(Joi.string()).required(),
            aulas: Joi.array().items(Joi.object({
                nome: Joi.string().trim().required(),
                descricao: Joi.string().trim().required(),
                topicos: Joi.array().items(Joi.object({
                    titulo: Joi.string().trim().required(),
                    conteudo: Joi.string().trim().required(),
                }))

            }))
        })
        const { error } = schemaCurso.validate(req.body, { abortEarly: false })

        if (error) {
            throw error
        } else {
            return next();
        }
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

exports.atualzarCurso = async(req, res, next) => {
    try {
        const schemaCurso = Joi.object({
            nome: Joi.string().trim(),
            descricao: Joi.string().trim(),
            duracao: Joi.number().integer(),
            dataDeCriacao: Joi.date(),
            ultimaAtualizacao: Joi.date(),
            tag: Joi.array().items(Joi.string()),
            aulas: Joi.array().items(Joi.object({
                nome: Joi.string().trim(),
                descricao: Joi.string().trim(),
                topicos: Joi.array().items(Joi.object({
                    titulo: Joi.string().trim(),
                    conteudo: Joi.string().trim(),
                }))

            }))
        })
        const { error } = schemaCurso.validate(req.body, { abortEarly: false })

        if (error) {
            throw error
        } else {
            return next();
        }
    } catch (error) {
        return res.status(400).json(error.message)
    }
}