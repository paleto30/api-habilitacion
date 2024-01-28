import { QueryTypes } from "sequelize";
import db from "../db/conexion.js";
import SedeModel from "../models/sede.model.js";
import EstudianteModel from "../models/estudiante.model.js";
import AdministradorModel from '../models/administrador.model.js';
import { encryptData, verifyEncryptData } from "../helpers/encryptData.js";
import CarreraModel from "../models/carrera.model.js";
import CoordinacionModel from "../models/coordinacion.model.js";
import { checkEmailDomain } from '../helpers/errorhandler.js'
import { createToken } from "../helpers/jwtFunctions.js";



/*
    funcion para retornar las sedes disponibles
*/
const getAvailableCampus = async () => {
    try {
        const campusList = await SedeModel.findAll({ attributes: ['id', 'nombre'] });
        return campusList || [];
    } catch (error) {
        throw error;
    }
}





/* 
    funcion para retornar las facultades que le pertenecen a una sede especifica
*/
const getAvailableFaculties = async (id_campus) => {
    try {
        const faculties = await db.query(`
            SELECT id, codigo, nombre FROM tg_facultad
            WHERE id_sede = :id_campus;
        `, {
            replacements: { id_campus },
            type: QueryTypes.SELECT
        });
        return faculties || [];
    } catch (error) {
        throw error;
    }
}





/* 
    obtener las coordinaciones disponibles por facultad
*/
const getAvailableCoordination = async (id_faculties) => {
    try {
        const coordinations = await db.query(`
            SELECT DISTINCT(id) AS id, nombre  FROM tg_coordinacion WHERE id_facultad = :id_faculties
            ORDER BY nombre ASC
        `, {
            replacements: { id_faculties },
            type: QueryTypes.SELECT
        })
        return coordinations || [];
    } catch (error) {
        throw error;
    }
}




/*
    funcion para obtener las carreras disponibles por coordinacion
*/
const getAvailableCareers = async (id_coordination) => {
    try {
        const careers = await db.query(`
            SELECT DISTINCT(id) as id, nombre FROM tg_carrera WHERE id_coordinacion = :id_coordination
            ORDER BY nombre ASC
        `, {
            replacements: { id_coordination },
            type: QueryTypes.SELECT
        });

        return careers || [];
    } catch (error) {
        throw error;
    }
}





/*
    funcion encargada del registro de un estudiante
*/
const studentRegister = async (student) => {
    try {
        const emailDomain = checkEmailDomain(student.correo, 'TYPE_STUDENT');
        if (!emailDomain) return "EMAIL_DOMAIN_INVALID";

        const studentDoc = await EstudianteModel.findOne({ where: { doc_id: student.doc_id } });
        if (studentDoc) return "EXISTING_ID_DOCUMENT";

        const studentEmail = await EstudianteModel.findOne({ where: { correo: student.correo } });
        if (studentEmail) return `EXISTING_EMAIL`;

        const careerValid = await CarreraModel.findByPk(student.id_carrera);
        if (!careerValid) return "NOT_EXISTING_CAREER";

        student.nombre = student.nombre.toUpperCase();
        student.apellido = student.apellido.toUpperCase();
        student.correo = student.correo.toLowerCase();
        student.clave = await encryptData(student.clave, 11);

        const newStudent = await EstudianteModel.create(student);

        const response = {
            id: newStudent.id,
            doc_id: newStudent.doc_id,
            nombre: newStudent.nombre,
            apellido: newStudent.apellido,
            correo: newStudent.correo
        };
        return response;
    } catch (error) {
        throw error;
    }
}





/* 
    funcion encargada del registro para un administrador
*/
const adminRegister = async (admin) => {
    try {

        const emailDomain = checkEmailDomain(admin.correo, 'TYPE_ADMIN');
        if (!emailDomain) return "EMAIL_DOMAIN_INVALID";

        const adminDoc = await AdministradorModel.findOne({ where: { doc_id: admin.doc_id } });
        if (adminDoc) return "EXISTING_ID_DOCUMENT";

        const adminEmail = await AdministradorModel.findOne({ where: { correo: admin.correo } });
        if (adminEmail) return "EXISTING_EMAIL";

        const coordinationValid = await CoordinacionModel.findByPk(admin.id_coordinacion);
        if (!coordinationValid) return "NOT_EXISTING_COORDINATION";

        admin.nombre = admin.nombre.toUpperCase();
        admin.apellido = admin.apellido.toUpperCase();
        admin.correo = admin.correo.toLowerCase();
        admin.clave = await encryptData(admin.clave, 11);

        const newAdmin = await AdministradorModel.create(admin);
        const response = {
            id: newAdmin.id,
            oc_id: newAdmin.doc_id,
            nombre: newAdmin.nombre,
            apellido: newAdmin.apellido,
            correo: newAdmin.correo
        };
        return response;
    } catch (error) {
        throw error;
    }
}





/* 
    funcion encargada de procesar el login para Estudiantes
*/
const studentLogin = async (credentials) => {
    try {
        const student = await EstudianteModel.findOne({ where: { correo: credentials.correo } });
        if (!student) return "UNREGISTERED_USER";

        const verifiedPassword = await verifyEncryptData(credentials.clave, student.clave);
        if (!verifiedPassword) return "PASSWORD_INCORRECT";

        const userData = {
            id: student.id,
            doc_id: student.doc_id,
            nombre: student.nombre,
            apellido: student.apellido,
            id_carrera: student.id_carrera,
            correo: student.correo,
            rol: student.rol
        }

        const accessToken = createToken(userData, '1d');

        return { userData, accessToken } || {};

    } catch (error) {
        throw error;
    }
}






/* 
    funcion encargada de procesar el login para Estudiantes
*/
const adminLogin = async (credentials) => {
    try {
        const admin = await AdministradorModel.findOne({ where: { correo: credentials.correo } });
        if (!admin) return "UNREGISTERED_USER";

        const verifiedPassword = await verifyEncryptData(credentials.clave, admin.clave);
        if (!verifiedPassword) return "PASSWORD_INCORRECT";

        const userData = {
            id: admin.id,
            doc_id: admin.doc_id,
            nombre: admin.nombre,
            apellido: admin.apellido,
            id_coordinacion: admin.id_coordinacion,
            correo: admin.correo,
            rol: admin.rol
        }
        const accessToken = createToken(userData, '1d');
        delete userData.id_coordinacion;
        delete userData.doc_id;
        return { userData, accessToken } || {};

    } catch (error) {
        throw error;
    }
}




export default {
    getAvailableCampus,
    getAvailableFaculties,
    getAvailableCoordination,
    getAvailableCareers,
    studentRegister,
    adminRegister,
    studentLogin,
    adminLogin
}