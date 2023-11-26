import estudianteService from '../services/estudiante.service.js';
import { schemaValidateAuthorizationRequest, shcemaValidateTeachersForSubject } from '../schemas/student.schema.js';
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

    const errorResponse = {
        'ID_IS_INVALID': { status: 409, error: 'El ID no es valido' },
        'RECORD_NOT_FOUND': { status: 404, error: 'El Estudiante no existe en la base de datos' },
    }

    try {
        const id_student = req.usuario.id
        const responseGet = await estudianteService.getSubjectsAvailableToStudent(id_student);

        const errorCase = errorResponse[responseGet];
        if (errorCase) return res.status(errorCase.status).json({ status: false, error: errorCase.error });

        return res.json({
            status: true,
            message: 'Consultado correctamente.',
            subjects: responseGet
        })

    } catch (error) {
        handlerHttpErrors(res, error.message);
    }
}




/**
 *  @author Andres Galvis
 *  @description  -> esta funcion retorna los profesores que dictan la misma materia para que el estudiante seleecione su profesor
 *  @GET
 *  @PATH  /api/v1/student/student-subjects/:id_materia/teacher
*/
const getTeachersForSubject = async (req, res) => {
    const errorRes = {
        'SUBJECT_NOT_FOUND': { status: 404, error: 'La Materia que ingreso no existe.' }
    }
    try {
        const validate = await shcemaValidateTeachersForSubject.validateAsync(req.params);
        const responseGet = await estudianteService.findTeachersForSubject(validate.id_materia);
        const errorCase = errorRes[responseGet];
        if (errorCase) return res.status(errorCase.status).json({ status: false, error: errorCase.error });

        return res.json({
            status: true,
            message: 'Consultado correctamente',
            teachers: responseGet
        })
    } catch (error) {
        handlerHttpErrors(res, error.message);
    }
}



/**
 *  @author Andres Galvis
 *  @description -> Hacer el envio de una solicitud de habilitacion
 */
const makeOneRequest = async (req, res) => {

    const errorResponse = {
        'STUDENT_NOT_FOUND': { status: 404, error: 'El estudiante que solicita la habilitacion no existe en el sistema' },
        'SUBJECT_NOT_FOUND': { status: 404, error: 'La materia que solicita habilitar no existe' },
        'REFERENCE_NOT_VALID': { status: 422, error: 'EL numero de referencia que ingreso no es valido. porfavor verifique.' },
        'UNPAID_REFERENCE': { status: 422, error: 'Debe pagar el valor de la referencia, antes de solicitar la habilitacion' },
        'EXISTING_REFERENCE': { status: 409, error: 'La referencia que ingreso ya esta registrada, genere una nueva referencia para realizar la solicitud.' },
        'INCOMPLETE_FILES': { status: 422, error: 'Los archivos necesarios para la solicitud no fueron cargados, porfavor verifique.' },
        'INCORRECT_FILES': { status: 422, error: 'Los archivos cargados no son procesables.' }
    }

    const files = req.files || {};
    const user = req.usuario;

    try {
        const { materia, referencia } = req.body;

        const data = {
            id_materia: materia,
            id_estudiante: user.id,
            referencia: referencia
        }
        // validar el request
        const validate = await schemaValidateAuthorizationRequest.validateAsync(data);
        const responseRequest = await estudianteService.makeAuthorizationRequest(validate, files);

        const errorCase = errorResponse[responseRequest];
        if (errorCase) {
            fileControl.removeAllFilesOfDirLoaded(files);
            return res.status(errorCase.status).json({ status: false, error: errorCase.error });
        }

        return res.status(201).json({
            status: true,
            message: 'respuesta del request',
            info: responseRequest
        })
    } catch (error) {
        fileControl.removeAllFilesOfDirLoaded(files);
        handlerHttpErrors(res, error.message);
    }
}









export default {
    getStudentSubjects,
    getTeachersForSubject,
    makeOneRequest,
}