import { schemaStudentRegistration, schemaStudentLogin, schemaAdminRegistration } from "../schemas/auth.schema.js";
import authService from "../services/auth.service.js";
import { encryptData, verifyEncryptData } from '../helpers/encryptData.js';
import { createToken } from '../helpers/jwtFunctions.js';


/** 
 *  @author:  Andres Galvis  
 *  @description: funcion para obtener las sedes disponibles para el forrmulario de registro de un estudiante
 *  @GET :
 *  @PATH :  /api/v1/authentication/sedes
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
 *  @author:  Andres Galvis  
 *  @description: Funcion para obtener las facultades disponibles segun el la sede 
 *  @GET 
 *  @PATH :  /api/v1/authentication/sedes
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
 *  @author:  Andres Galvis  
 *  @description: funcion para obtener las coordinaciones disponibles para la respectiva sede 
 *  @GET 
 *  @PATH :  /api/v1/authentication/sedes/:id_sede/facultades
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
 *  @author:  Andres Galvis  
 *  @description: funcion para obtener las carreras disponibles para la respectiva coordinacion 
 *  @GET 
 *  @PATH :  /api/v1/authentication/coordinacion/:id_coordinacion/carreras
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



/** 
    @author: Andres Galvis
    @description: funcion para realizar el registro de un estudiante dentro de la plataforma
    @POST
    @PATH : '/api/v1/authentication/registrarse' 
*/
const studentRegistration = async (req, res) => {
    const expressionStudent = /^[a-zA-Z0-9._%+-]+@uts\.edu\.co$/;
    try {

        const body = req.body;
        const validate = await schemaStudentRegistration.validateAsync(body);

        if (!expressionStudent.test(validate.correo)) {
            return res.status(409).json({ status: false, error: 'Lo sentimos el correo no es un correo valido para este registro.' });
        }

        // validamos que la cedula no exista
        const docValid = await authService.verifyDoc(validate.doc_id);
        if (docValid) {
            return res.status(409).json({ status: false, error: 'El documento de identidad no es valido' });
        }
        // validamos que el correo no exista 
        const emailValid = await authService.verifyEmailEstudent(validate.correo)
        if (emailValid[0]) {
            return res.status(409).json({ status: false, error: 'El correo que intenta registrar ya existe en el sistema.' });
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




/** 
    @author: Andres Galvis
    @description: funcion para realizar el registro de un Administrador dentro de la plataforma
    @POST
    @PATH : '/api/v1/authentication/register/user-admin/' 
*/
const adminRegistration = async (req, res) => {
    const expressionAdmin = /^[a-zA-Z0-9._%+-]+@correo\.uts\.edu\.co$/;
    try {

        const body = req.body;
        const validate = await schemaAdminRegistration.validateAsync(body);

        if (!expressionAdmin.test(validate.correo)) {
            return res.status(409).json({ status: false, error: 'Lo sentimos el correo no es un correo valido para este registro.' });
        }

        // validamos que la cedula no exista
        const docValid = await authService.verifyDocAdmin(validate.doc_id);
        if (docValid) {
            return res.status(409).json({ status: false, error: 'El documento de identidad no es valido' });
        }

        // validamos que el correo no exista 
        const userValid = await authService.verifyEmailAdmin(validate.correo)
        if (userValid[0]) {
            return res.status(409).json({ status: false, error: 'El correo que intenta registrar ya existe en el sistema.' });
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
            id_coordinacion: validate.id_coordinacion
        }

        // retorno de la creacion del nuevo usuario
        const newUser = await authService.createNewUserAdmin(userToSave);

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





/** 
    @author: Andres Galvis 
    @description: funcion para realizar el inicio de sesion a la plataforma 
    @POST
    @PATH : '/api/v1/authentication/iniciar-sesion' 
*/
const loginManagement = async (req, res) => {

    const expressionAdmin = /^[a-zA-Z0-9._%+-]+@correo\.uts\.edu\.co$/;
    const expressionStudent = /^[a-zA-Z0-9._%+-]+@uts\.edu\.co$/;
    try {

        const { correo, clave } = req.body;

        const validate = await schemaStudentLogin.validateAsync({ correo, clave });

        // verificamos que los correos que se ingresean sean de los dominios aceptados (dominios institucionales)
        if (!((expressionStudent.test(correo) || expressionAdmin.test(correo)) && !(expressionStudent.test(correo) && expressionAdmin.test(correo)))) {
            return res.status(422).json({ status: false, error: 'El dominio del correo que ingreso no es valido para este sistema. verifique!' })
        }


        // acciones si es un correo estudiante -> 
        if (expressionStudent.test(validate.correo)) {

            // verificamos que sea un correo existente en el sistema
            const validateUser = await authService.verifyEmailEstudent(validate.correo);
            if (!validateUser[0]) {
                return res.status(409).json({ status: false, error: 'Credenciales incorrectas, verifique!' })
            }

            // comparamos la contraseña 
            const compareKey = await verifyEncryptData(validate.clave, validateUser[1].clave);
            if (!compareKey) {
                return res.status(409).json({ status: false, error: 'Credenciales incorrectas' })
            }

            // creamos el token 
            const accessToken = createToken({
                id: validateUser[1].id,
                doc_id: validateUser[1].doc_id,
                nombre: validateUser[1].nombre,
                apellido: validateUser[1].apellido,
                id_carrera: validateUser[1].id_carrera,
                correo: validateUser[1].correo,
                rol: validateUser[1].rol
            }, '1d');

            // retornamos la respuesta
            return res.json({
                status: true,
                message: 'Usuario verificado Correctamente',
                user: {
                    id: validateUser[1].id,
                    doc_id: validateUser[1].doc_id,
                    nombre: validateUser[1].nombre,
                    apellido: validateUser[1].apellido,
                    telefono: validateUser[1].telefono,
                    id_carrera: validateUser[1].id_carrera,
                    correo: validateUser[1].correo,
                    rol: validateUser[1].rol
                },
                accessToken: accessToken
            });

        }


        if (expressionAdmin.test(validate.correo)) {  // acciones si es un correo administrador

            // verificamos que el correo sea de un usuario existente en el sistema
            const validateAdminUser = await authService.verifyEmailAdmin(validate.correo);
            if (!validateAdminUser[0]) {
                return res.status(409).json({ status: false, error: 'Credenciales incorrectas, verifique!' })
            }

            // comparamos la clave 
            const compareKey = await verifyEncryptData(validate.clave, validateAdminUser[1].clave);
            if (!compareKey) {
                return res.status(409).json({ status: false, error: 'Credenciales incorrectas' })
            }
            // Creamos el token
            const accessToken = createToken({
                id: validateAdminUser[1].id,
                doc_id: validateAdminUser[1].doc_id,
                nombre: validateAdminUser[1].nombre,
                apellido: validateAdminUser[1].apellido,
                telefono: validateAdminUser[1].telefono,
                id_coordinacion: validateAdminUser[1].id_coordinacion,
                correo: validateAdminUser[1].correo,
                rol: validateAdminUser[1].rol
            }, '1d')

            // retornamos una respuesta si todo a ido bien 
            return res.json({
                status: true,
                message: 'Usuario verificado Correctamente',
                user: {
                    id: validateAdminUser[1].id,
                    doc_id: validateAdminUser[1].doc_id,
                    nombre: validateAdminUser[1].nombre,
                    apellido: validateAdminUser[1].apellido,
                    telefono: validateAdminUser[1].telefono,
                    id_coordinacion: validateAdminUser[1].id_coordinacion,
                    correo: validateAdminUser[1].correo,
                    rol: validateAdminUser[1].rol
                },
                accessToken: accessToken
            })
        }


        throw new Error('Algo a salido mal');
    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message
        })
    }
}





export default {
    studentRegistration,
    adminRegistration,
    getSedes,
    getFacultadesBySede,
    getCoordinacionByFacultad,
    getCarrerasByCoordinacion,
    loginManagement
}

