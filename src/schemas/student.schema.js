import Joi from 'joi';




export const schemaValidateAuthorizationRequest = Joi.object(
    {
        id_materia: Joi.number().integer().required().messages({
            'number.base': 'El campo materia debe ser un número',
            'number.integer': 'El campo materia debe ser un número entero',
            'any.required': 'El campo materia es obligatorio',
        }),
        id_estudiante: Joi.number().integer().required().messages({
            'number.base': 'El campo estudiante debe ser un número',
            'number.integer': 'El campo estudiante debe ser un número entero',
            'any.required': 'El campo estudiante es obligatorio',
        }),
        id_profesor: Joi.number().integer().required().messages({
            'number.base': 'El campo profesor debe ser un número',
            'number.integer': 'El campo profesor debe ser un número entero',
            'any.required': 'El campo profesor es obligatorio',
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
                'number.base': 'El campo materia debe ser un número',
                'number.integer': 'El campo materia debe ser un número entero',
                'any.required': 'El campo materia es obligatorio'
            }
        )
    }
);


export const validateHistoryParamas = Joi.object(
    {
        id_student: Joi.number().integer().required().messages(
            {
                'number.base': 'el id estudiante debe ser un número',
                'number.integer': 'El id estudiante debe ser un número entero',
                'any.required': 'El id estudiante es obligatorio'
            }
        ),
    }
);


