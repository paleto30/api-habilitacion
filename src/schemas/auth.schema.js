import Joi from "joi";


// schema para El registro de Estudiantes
const schemaStudenRegistration = Joi.object(
    {
        doc_id: Joi.string().min(6).max(20).trim().required(),
        nombre: Joi.string().min(3).max(255).trim().required(),
        apellido: Joi.string().min(6).max(255).trim().required(),
        telefono: Joi.string().min(6).max(20).trim().required(),
        correo: Joi.string().email({ minDomainSegments: 3, tlds: { allow: ['co'] } }).trim().required(),
        clave: Joi.string().min(8).max(300).trim().required(),
        id_carrera: Joi.number().integer().required()
    }
);