import { QueryTypes } from 'sequelize';
import db, { getDbInstance } from '../db/conexion.js';
import EstudianteModel from '../models/estudiante.model.js';
import { idIsNumber } from '../helpers/errorhandler.js';
import MateriaModel from '../models/materia.model.js';
import HabilitacionModel from '../models/habilitaciones.model.js';
import fileControl from '../helpers/fileControl.js';


/*
    funcion para obtener las materias disponibles para el estudiante habilitar
*/
const getSubjectsAvailableToStudent = async (id_student) => {
    try {
        if (!idIsNumber(id_student)) return "ID_IS_INVALID";

        const existStudent = await EstudianteModel.findByPk(id_student);
        if (!existStudent) return "RECORD_NOT_FOUND";

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
        if (!validSubject) return "SUBJECT_NOT_FOUND";

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

        return teacherForSubject || [];

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
        if (!existStudent) return "STUDENT_NOT_FOUND";

        const existSubject = await MateriaModel.findByPk(request.id_materia);
        if (!existSubject) return "SUBJECT_NOT_FOUND";

        // validar que la referencia haya sido generada por el sistema uts
        const legalReference = await getEnableReference(`${request.referencia}`);
        if (!legalReference) return 'REFERENCE_NOT_VALID';
        // validar que la referencia este en un estado pago 
        if (!legalReference.estado_pago) return "UNPAID_REFERENCE";

        // validar que la referencia no haya sido registrada antes en el nuevo sistema
        const uniqueReference = await HabilitacionModel.findOne({ where: { referencia_pago: request.referencia } })
        if (uniqueReference) return "EXISTING_REFERENCE";

        if (Object.keys(files).length !== 2) return "INCOMPLETE_FILES";

        // verificamos la validez de los archivos y revisamos si son los esperados. validamos si el objeto files cumple con lo que esperamos que llegue
        if (!fileControl.validateFilesObjectKeys(files)) {
            fileControl.removeAllFilesOfDirLoaded(files);
            return "INCORRECT_FILES"
        }

        const newAuthorization = await HabilitacionModel.create({
            referencia_pago: request.referencia,
            id_estudiante: request.id_estudiante,
            id_materia: request.id_materia,
            img_factura: files['pdf'][0].filename,
            img_recibo_pago: files['imagen'][0].filename
        }, { transaction: t });

        // envio de correo a estudiante y profesor 

        fileControl.relocateTheFile(files['pdf'][0].path, `storage/pdf/${files['pdf'][0].filename}`)
        fileControl.relocateTheFile(files['imagen'][0].path, `storage/images/${files['imagen'][0].filename}`)

        await t.commit();
        await dbInstance.close();

        return {
            id: newAuthorization.id,
            referencia: newAuthorization.referencia_pago,
            materia: existSubject.nombre,
            estudiante: `${existStudent.nombre} ${existStudent.apellido}`
        };
    } catch (error) {
        await t.rollback();
        await dbInstance.close();
        throw error;
    }
}




async function sendProcessEmails() {
    try {




    } catch (error) {
        throw error;
    }
}





export default {
    getSubjectsAvailableToStudent,
    findTeachersForSubject,
    makeAuthorizationRequest,
}