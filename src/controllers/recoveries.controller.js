import { handlerHttpErrors } from "../helpers/errorhandler.js"
import recoveriesService from "../services/recoveries.service.js";




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
        const response = await recoveriesService.getStudentListFilter(req.paramsDTO, id_coordinacion);
        return res.status(200).json({
            status: true,
            message: 'Consultado correctamente',
            response
        })
    } catch (error) {
        handlerHttpErrors(res, error);
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
        const response = await recoveriesService.getRecoveryListFilter(req.DTO, id_coordinacion);
        return res.status(200).json({
            status: true,
            message: 'Consultado correctamente',
            response
        });
    } catch (error) {
        handlerHttpErrors(req, error);
    }
}





/**
 * @author Andres Galvis
 * @description Funcion para obtener los datos detalles de la habilitacion
 * @GET
 * @PATH /api/v1/admins/recovery-details/:id_recovery
*/
const getDetailsInformacion = async (req, res) => {
    try {
        const response = await recoveriesService.getRecoveryDetails(req.DTO);
        return res.json({
            status: true,
            message: 'Consultado correctamente',
            response
        });
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}



/**
 * @author Andres Galvis
 * @description Funcion para retornar el pdf de solicitud habilitacion
 * @GET
 * @PATH  /api/v1/admins/view-pdf/:name
*/
const sendPdfFile = async (req, res) => {
    try {
        const response = await recoveriesService.sendPdf(req.DTO.name)
        res.sendFile(response)
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}



/**
 * @author Andres Galvis
 * @description Funcion para retornar el pdf de solicitud habilitacion
 * @GET
 * @PATH  /api/v1/admins/view-img/:name
*/
const sendImgFile = async (req, res) => {
    try {
        const response = await recoveriesService.sendImage(req.DTO.name)
        res.sendFile(response)
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}












export default {
    getStudentList,
    getQualificationsList,
    getDetailsInformacion,
    sendPdfFile,
    sendImgFile
}