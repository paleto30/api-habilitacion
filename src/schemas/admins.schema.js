import Joi from "joi";


// esquema para validar los parametros de la tabla de estudiantes
export const schemaValidateQueryParamsFilters = Joi.object(
    {
        id_coo: Joi.number().integer().required().messages(
            {
                'any.required': 'El id de la coordinacion es requerido.'
            }
        ),
        doc_id: Joi.number().integer().messages(
            {
                'number.base': 'El formato de la identificación debe ser numerico'
            }
        ),
        last_name: Joi.string().regex(/^[a-zA-Z\s]*$/).message('El texto que ingreso no es un apellido.'),
        first_name: Joi.string().regex(/^[a-zA-Z\s]*$/).message('El texto que ingreso no es un nombre.'),
        phone: Joi.number().integer().messages(
            {
                'number.base': 'El telefono debe ser un numero.'
            }
        ),
        email: Joi.string().trim(),
        page: Joi.number().integer(),
        amount: Joi.number().integer()
    }
);



// esquema para validar los parametros de la tabla de habilitaciones
export const schemaValidateRecoveryTable = Joi.object(
    {
        id_coo: Joi.number().integer().required(),
        reference: Joi.number().integer().messages(
            {
                'number.base': 'La referencia debe ser un numero.',
                'number.integer': 'La referencia debe ser un numero entero.'
            }
        ),
        student: Joi.string().regex(/^[a-zA-Z\s]*$/).message('El texto que ingreso no es un nombre.'),
        page: Joi.number().integer(),
        amount: Joi.number().integer()
    }
)