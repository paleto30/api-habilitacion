import { QueryTypes } from "sequelize";
import db from "../db/conexion.js";




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

        baseQuery += ` LIMIT ${amount} OFFSET ${offset}`

        const studentList = await db.query(baseQuery, {
            type: QueryTypes.SELECT,
            replacements: {
                id_coordinacion
            }
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







export default {
    getStudentListFilter
}



















