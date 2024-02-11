import Joi from "joi";


// schema para El registro de Estudiantes
export const schemaStudentRegistration = Joi.object(
    {
        doc_id: Joi.string().min(6).max(10).trim().required().messages({
            'string.base': 'El documento de identidad presenta problemas',
            'string.min': 'El documento de identidad debe tener minimo 6 caracteres',
            'string.max': 'El documento de identidad debe tener maximo 10 caracteres',
            'any.required': 'El documento de indentidad es requerido'
        }),
        nombre: Joi.string().min(3).max(255).trim().required().messages({
            'string.base': 'El nombre presenta problemas',
            'string.min': 'El nombre debe tener minimo 3 caracteres',
            'string.max': 'El nombre debe tener maximo 255 caracteres',
            'any.required': 'El nombre es requerido'
        }),
        apellido: Joi.string().min(6).max(255).trim().required().messages({
            'string.base': 'El apellido presenta problemas',
            'string.min': 'El apellido debe tener minimo 6 caracteres',
            'string.max': 'El apellido debe tener maximo 255 caracteres',
            'any.required': 'El apellido es requerido'
        }),
        telefono: Joi.string().min(6).max(20).trim().required().messages({
            'string.base': 'Problemas con el telefono',
            'string.min': 'EL telefono debe tener minimo 6 caracteres',
            'string.max': 'El telefono no puede tener mas de 20 caracteres',
            'any.required': 'El telefono es requerido'
        }),
        correo: Joi.string().email({ minDomainSegments: 3, tlds: { allow: ['co'] } }).trim().required().messages({
            'string.base': 'Problemas en el campo de correo, verifique',
            'string.email': 'Verifique que sea un correo institucional valido',
            'any.required': 'El correo intitucional es requerido'
        }),
        clave: Joi.string().min(8).max(300).trim().required().messages({
            'string.base': 'Problemas con la contraseña',
            'string.min': 'La contraseña debe tener minimo 8 caracteres.',
            'string.max': 'La contraseña no puede tener mas de 300 caracteres',
            'any.required': 'La contraseña es requerida'
        }),
        id_carrera: Joi.number().integer().required().messages({
            'number.base': 'Seleccione la carrera a la que pertenece.'
        })
    }
);



// schema para El registro de Estudiantes
export const schemaAdminRegistration = Joi.object(
    {
        doc_id: Joi.string().min(6).max(20).trim().required().messages({
            'string.base': 'El documento de identidad presenta problemas',
            'string.min': 'El documento de identidad debe tener minimo 6 caracteres',
            'string.max': 'El documento de identidad debe tener maximo 20 caracteres',
            'any.required': 'El documento de indentidad es requerido'
        }),
        nombre: Joi.string().min(3).max(255).trim().required().messages({
            'string.base': 'El nombre presenta problemas',
            'string.min': 'El nombre debe tener minimo 3 caracteres',
            'string.max': 'El nombre debe tener maximo 255 caracteres',
            'any.required': 'El nombre es requerido'
        }),
        apellido: Joi.string().min(6).max(255).trim().required().messages({
            'string.base': 'El apellido presenta problemas',
            'string.min': 'El apellido debe tener minimo 6 caracteres',
            'string.max': 'El apellido debe tener maximo 255 caracteres',
            'any.required': 'El apellido es requerido'
        }),
        telefono: Joi.string().min(6).max(20).trim().required().messages({
            'string.base': 'Problemas con el telefono',
            'string.min': 'EL telefono debe tener minimo 6 caracteres',
            'string.max': 'El telefono no puede tener mas de 20 caracteres',
            'any.required': 'El telefono es requerido'
        }),
        correo: Joi.string().email({ minDomainSegments: 4, tlds: { allow: ['co'] } }).trim().required().messages({
            'string.base': 'Problemas en el campo de correo, verifique',
            'string.email': 'Verifique que sea un correo institucional valido',
            'any.required': 'El correo intitucional es requerido'
        }),
        clave: Joi.string().min(8).max(300).trim().required().messages({
            'string.base': 'Problemas con la contraseña',
            'string.min': 'La contraseña debe tener minimo 8 caracteres.',
            'string.max': 'La contraseña no puede tener mas de 300 caracteres',
            'any.required': 'La contraseña es requerida'
        }),
        id_coordinacion: Joi.number().integer().required().messages({
            'number.base': 'Seleccione la coordinacion a la que pertenece.'
        })
    }
);


export const schemaLogin = Joi.object(
    {
        correo: Joi.string().email({ minDomainSegments: 3,maxDomainSegments:4, tlds: { allow: ['co'] } }).trim().required().messages({
            'string.base': 'Problemas en el campo de correo, verifique',
            'string.email': 'Verifique que sea un correo institucional valido',
            'any.required': 'El correo intitucional es requerido'
        }),
        clave: Joi.string().min(8).max(300).trim().required().messages({
            'string.base': 'Problemas con la contraseña',
            'string.min': 'La contraseña debe tener minimo 8 caracteres.',
            'string.max': 'La contraseña no puede tener mas de 300 caracteres',
            'any.required': 'La contraseña es requerida'
        }),
    }
);



export const shemaIdSede = Joi.object(
    {
        id_sede: Joi.number().integer().required()
    }
)


export const shemaIdFacultad = Joi.object(
    {
        id_facultad: Joi.number().integer().required()
    }
)


export const shemaIdCoordinacion = Joi.object(
    {
        id_coordinacion: Joi.number().integer().required()
    }
)

