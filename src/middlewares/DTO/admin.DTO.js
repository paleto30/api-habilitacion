import { handlerHttpErrors } from '../../helpers/errorhandler.js'
import { schemaValidateQueryParamsFilters } from '../../schemas/admins.schema.js'



// DTO para ruta de estudiantes en admin (filtros)
export const DTOvalidateQueryFilters = async (req, res, next) => {
    try {
        req.query.id_coo = req.usuario.id_coordinacion
        const validate = await schemaValidateQueryParamsFilters.validateAsync(req.query);
        req.paramsDTO = validate;
        console.log(validate);
        next();
    } catch (error) {
        handlerHttpErrors(res, error.message);
    }
}