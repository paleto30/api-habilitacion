import { handlerHttpErrors } from '../../helpers/errorhandler.js'
import { schemaValidareNameFile, schemaValidateQueryParamsFilters, schemaValidateRecoveryDetails, schemaValidateRecoveryTable } from '../../schemas/recoveries.schema.js'



// DTO para ruta de estudiantes en admin (filtros)
export const DTOvalidateQueryFilters = async (req, res, next) => {
    try {
        req.query.id_coo = req.usuario.id_coordinacion
        const validate = await schemaValidateQueryParamsFilters.validateAsync(req.query);
        req.paramsDTO = validate;
        next();
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}



// DTO para ruta de habilitaciones admin (filtros)
export const DTOvalidateRecoveryTable = async (req, res, next) => {
    try {
        req.query.id_coo = req.usuario.id_coordinacion;
        const validate = await schemaValidateRecoveryTable.validateAsync(req.query);

        req.DTO = validate;
        next();
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}


// DTO para ruta de optener los detalles de la habilitacion
export const DTOvalidateRecoveryDetails = async (req, res, next) => {
    try {
        const validate = await schemaValidateRecoveryDetails.validateAsync(req.params);
        req.DTO = validate;
        next();
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}



export const DTOvalidateNameFile = async (req, res, next) => {
    try {
        const validate = await schemaValidareNameFile.validateAsync(req.params);
        req.DTO = validate
        next();
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}
