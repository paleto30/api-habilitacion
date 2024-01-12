import Joi from "joi";



export const schemaValidateQueryParamsFilters = Joi.object(
    {
        id_coo: Joi.number().integer().required(),
        doc_id: Joi.number().integer(),
        last_name: Joi.string(),
        first_name: Joi.string(),
        phone: Joi.number().integer(),
        email: Joi.string().trim(),
        page: Joi.number().integer(),
        amount: Joi.number().integer()
    }
);