import estudianteService from '../services/estudiante.service.js';
import { schemaValidateAuthorizationRequest, shcemaValidateTeachersForSubject, validateHistoryParamas } from '../schemas/student.schema.js';
import fileControl from '../helpers/fileControl.js';
import { handlerHttpErrors } from '../helpers/errorhandler.js';






/*
    funciones para el control de los procesos en 
*/



/**
 * @author Andres galvis  
 * @description  -> esta funcion retorna las materias que ve el estudiante en su carrera
 * @GET 
 * @PATH :  /api/v1/student/student-subjects
 * 
 */
const getStudentSubjects = async (req, res) => {
    try {
        const id_student = req.usuario.id
        const responseGet = await estudianteService.getSubjectsAvailableToStudent(id_student);
        return res.json({
            status: true,
            message: 'Consultado correctamente.',
            subjects: responseGet
        })
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}






/**
 *  @author Andres Galvis
 *  @description  -> esta funcion retorna los profesores que dictan la misma materia para que el estudiante seleecione su profesor
 *  @GET
 *  @PATH  /api/v1/student/student-subjects/:id_materia/teacher
*/
const getTeachersForSubject = async (req, res) => {
    try {
        const validate = await shcemaValidateTeachersForSubject.validateAsync(req.params);
        const responseGet = await estudianteService.findTeachersForSubject(validate.id_materia);
        return res.json({
            status: true,
            message: 'Consultado correctamente',
            teachers: responseGet
        })
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}







/**
 *  @author Andres Galvis
 *  @description -> Hacer el envio de una solicitud de habilitacion
 */
const makeOneRequest = async (req, res) => {
    const files = req.files || {};
    const user = req.usuario;
    try {
        const { materia, referencia, profesor } = req.body;
        const data = {
            id_materia: materia,
            id_estudiante: user.id,
            id_profesor: profesor,
            referencia: referencia
        }
        // validar el request
        const validate = await schemaValidateAuthorizationRequest.validateAsync(data);
        const responseRequest = await estudianteService.makeAuthorizationRequest(validate, files);
        return res.status(201).json({
            status: true,
            message: 'Solicitud aprovada.\nPorfavor revisar el correo institucional.',
            info: responseRequest
        })
    } catch (error) {
        fileControl.removeAllFilesOfDirLoaded(files);
        handlerHttpErrors(res, error);
    }
}





/**
 * @author Andres Galvis
 * @description -> obtener el listado de las ultimas 10 solicitudes realizadas por el estudiante
*/
const getHistoryOfRequest = async (req, res) => {
    try {
        const validate = await validateHistoryParamas.validateAsync({ id_student: req.usuario.id });
        const responseGet = await estudianteService.getHistoryOfRequestByStudent(validate);
        return res.json({
            status: true,
            message: 'Consultado correctamente',
            history: responseGet
        })
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}







export default {
    getStudentSubjects,
    getTeachersForSubject,
    makeOneRequest,
    getHistoryOfRequest
}