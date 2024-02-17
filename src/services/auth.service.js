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
import FacultadModel from "../models/facultad.model.js";
import { ConflictException, NotFoundException, UnauthorizedException } from "../helpers/classError.js";



/*
    funcion para retornar las sedes disponibles
*/
const getAvailableCampus = async () => {
    try {
        const campusList = await SedeModel.findAll({ attributes: ['id', 'nombre'] });
        return campusList;
    } catch (error) {
        throw error;
    }
}





/* 
    funcion para retornar las facultades que le pertenecen a una sede especifica
*/
const getAvailableFaculties = async (id_campus) => {
    try {
        const sede = await SedeModel.findByPk(id_campus);
        if (!sede) throw new NotFoundException(`No existe sede con ID ${id_campus}`);

        const faculties = await FacultadModel.findAll({
            attributes: ['id', 'codigo', 'nombre'],
            where: {
                id_sede: id_campus
            }
        });
        return faculties;
    } catch (error) {
        throw error;
    }
}





/* 
    obtener las coordinaciones disponibles por facultad
*/
const getAvailableCoordination = async (id_faculties) => {
    try {
        const facultad = await FacultadModel.findByPk(id_faculties);
        if (!facultad) throw new NotFoundException(`No existe facultad con ID ${id_faculties}`)
        const coordinations = await CoordinacionModel.findAll({
            attributes: ['id', 'nombre'],
            where: {
                id_facultad: id_faculties
            },
            order: [['nombre', 'ASC']]
        })
        return coordinations;
    } catch (error) {
        throw error;
    }
}




/*
    funcion para obtener las carreras disponibles por coordinacion
*/
const getAvailableCareers = async (id_coordination) => {
    try {

        const coordination = await CoordinacionModel.findByPk(id_coordination);
        if (!coordination) throw new NotFoundException(`No existe coordinacioncon ID ${id_coordination}`)
        const careers = await CarreraModel.findAll({
            attributes: ['id', 'nombre'],
            where: {
                id_coordinacion: id_coordination
            },
            order: [['nombre', 'ASC']]
        });
        return careers;
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
        if (!emailDomain)
            throw new ConflictException('El dominio del correo no es valido.')

        const studentDoc = await EstudianteModel.findOne({ where: { doc_id: student.doc_id } });
        if (studentDoc)
            throw new ConflictException('El documento de identidad ya esta registrado.');

        const studentEmail = await EstudianteModel.findOne({ where: { correo: student.correo } });
        if (studentEmail)
            throw new ConflictException('El correo electronico ya esta registrado.')

        const careerValid = await CarreraModel.findByPk(student.id_carrera);
        if (!careerValid)
            return new NotFoundException('La carrera no es valida.');

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
    funcion encargada de procesar el login para Estudiantes
*/
const studentLogin = async (correo, clave) => {
    try {
        const student = await EstudianteModel.findOne({ where: { correo: correo } });
        if (!student)
            throw new NotFoundException('Usuario no registrado.');

        const verifiedPassword = await verifyEncryptData(clave, student.clave);
        if (!verifiedPassword)
            throw new UnauthorizedException('Contraseña incorrecta.');

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
        delete userData.doc_id;
        delete userData.id_carrera
        return { userData, accessToken };

    } catch (error) {
        throw error;
    }
}






/* 
    funcion encargada de procesar el login para Estudiantes
*/
const adminLogin = async (correo, clave) => {
    try {
        const admin = await AdministradorModel.findOne({ where: { correo: correo } });
        if (!admin)
            throw new NotFoundException('Usuario no registrado.');

        const verifiedPassword = await verifyEncryptData(clave, admin.clave);
        if (!verifiedPassword)
            throw new UnauthorizedException('Contraseña incorrecta.');

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
        return { userData, accessToken };

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
    studentLogin,
    adminLogin
}