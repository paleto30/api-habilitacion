import { handlerHttpErrors } from "../helpers/errorhandler.js"
import adminService from "../services/admin.service.js";




/**
 * @author Andres Galvis
 * @description funcion para obtener el listado de estudiantes , y aplicar los filtros en caso de necesitarlos
 * @GET
 * @PATH /api/v1/admins/student-list
 * @param  
 *       { 
 *          id_coo -> integer, required 
 *          doc_id -> integer, optional
 *          last_name -> string, optional
 *          first_name -> string, optional
 *          phone -> integer, optional
 *          email -> string, optional
 *          page -> integer, optional
 *          amount -> integer, optional
 *       }
 */
const getStudentList = async (req, res) => {
    try {
        const id_coordinacion = req.paramsDTO.id_coo;
        delete req.paramsDTO.id_coo
        const response = await adminService.getStudentListFilter(req.paramsDTO, id_coordinacion);
        return res.status(200).json({
            status: true,
            message: 'Consultado correctamente',
            response
        })
    } catch (error) {
        handlerHttpErrors(res, error.message);
    }
}





/**
 * @author Andres Galvis
 * @description Funcion para obtener el listado de habilitaciones paginado y filtrarlo 
 * @GET
 * @PATH /api/v1/admins/recovery-list
 * @param 
 *      {
 *          id_coo -> integer, required,
 *          reference -> integer, optional
 *          student -> string, optional
 *          page -> integer, optional
 *          amount -> integer, optional
 *      }
 */
const getQualificationsList = async (req, res) => {
    try {
        const id_coordinacion = req.DTO.id_coo;
        delete req.DTO.id_coo;
        const response = await adminService.getRecoveryListFilter(req.DTO, id_coordinacion);
        return res.status(200).json({
            status: true,
            message: 'Consultado correctamente',
            response
        });
    } catch (error) {
        handlerHttpErrors(req, error.message, error);
    }
}





/**
 * @author Andres Galvis
 * @description Funcion para obtener los datos detalles de la habilitacion
 * @GET
 * @PATH /api/v1/admins/recovery-details/:id_recovery
*/
const getDetailsInformacion = async (req, res) => {
    const errorRes = {
        'RECOVERY_NOT_FOUND': { status: 404, error: 'El registro de habilitacion no fue encontrado.' }
    }
    try {
        const response = await adminService.getRecoveryDetails(req.DTO);
        const errorCase = errorRes[response];
        if (errorCase) return res.status(errorCase.status).json({ status: false, error: errorCase.error });
        return res.json({
            status: true,
            message: 'Consultado correctamente',
            response
        });
    } catch (error) {
        handlerHttpErrors(res, error.message);
    }
}


export default {
    getStudentList,
    getQualificationsList,
    getDetailsInformacion
}