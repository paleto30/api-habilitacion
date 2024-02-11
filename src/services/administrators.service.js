"use strict"
import { ConflictException, NotFoundException } from "../helpers/classError.js";
import { encryptData } from "../helpers/encryptData.js";
import AdministradorModel from "../models/administrador.model.js";
import CoordinacionModel from "../models/coordinacion.model.js";




//?   Metodos del servicio para el controlador 


/* function */
const getAll = async (params, id_coo) => {
    let baseQuery = `
    
    `;

    let page = params.page || 1;
    let amount = params.amount || 15;
    let offset = (page - 1) * amount;

    try {
        const totalRecords = await AdministradorModel.count();
        console.log(totalRecords);
        let totalPage = Math.ceil(totalRecords / amount)


        const filters = {
            doc_id: `LOWER(tg_a.doc_id) LIKE LOWER('${params.doc_id}%')`,
            nombre: `(LOWER(CONCAT(tg_a.apellido, ' ', tg_a.nombre)) LIKE LOWER('%${params.nombre}%')
                     OR LOWER(tg_a.apellido) LIKE LOWER('%${params.nombre}%')
                     OR LOWER(tg_a.nombre) LIKE LOWER('%${params.nombre}%'))
            `,
            correo: `LOWER(tg_a.correo) LIKE LOWER('${params.email}%')`,
            id_coo: `tg_a.id_coordinacion = ${id_coo}`,

        }

        return "ok";
    } catch (error) {
        throw error;
    }
}

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



/* function */
const getById = async (id) => {
    try {
        const admin = await AdministradorModel.findByPk(id);
        if (!admin) throw new NotFoundException(`Registro con ID ${id} no encontrado`);
        return admin;
    } catch (error) {
        throw error
    }
}


/* function */
const createNew = async (params) => {
    try {
        const adminDNI = await AdministradorModel.findOne({ where: { doc_id: params.doc_id } });
        if (adminDNI) throw new ConflictException(`Documento de identidad ${params.doc_id} ya registrado.`);

        const adminEmail = await AdministradorModel.findOne({ where: { correo: params.correo } });
        if (adminEmail) throw new ConflictException(`Correo electronico ${params.correo} ya registrado.`);

        const coordination = await CoordinacionModel.findByPk(params.id_coordinacion);
        if (!coordination) throw new NotFoundException('No se encontro la cordinacion');

        params.nombre = params.nombre.toUpperCase();
        params.apellido = params.apellido.toUpperCase();
        params.correo = params.correo.toLowerCase();
        params.clave = await encryptData(params.clave, 11);

        const newAdmin = await AdministradorModel.create(params);
        const response = {
            id: newAdmin.id,
            nombre: newAdmin.nombre,
            apellido: newAdmin.apellido,
            correo: newAdmin.correo
        };
        return response;
    } catch (error) {
        throw error;
    }
}





/* function */
const update = async (admin) => {
    try {
        const { id, correo, doc_id } = admin;
        const existAdmin = await getById(id);

        const findByEmail = await AdministradorModel.findOne({ where: { correo: correo } });
        if (findByEmail && findByEmail.id !== id)
            throw new ConflictException('Correo no disponible.');

        const findByDoc = await AdministradorModel.findOne({ where: { doc_id: doc_id } })
        if (findByDoc && findByDoc.id !== id && findByEmail !== id)
            throw new ConflictException('Documento identidad ya registrado en otro usuario');

        admin.nombre = admin.nombre.toUpperCase();
        admin.apellido = admin.apellido.toUpperCase();
        admin.correo = admin.correo.toLowerCase();
        admin.clave = await encryptData(admin.clave, 11);

        for (const key of Object.keys(existAdmin.dataValues)) {
            existAdmin[key] = admin[key];
        }
        await existAdmin.save();
        return existAdmin;
    } catch (error) {
        throw error;
    }
}



/* function */
const deleteOne = async (id) => {
    try {
        const existAdmin = await getById(id);
        const deletes = await existAdmin.destroy();
        return deletes
    } catch (error) {
        throw error;
    }
}


export default {
    getAll,
    getById,
    createNew,
    update,
    deleteOne
}