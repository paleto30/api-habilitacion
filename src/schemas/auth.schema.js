import Joi from "joi";


// schema para El registro de Estudiantes
export const schemaStudenRegistration = Joi.object(
    {
        doc_id: Joi.string().min(6).max(20).trim().required().messages({
            'string.base': 'El documento de identidad presenta problemas',
            'string.min':'El documento de identidad debe tener minimo 6 caracteres',
            'string.max': 'El documento de identidad debe tener maximo 20 caracteres',
            'any.required': 'El documento de indentidad es requerido'
        }),
        nombre: Joi.string().min(3).max(255).trim().required().messages({
            'string.base': 'El nombre presenta problemas',
            'string.min':'El nombre debe tener minimo 3 caracteres',
            'string.max': 'El nombre debe tener maximo 255 caracteres',
            'any.required': 'El nombre es requerido'
        }),
        apellido: Joi.string().min(6).max(255).trim().required().messages({
            'string.base': 'El apellido presenta problemas',
            'string.min':'El apellido debe tener minimo 6 caracteres',
            'string.max': 'El apellido debe tener maximo 255 caracteres',
            'any.required': 'El apellido es requerido'
        }),
        telefono: Joi.string().min(6).max(20).trim().required(),
        correo: Joi.string().email({ minDomainSegments: 3, tlds: { allow: ['co'] } }).trim().required(),
        clave: Joi.string().min(8).max(300).trim().required(),
        id_carrera: Joi.number().integer().required()
    }
);