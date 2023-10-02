import { schemaStudenRegistration } from "../schemas/auth.schema.js";
import authService from "../services/auth.service.js";
import { encryptData } from '../helpers/encryptData.js';



/**
 *  funcion para obtener las sedes disponibles en el registro de estudiante 
 */
const getSedes = async (req, res) => {
    try {
        const sedes = await authService.getAvailableSedes();

        return res.json({
            status: true,
            message: 'consultado correctamente',
            sedes
        })
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
}



/**
 *  Funcion para obtener las facultades disponibles segun el la sede 
*/
const getFacultadesBySede = async (req, res) => {
    try {
        const { id_sede } = req.params;
        const facultades = await authService.getAvailableFacultades(Number(id_sede));

        return res.json({
            status: true,
            message: 'consultado correctamente',
            facultades
        })

    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
}



/**
 *  funcion para obtener las coordinaciones disponibles para la respectiva sede
 */
const getCoordinacionByFacultad = async (req, res) => {
    try {

        const { id_facultad } = req.params;
        const coordinaciones = await authService.getAvailableCoordinacion(id_facultad);

        return res.json({
            status: true,
            message: 'consultado correctamente',
            coordinaciones
        });


    } catch (error) {
        res.status(400).json({ status: false, error: error.message })
    }
}



/**
 *  cuncion para obtener las carreras de la correspondiente coordinacion
*/
const getCarrerasByCoordinacion = async (req, res) => {
    try {   
        
        const { id_coordinacion } = req.params;
        const carreras = await authService.getAvailableCarrera(id_coordinacion);

        return res.json({
            status: true,
            message: 'consultado ccorrectamente',
            carreras
        })

    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
}



/*
    funcion para registrar un estudiante
*/
const studentRegistration = async (req, res) => {
    try {

        const body = req.body;
        const validate = await schemaStudenRegistration.validateAsync(body);

        // validamos que el correo no exista 
        const emailValid = await authService.verifyEmail(validate.correo)
        if (emailValid) {
            return res.status(409).json({status: false, error: 'El correo que intenta registrar ya existe en el sistema.'});
        }

        // hasheamos el password
        const claveHash = await encryptData(validate.clave, 12);

        // creamos el objeto que se va a enviar para crear al usuario
        const userToSave = {
            doc_id: validate.doc_id,
            nombre: validate.nombre,
            apellido: validate.apellido,
            telefono: validate.telefono,
            correo: validate.correo,
            clave: claveHash,
            id_carrera: validate.id_carrera
        }

        // retorno de la creacion del nuevo usuario
        const newUser = await authService.createNewUser(userToSave);

        // respondemos al cliente
        return res.status(201).json({
            status: true,
            message: 'Registrado correctamente',
            estudiante: {
                id: newUser.id,
                doc_id: newUser.doc_id,
                nombre: newUser.nombre,
                apellido: newUser.apellido,
                correo: newUser.correo
            }
                
        });

    } catch (error) {
        res.status(400).json({ status: false, error: error.message })
    }
}







export default {
    studentRegistration,
    getSedes,
    getFacultadesBySede,
    getCoordinacionByFacultad,
    getCarrerasByCoordinacion
}

