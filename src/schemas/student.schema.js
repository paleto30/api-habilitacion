import Joi from 'joi';




export const schemaValidateAuthorizationRequest = Joi.object(
    {
        id_materia: Joi.number().integer().required().messages({
            'number.base': 'El campo id_materia debe ser un número',
            'number.integer': 'El campo id_materia debe ser un número entero',
            'any.required': 'El campo id_materia es obligatorio',
        }),
        id_estudiante: Joi.number().integer().required().messages({
            'number.base': 'El campo id_estudiante debe ser un número',
            'number.integer': 'El campo id_estudiante debe ser un número entero',
            'any.required': 'El campo id_estudiante es obligatorio',
        }),
        referencia: Joi.string().trim().min(10).max(10).messages({
            'string.base': 'La referencia debe ser una cadena de texto',
            'string.empty': 'La referencia no puede estar vacía',
            'string.min': 'La referencia debe tener al menos 10 caracteres',
            'string.max': 'La referencia no puede tener más de 10 caracteres',
        })
    }
)



export const shcemaValidateTeachersForSubject = Joi.object(
    {
        id_materia: Joi.number().integer().required().messages(
            {
                'number.base': 'El campo id_materia debe ser un número',
                'number.integer': 'El campo id_materia debe ser un número entero',
                'any.required': 'El campo id_materia es obligatorio'
            }
        )
    }
);