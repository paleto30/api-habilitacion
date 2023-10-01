import { QueryTypes } from "sequelize";
import db from "../db/conexion.js";
import SedeModel from "../models/sede.model.js";





/*
    funcion para retornar las sedes disponibles
*/
const getAvailableSedes = async () => {
    try {

        const sedesList = await SedeModel.findAll(
            {
                attributes: ['id', 'nombre']
            }
        );

        if (sedesList.length < 0) {
            return []
        }

        return sedesList;

    } catch (error) {
        throw new Error('No se pudo obtener la lista de sedes')
    }
}


/* 
    funcion para retornar las facultades que le pertenecen a una sede especifica
*/
const getAvailableFacultades = async (id_sede) => {
    try {

        const facultades = await db.query(`
            SELECT id, codigo, nombre FROM tg_facultad
            WHERE id_sede = :id_sede;
        `, {
            replacements: { id_sede },
            type: QueryTypes.SELECT
        });

        if (facultades.length < 0) {
            return [];
        }

        return facultades;

    } catch (error) {
        throw new Error('No se pudo obtener la lista de facultades');
    }
}








export default {
    getAvailableSedes,
    getAvailableFacultades
}