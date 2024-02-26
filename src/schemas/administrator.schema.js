"use strict"
import Joi from 'joi';





// dto para buscar un registro por ID
export const getByIdSchema = Joi.object(
    {
        id: Joi.number().integer().required()
    }
)



// echema para validar la creacion de un admin
export const createNewSchema = Joi.object(
    {
        doc_id: Joi.string().trim().max(20).min(6).required(),
        nombre: Joi.string().trim().max(255).required(),
        apellido: Joi.string().trim().max(255).required(),
        telefono: Joi.string().trim().max(255).required(),
        correo: Joi.string().trim().email().max(255).required(),
        clave: Joi.string().trim().min(8).max(100).required(),
        id_coordinacion: Joi.number().integer().required(),
        rol: Joi.number().integer().valid(1, 2).required(),
    }
)


// echema para validar la actualizacion de un admin
export const updateSchema = Joi.object(
    {
        id: Joi.number().integer().required(),
        doc_id: Joi.string().trim().max(20).min(6).required(),
        nombre: Joi.string().trim().max(255).required(),
        apellido: Joi.string().trim().max(255).required(),
        telefono: Joi.string().trim().max(255).required(),
        correo: Joi.string().trim().email().max(255).required(),
        clave: Joi.string().trim().max(100).required(),
        id_coordinacion: Joi.number().integer().required(),
        rol: Joi.number().integer().valid(1, 2).required(),
    }
)


//
export const validaQuerysFilterSchema = Joi.object(
    {
        doc_id: Joi.number().integer().messages(
            {
                'number.base': 'El formato de la identificación debe ser numerico'
            }
        ),
        name: Joi.string().regex(/^[a-zA-Z\s]*$/).message('El texto que ingreso no es un nombre.'),
        email: Joi.string().email({ minDomainSegments: 3,maxDomainSegments:4, tlds: { allow: ['co'] } }).trim(),
        page: Joi.number().integer(),
        amount: Joi.number().integer()
    }
);