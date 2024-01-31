import { QueryTypes } from "sequelize";
import db from "../db/conexion.js";
import EstudianteModel from "../models/estudiante.model.js";
import ProfesorModel from "../models/profesor.model.js";
import CarreraModel from "../models/carrera.model.js";
import MateriaModel from "../models/materia.model.js";
import HabilitacionModel from "../models/habilitaciones.model.js";




// funcion del servicio para obtener los estudiantes paginados y  filtraos si se necesita
const getStudentListFilter = async (params, id_coordinacion) => {
    let baseQuery = `
        SELECT 
            tg_e.id,
            tg_e.doc_id as identificacion,
            tg_e.apellido,
            tg_e.nombre,
            tg_e.telefono,
            tg_e.correo,
            tg_ca.nombre as carrera
        FROM tg_estudiante as tg_e 
        INNER JOIN tg_carrera as tg_ca ON tg_e.id_carrera = tg_ca.id
        INNER JOIN tg_coordinacion as tg_co ON tg_ca.id_coordinacion = tg_co.id
        WHERE tg_co.id = ${id_coordinacion} 
    `;
    let page = params.page || 1;
    let amount = params.amount || 15;
    let offset = (page - 1) * amount;

    try {

        const totalRecords = await db.query(`
            SELECT COUNT(*) total
            FROM tg_estudiante as tg_e 
            INNER JOIN tg_carrera as tg_ca ON tg_e.id_carrera = tg_ca.id
            INNER JOIN tg_coordinacion as tg_co ON tg_ca.id_coordinacion = tg_co.id
            WHERE tg_co.id = :id_coordinacion;
        `, {
            type: QueryTypes.SELECT,
            replacements: { id_coordinacion },
            plain: true
        });

        let totalPage = Math.ceil(totalRecords.total / amount);

        const filters = {
            doc_id: `LOWER(tg_e.doc_id) LIKE LOWER('${params.doc_id}%')`,
            last_name: `LOWER(tg_e.apellido) LIKE LOWER('%${params.last_name}%')`,
            first_name: `LOWER(tg_e.nombre) LIKE LOWER('%${params.first_name}%')`,
            phone: `LOWER(tg_e.telefono) LIKE LOWER('${params.phone}%')`,
            email: `LOWER(tg_e.correo) LIKE LOWER('${params.email}%')`,
        }

        let condition = null;
        Object.keys(filters).forEach(key => {
            if (params[key]) {
                condition = filters[key];
            }
        });

        if (condition) {
            baseQuery += ` AND ${condition}`;
        }

        baseQuery += ` ORDER BY tg_e.id DESC LIMIT ${amount} OFFSET ${offset} `

        const studentList = await db.query(baseQuery, {
            type: QueryTypes.SELECT
        })

        return {
            total_records: totalRecords.total,
            current_page: Number(page),
            total_page: totalPage,
            total_records_found: studentList.length,
            studentList
        }

    } catch (error) {
        throw error;
    }
}



// funcion del servicio para obtener las habilitaciones paginadas y filtradas
const getRecoveryListFilter = async (params, id_coordinacion) => {

    let baseQuery = `
        SELECT 
            tg_h.id,
            tg_h.referencia_pago,
            tg_h.id_estudiante,
            CONCAT(tg_e.apellido,' ',tg_e.nombre) as estudiante,
            tg_h.id_materia,
            tg_m.nombre AS materia,
            tg_h.id_profesor,
            CONCAT(tg_p.nombre,' ',tg_p.apellido) AS profesor,
            DATE_FORMAT(tg_h.created_at, '%Y-%m-%d  %H:%i') as fecha_aprovacion
        FROM tg_habilitaciones AS tg_h 
        INNER JOIN tg_materia AS tg_m ON tg_h.id_materia = tg_m.id
        INNER JOIN tg_profesor AS tg_p ON tg_h.id_profesor = tg_p.id
        INNER JOIN tg_estudiante as tg_e ON tg_h.id_estudiante = tg_e.id
        INNER JOIN tg_carrera AS tg_c ON tg_e.id_carrera = tg_c.id
        INNER JOIN tg_coordinacion AS tg_co ON tg_c.id_coordinacion = tg_co.id
        WHERE tg_co.id = ${id_coordinacion}
    `;
    let page = params.page || 1;
    let amount = params.amount || 15;
    let offset = (page - 1) * amount;
    try {

        const totalRecords = await db.query(`
            SELECT COUNT(*) as total
            FROM tg_habilitaciones AS tg_h 
            INNER JOIN tg_estudiante as tg_e ON tg_h.id_estudiante = tg_e.id
            INNER JOIN tg_carrera AS tg_c ON tg_e.id_carrera = tg_c.id
            INNER JOIN tg_coordinacion AS tg_co ON tg_c.id_coordinacion = tg_co.id
            WHERE tg_co.id = :id_coordinacion
        `, {
            type: QueryTypes.SELECT,
            replacements: { id_coordinacion },
            plain: true
        });

        const totalPage = Math.ceil(totalRecords.total / amount);

        const filters = {
            reference: `tg_h.referencia_pago LIKE '%${params.reference}'`,
            student: `(LOWER(CONCAT(tg_e.apellido, ' ', tg_e.nombre)) LIKE LOWER('%${params.student}%')
            OR LOWER(tg_e.apellido) LIKE LOWER('%${params.student}%')
            OR LOWER(tg_e.nombre) LIKE LOWER('%${params.student}%'))`
        };

        let condition = null;
        Object.keys(filters).forEach(key => {
            if (params[key]) {
                condition = filters[key];
            }
        });

        if (condition) {
            baseQuery += ` AND ${condition}`;
        }

        baseQuery += ` ORDER BY tg_h.id DESC LIMIT ${amount} OFFSET ${offset} `;

        const ratingList = await db.query(baseQuery, { type: QueryTypes.SELECT });

        return {
            total_records: totalRecords.total,
            current_page: Number(page),
            total_page: totalPage,
            total_records_found: ratingList.length,
            ratingList
        };
    } catch (error) {
        throw error;
    }
}



// funcion del servicio para retornar los detalles de la habilitacion 
const getRecoveryDetails = async ({ id_recovery }) => {
    try {

        const recovey = await HabilitacionModel.findOne({
            attributes: ['id', 'referencia_pago', 'img_factura', 'img_recibo_pago', 'created_at'],
            where: { id: id_recovery },
            include: [
                {
                    model: EstudianteModel,
                    attributes: ['id', 'doc_id', 'nombre', 'apellido', 'telefono', 'correo'],
                    include: [
                        {
                            model: CarreraModel,
                            attributes: ['id', 'codigo', 'nombre']
                        }
                    ]
                },
                {
                    model: ProfesorModel,
                    attributes: ['id', 'cedula', 'nombre', 'apellido', 'telefono', 'correo']
                },
                {
                    model: MateriaModel,
                    attributes: ['id', 'codigo', 'nombre', 'creditos']
                }
            ],
        })

        if (!recovey) return "RECOVERY_NOT_FOUND";

        return recovey;
    } catch (error) {
        throw error;
    }
}



export default {
    getStudentListFilter,
    getRecoveryListFilter,
    getRecoveryDetails
}



















