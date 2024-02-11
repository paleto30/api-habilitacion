"use strict";
import { handlerHttpErrors } from "../../helpers/errorhandler.js";
import { createNewSchema, getByIdSchema, updateSchema } from "../../schemas/administrator.schema.js";







// DTO para validar la busqueda de uno por ID
export const getByIdDto = async (req, res, next) => {
    try {
        const validate = await getByIdSchema.validateAsync(req.params);
        req.dto = validate;
        next();
    } catch (error) {
        handlerHttpErrors(res, error);
    }
};



// DTO para validar la creacion de un administrador
export const createNewDTO = async (req, res, next) => {
    try {
        const validate = await createNewSchema.validateAsync(req.body);
        req.dto = validate;
        next()
    } catch (error) {
        handlerHttpErrors(res, error)
    }
}


export const updateDto = async (req, res, next) => {
    try {
        req.body.id = req.params.id;
        const validate = await updateSchema.validateAsync(req.body);
        req.dto = validate;
        next();
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}


