import { handlerHttpErrors } from "../helpers/errorhandler.js"
import adminService from "../services/admin.service.js";




/**
 *  @description funcion para obtener el listado de estudiantes , y aplicar los filtros en caso de necesitarlos
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



export default {
    getStudentList
}