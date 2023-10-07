import { QueryTypes } from "sequelize";
import db from "../db/conexion.js";
import SedeModel from "../models/sede.model.js";
import EstudianteModel from "../models/estudiante.model.js";
import AdministradorModel from '../models/administrador.model.js';




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

        if (sedesList.length == 0) {
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
const getAvailableFacultades = async (id_sede ) => {
    try {

        id_sede = id_sede || 0;
        const facultades = await db.query(`
            SELECT id, codigo, nombre FROM tg_facultad
            WHERE id_sede = :id_sede;
        `, {
            replacements: { id_sede },
            type: QueryTypes.SELECT
        });

        if (facultades.length == 0) {
            return [];
        }

        return facultades;

    } catch (error) {
        throw new Error('No se pudo obtener la lista de facultades');
    }
}



/* 
    obtener las coordinaciones disponibles por facultad
*/
const getAvailableCoordinacion = async (id_facultad) => {
    try {

        const coordinaciones = await db.query(`
            SELECT DISTINCT(id) AS id, nombre  FROM tg_coordinacion WHERE id_facultad = :id_facultad
            ORDER BY nombre ASC
        `, {
            replacements: { id_facultad },
            type: QueryTypes.SELECT
        })

        if (coordinaciones.length == 0) {
            return []
        }

        return coordinaciones;

    } catch (error) {
        throw new Error('No se encontraron las coordinaciones. algo salio mal')
    }
}


/*
    funcion para obtener las carreras disponibles por coordinacion
*/
const getAvailableCarrera = async (id_coordinacion) => {
    try {

        const carreras = await db.query(`
            SELECT DISTINCT(id) as id, nombre FROM tg_carrera WHERE id_coordinacion = :id_coordinacion
            ORDER BY nombre ASC
        `, {
            replacements: { id_coordinacion },
            type: QueryTypes.SELECT
        });

        if (carreras.length == 0) {
            return []
        }

        return carreras;
    } catch (error) {
        throw new Error('No se pudo obtener la lista de carreras. algo salio mal')
    }
}



/* 
    funcion para validar si el email ya fue registrado o no
*/
const verifyEmailEstudent = async (email) => {
    try {

        const results = await EstudianteModel.findOne({
            where: {
                correo: email
            }
        });

        if (results === null) {
            return [false,[]];
        }

        return [!!results, results];  // esto retorna true si existe un email . sino retorna false

    } catch (error) {
        throw new Error('No se pudo validar el Email. algo salio mal')
    }
}

/* 
    funcion para validar si el email ya fue registrado o no
*/
const verifyDoc = async (doc) => {
    try {

        const results = await EstudianteModel.findOne({
            where: {
                doc_id: doc
            }
        });

        if (results === null) {
            return false;
        }

        return !!results;  // esto retorna true si existe un email . sino retorna false

    } catch (error) {
        throw new Error('No se pudo validar el Email. algo salio mal')
    }
}



/*
    funcion para crear un nuevo registro de estudiante 
*/
const createNewUser = async (estudiante) => {
    try {

        const newUser = await EstudianteModel.create(estudiante); 
        return newUser;
        
    } catch (error) {
        throw new Error('No se pudo crear en nuevo estudiante. algo salio mal');
    }
}





/* 
    funcion para validar si el email ya fue registrado o no
*/
const verifyEmailAdmin = async (email) => {
    try {

        const results = await AdministradorModel.findOne({
            where: {
                correo: email
            }
        });

        if (results === null) {
            return [false,[]];
        }

        return [!!results, results];  // esto retorna true si existe un email . sino retorna false

    } catch (error) {
        throw new Error('No se pudo validar el Email Admin. algo salio mal');
    }
}


/* 
    funcion para validar si el email ya fue registrado o no
*/
const verifyDocAdmin = async (doc) => {
    try {

        const results = await AdministradorModel.findOne({
            where: {
                doc_id: doc
            }
        });

        if (results === null) {
            return false;
        }

        return !!results;  // esto retorna true si existe un email . sino retorna false

    } catch (error) {
        throw new Error('No se pudo validar el Email admin. algo salio mal')
    }
}

/*
    funcion para crear un nuevo registro de Administrador 
*/
const createNewUserAdmin = async (admin) => {
    try {

        const newUser = await AdministradorModel.create(admin); 
        return newUser;
        
    } catch (error) {
        throw new Error('No se pudo crear en nuevo estudiante. algo salio mal');
    }
}














export default {
    getAvailableSedes,
    getAvailableFacultades,
    getAvailableCoordinacion,
    getAvailableCarrera,
    verifyEmailEstudent,
    verifyDoc,
    createNewUser,
    verifyEmailAdmin,
    verifyDocAdmin,
    createNewUserAdmin
}