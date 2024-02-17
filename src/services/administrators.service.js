"use strict"
import { QueryTypes } from "sequelize";
import db from "../db/conexion.js";
import { ConflictException, NotFoundException } from "../helpers/classError.js";
import { encryptData, verifyEncryptData } from "../helpers/encryptData.js";
import AdministradorModel from "../models/administrador.model.js";
import CoordinacionModel from "../models/coordinacion.model.js";
import { checkEmailDomain } from "../helpers/errorhandler.js";




//?   Metodos del servicio para el controlador 


/* function */
const getAll = async (params) => {
    let baseQuery = `
        SELECT 
            tg_a.id, tg_a.doc_id, CONCAT(tg_a.apellido,' ',tg_a.nombre) AS nombre, tg_a.telefono, tg_a.correo, tg_a.rol,
            tg_c.id as id_coo, tg_c.nombre as name_coo,
            tg_f.id as id_fac, tg_f.codigo as code_fac, tg_f.nombre as name_fac,
            tg_s.id as id_sede, tg_s.codigo as code_sede, tg_s.nombre as campus 
        FROM tg_administrador AS tg_a
        INNER JOIN tg_coordinacion AS tg_c ON tg_a.id_coordinacion = tg_c.id
        INNER JOIN tg_facultad AS tg_f ON  tg_c.id_facultad = tg_f.id
        INNER JOIN tg_sede AS tg_s ON tg_f.id_sede = tg_s.id
    `;

    let page = params.page || 1;
    let amount = params.amount || 15;
    let offset = (page - 1) * amount;


    try {
        const totalRecords = await AdministradorModel.count();
        let totalPage = Math.ceil(totalRecords / amount)
        const filters = {
            doc_id: `LOWER(tg_a.doc_id) LIKE LOWER('${params.doc_id}%')`,
            name: `(LOWER(CONCAT(tg_a.apellido, ' ', tg_a.nombre)) LIKE LOWER('%${params.name}%')
                     OR LOWER(tg_a.apellido) LIKE LOWER('%${params.name}%')
                     OR LOWER(tg_a.nombre) LIKE LOWER('%${params.name}%'))
            `,
            email: `LOWER(tg_a.correo) = LOWER('${params.email}')`,
        }

        let condition = null;
        Object.keys(filters).forEach(key => {
            if (params[key]) {
                condition = filters[key];
                console.log(params);
            }
        })

        if (condition) {
            baseQuery += ` WHERE ${condition}`;
        }

        baseQuery += ` ORDER BY tg_a.id DESC LIMIT ${amount} OFFSET ${offset}`

        let admins = await db.query(baseQuery, {
            type: QueryTypes.SELECT
        })

        return {
            total_records: totalRecords,
            current_page: Number(page),
            total_page: totalPage,
            total_records_found: admins.length,
            admins
        };
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

        if (!checkEmailDomain(params.correo, 'TYPE_ADMIN')) throw new ConflictException(`El correo ${params.correo} no posee un dominio valido para un administrador, verifique.`)

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
        await existAdmin.destroy();
        return true
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