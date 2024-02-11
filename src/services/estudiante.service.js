import { QueryTypes } from 'sequelize';
import db, { getDbInstance } from '../db/conexion.js';
import EstudianteModel from '../models/estudiante.model.js';
import MateriaModel from '../models/materia.model.js';
import HabilitacionModel from '../models/habilitaciones.model.js';
import fileControl from '../helpers/fileControl.js';
import ProfesorModel from '../models/profesor.model.js';
import { sendEmail } from '../helpers/emailHandler.js';
import { getTemplateToSendTeacher, getTheEnablementEmailTemplate } from '../helpers/templatesHtml.js';
import { ConflictException, NotFoundException, UnprocessableException } from '../helpers/classError.js';


/*
    funcion para obtener las materias disponibles para el estudiante habilitar
*/
const getSubjectsAvailableToStudent = async (id_student) => {
    try {

        const existStudent = await EstudianteModel.findByPk(id_student);
        if (!existStudent)
            throw new NotFoundException('El estudiante no existe.');

        const results = await db.query(`
            SELECT tg_ma.id as id_materia, tg_ma.codigo, tg_ma.nombre 
            from tg_estudiante as tg_e
            INNER JOIN tg_carrera as tg_c on tg_e.id_carrera = tg_c.id
            INNER JOIN tg_pensum as tg_p on tg_c.id = tg_p.id_carrera
            INNER JOIN tr_pensum_materias as trpm on tg_p.id = trpm.id_pensum
            INNER JOIN tg_materia as tg_ma on trpm.id_materia = tg_ma.id
            WHERE tg_e.id = :id_student
            ORDER BY tg_ma.nombre
        `,
            {
                replacements: { id_student }, type: QueryTypes.SELECT
            });
        return results;
    } catch (error) {
        throw error;
    }
}


/* 
    consumir DB con referencias generadas de la universidad
*/
async function getEnableReference(ref) {
    try {
        const endpointDB = `http://localhost:4300/referencias_plataforma?REF_PAY_GENERATED=${ref}`;
        const request = await fetch(endpointDB);
        const data = await request.json();
        return data.length == 0 ? null : data[0];
    } catch (error) {
        throw error;
    }
}



/*
    encontrar profesores que dictan una determinada materia
*/
const findTeachersForSubject = async (id_materia) => {
    try {
        const validSubject = await MateriaModel.findByPk(id_materia);
        if (!validSubject)
            throw new NotFoundException('La Materia que ingreso no existe.');

        const teacherForSubject = await db.query(`
            SELECT tg_p.id, CONCAT(tg_p.nombre," ",tg_p.apellido) as nombre
            from tg_profesor as tg_p
            INNER JOIN tr_materia_profesor as tr_mp ON tg_p.id = tr_mp.id_profesor
            INNER JOIN tg_materia as tg_m ON tr_mp.id_materia = tg_m.id
            WHERE tg_m.id = :id_materia
            ORDER by tg_p.nombre ASC, tg_p.apellido ASC
        `, {
            replacements: { id_materia },
            type: QueryTypes.SELECT
        });

        return teacherForSubject;

    } catch (error) {
        throw error;
    }
}



