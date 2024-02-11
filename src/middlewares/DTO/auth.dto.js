import { handlerHttpErrors } from "../../helpers/errorhandler.js"
import { schemaLogin, schemaStudentRegistration, shemaIdCoordinacion, shemaIdFacultad, shemaIdSede } from "../../schemas/auth.schema.js";






export const dtoSedeId = async (req, res, next) => {
    try {
        const validate = await shemaIdSede.validateAsync(req.params);
        req.dto = validate;
        next()
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}


export const dtoFacultadId = async (req, res, next) => {
    try {
        const validate = await shemaIdFacultad.validateAsync(req.params);
        req.dto = validate;
        next()
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}


export const dtoCoordinaciondId = async (req, res, next) => {
    try {
        const validate = await shemaIdCoordinacion.validateAsync(req.params);
        req.dto = validate;
        next()
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}


export const dtoLogin = async (req, res, next) => {
    try {
        const validate = await schemaLogin.validateAsync(req.body);
        req.dto = validate;
        next();
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}



export const dtoRegisterStudent = async (req, res, next) => {
    try {
        const validate = await schemaStudentRegistration.validateAsync(req.body);
        req.dto = validate;
        next()
    } catch (error) {
        handlerHttpErrors(res, error)
    }
}