/*
    funcion para realizar una solicitud de habilitacion 
*/
const makeAuthorizationRequest = async (request, files) => {
    const dbInstance = getDbInstance();
    const t = await dbInstance.transaction();
    try {

        const existStudent = await EstudianteModel.findByPk(request.id_estudiante);
        if (!existStudent) throw new NotFoundException('El estudiante que solicita la habilitacion no existe en el sistema.');

        const existSubject = await MateriaModel.findByPk(request.id_materia);
        if (!existSubject) throw new NotFoundException('La materia que solicita habilitar no existe.');

        const existeTeacher = await ProfesorModel.findByPk(request.id_profesor);
        if (!existeTeacher) throw new NotFoundException('El profesor no existe');

        // validar que la referencia haya sido generada por el sistema uts
        const legalReference = await getEnableReference(`${request.referencia}`);
        if (!legalReference) throw new UnprocessableException('El numero de referencia que ingreso no es valido. porfavor verifique.');;
        // validar que la referencia este en un estado pago 
        if (!legalReference.estado_pago) throw new UnprocessableException('Debe pagar el valor de la referencia, antes de solicitar la habilitación.');

        // validar que la referencia no haya sido registrada antes en el nuevo sistema
        const uniqueReference = await HabilitacionModel.findOne({ where: { referencia_pago: request.referencia } })
        if (uniqueReference) throw new ConflictException('La referencia que ingreso ya esta registrada, genere una nueva referencia para realizar la solicitud.');

        if (Object.keys(files).length !== 2) throw new UnprocessableException('Los archivos necesarios para la solicitud no fueron cargados, porfavor verifique.');

        // verificamos la validez de los archivos y revisamos si son los esperados. validamos si el objeto files cumple con lo que esperamos que llegue
        if (!fileControl.validateFilesObjectKeys(files)) {
            fileControl.removeAllFilesOfDirLoaded(files);
            throw new UnprocessableException('Los archivos cargados no son procesables.');
        }

        const newAuthorization = await HabilitacionModel.create({
            referencia_pago: request.referencia,
            id_estudiante: existStudent.id,
            id_materia: existSubject.id,
            id_profesor: existeTeacher.id,
            img_factura: files['pdf'][0].filename,
            img_recibo_pago: files['imagen'][0].filename
        }, { transaction: t });

        // envio de correo a estudiante y profesor 
        const { responseEmailStudent, responseEmailTeacher } = await sendProcessEmails(existStudent, existeTeacher, existSubject, legalReference.REF_PAY_GENERATED, getfotmatDate(newAuthorization.createdAt));

        fileControl.relocateTheFile(files['pdf'][0].path, `storage/pdf/${files['pdf'][0].filename}`)
        fileControl.relocateTheFile(files['imagen'][0].path, `storage/images/${files['imagen'][0].filename}`)

        await t.commit();
        await dbInstance.close();

        return {
            id: newAuthorization.id,
            referencia: newAuthorization.referencia_pago,
            materia: existSubject.nombre,
            estudiante: `${existStudent.nombre} ${existStudent.apellido}`,
            emailStudent: responseEmailStudent,
            emailTeacher: responseEmailTeacher
        };
    } catch (error) {
        await t.rollback();
        await dbInstance.close();
        throw error;
    }
}


//funcion formato fecha
function getfotmatDate(date) {
    const dateFormat = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
    })
    return dateFormat.format(date);
}

// funcion para envio de emails
async function sendProcessEmails(student, teacher, subject, reference, fecha_aprobacion) {
    try {

        const templateStudent = getTheEnablementEmailTemplate(student, subject.nombre, reference, teacher, fecha_aprobacion);
        const templateTeacher = getTemplateToSendTeacher(teacher, student, subject.nombre, reference, fecha_aprobacion);

        const [responseEmailStudent, responseEmailTeacher] = await Promise.all([
            sendEmail(student.correo, 'Informacion Solicitud de Habilitacion.', templateStudent),
            sendEmail(teacher.correo, 'Solicitud de habilitación.', templateTeacher)
        ]);

        return { responseEmailStudent, responseEmailTeacher };
    } catch (error) {
        throw error;
    }
}




const getHistoryOfRequestByStudent = async ({ id_student }) => {
    try {

        const student = await EstudianteModel.findByPk(id_student);
        if (!student)
            throw new NotFoundException('El estudiante no existe');

        const listOfRequest = await db.query(`
            SELECT 
                tg_h.id,
                tg_h.referencia_pago,
                tg_m.nombre AS materia,
                CONCAT(tg_p.nombre, ' ', tg_p.apellido) AS profesor,
                tg_p.correo AS correo_profesor,
                DATE_FORMAT(tg_h.created_at, '%Y-%m-%d') AS fecha_aprobacion
            FROM tg_habilitaciones AS tg_h
            JOIN tg_materia AS tg_m ON tg_h.id_materia = tg_m.id
            JOIN tg_profesor AS tg_p ON tg_h.id_profesor = tg_p.id
            JOIN tg_estudiante AS tg_e ON tg_h.id_estudiante = tg_e.id
            WHERE tg_e.id = :id_student
            ORDER BY tg_h.id desc
        `, {
            replacements: { id_student: id_student },
            type: QueryTypes.SELECT
        });

        return listOfRequest;
    } catch (error) {
        throw error
    }
}




export default {
    getSubjectsAvailableToStudent,
    findTeachersForSubject,
    makeAuthorizationRequest,
    getHistoryOfRequestByStudent
}