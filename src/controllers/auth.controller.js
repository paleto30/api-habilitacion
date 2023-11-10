import { schemaStudentRegistration, schemaStudentLogin, schemaAdminRegistration } from "../schemas/auth.schema.js";
import authService from "../services/auth.service.js";
import { checkEmailDomain, handlerHttpErrors, idIsNumber } from '../helpers/errorhandler.js';






/** 
 *  @author:  Andres Galvis  
 *  @description: funcion para obtener las sedes disponibles para el forrmulario de registro de un estudiante
 *  @GET :
 *  @PATH :  /api/v1/authentication/campus
 */
const getCampus = async (req, res) => {
    try {
        const sedes = await authService.getAvailableCampus();
        return res.json({
            status: true,
            message: 'consultado correctamente',
            sedes
        })
    } catch (error) {
        handlerHttpErrors(res, `${error.message}`);
    }
}




/** 
 *  @author:  Andres Galvis  
 *  @description: Funcion para obtener las facultades disponibles segun el la sede 
 *  @GET 
 *  @PATH :  /api/v1/authentication/campus/:id_sede/faculties
 */
const getFacultiesByCampus = async (req, res) => {
    try {
        const { id_sede } = req.params;

        if (!idIsNumber(id_sede)) {
            return res.status(404).json({ status: false, error: `El parametro ID <${id_sede}> no es valido.` });
        }
        const facultades = await authService.getAvailableFaculties(Number(id_sede));

        return res.json({
            status: true,
            message: 'consultado correctamente',
            facultades
        })
    } catch (error) {
        handlerHttpErrors(res, `${error.message}`);
    }
}



/** 
 *  @author:  Andres Galvis  
 *  @description: funcion para obtener las coordinaciones disponibles para la respectiva sede 
 *  @GET 
 *  @PATH :  /api/v1/authentication/faculties/:id_facultad/coordinations
 */
const getCoordinationByFacultie = async (req, res) => {
    try {

        const { id_facultad } = req.params;

        if (!idIsNumber(id_facultad)) {
            return res.status(404).json({ status: false, error: `El parametro ID <${id_facultad}> no es valido.` });
        }
        const coordinaciones = await authService.getAvailableCoordination(Number(id_facultad));

        return res.json({
            status: true,
            message: 'consultado correctamente',
            coordinaciones
        });


    } catch (error) {
        handlerHttpErrors(res, `${error.message}`);
    }
}



/** 
 *  @author:  Andres Galvis  
 *  @description: funcion para obtener las carreras disponibles para la respectiva coordinacion 
 *  @GET 
 *  @PATH :  /api/v1/authentication/coordinations/:id_coordinacion/careers
 */
const getCareersByCoordination = async (req, res) => {
    try {

        const { id_coordinacion } = req.params;
        if (!idIsNumber(id_coordinacion)) {
            return res.status(404).json({ status: false, error: `El parametro ID <${id_coordinacion}> no es valido.` });
        }
        const carreras = await authService.getAvailableCareers(Number(id_coordinacion));

        return res.json({
            status: true,
            message: 'consultado ccorrectamente',
            carreras
        })

    } catch (error) {
        handlerHttpErrors(res, `${error.message}`);
    }
}



/** 
    @author: Andres Galvis
    @description: funcion para realizar el registro de un estudiante dentro de la plataforma
    @POST
    @PATH : '/api/v1/authentication/register' 
*/
const studentRegistration = async (req, res) => {
    try {
        const body = req.body;
        const validate = await schemaStudentRegistration.validateAsync(body);
        const response = await authService.studentRegister(validate);

        if (response === 'EXISTING_ID_DOCUMENT') return res.status(409).json({ status: false, error: `El documento de identidad ya esta registrado.` });
        if (response === 'EXISTING_ID_DOCUMENT') return res.status(409).json({ status: false, error: `El documento de identidad ya esta registrado.` });
        if (response === 'EXISTING_EMAIL') return res.status(409).json({ status: false, error: `El correo electronico ya esta registrado.` });
        if (response === 'NOT_EXISTING_CAREER') return res.status(409).json({ status: false, error: `La carrera no es valida.` });

        return res.status(201).json({
            status: true,
            message: 'Registro exitoso',
            estudiante: response
        });
    } catch (error) {
        handlerHttpErrors(res, `${error.message}`);
    }
};




/** 
    @author: Andres Galvis
    @description: funcion para realizar el registro de un Administrador dentro de la plataforma
    @POST
    @PATH : '/api/v1/authentication/register/user-admin' 
*/
const adminRegistration = async (req, res) => {
    try {
        const body = req.body;
        const validate = await schemaAdminRegistration.validateAsync(body);
        const resAdmin = await authService.adminRegister(validate);

        if (resAdmin === 'EMAIL_DOMAIN_INVALID') return res.status(409).json({ status: false, error: `El dominio del correo es invalido.` });
        if (resAdmin === 'EXISTING_ID_DOCUMENT') return res.status(409).json({ status: false, error: `El documento de identidad ya esta registrado.` });
        if (resAdmin === 'EXISTING_EMAIL') return res.status(409).json({ status: false, error: `El correo electronico ya esta registrado.` });
        if (resAdmin === 'NOT_EXISTING_COORDINATION') return res.status(409).json({ status: false, error: `La carrera no es valida.` });

        return res.status(201).json({
            status: true,
            message: 'Registrado correctamente',
            administrador: resAdmin
        });
    } catch (error) {
        handlerHttpErrors(res, `${error.message}`);
    }
}





/** 
    @author: Andres Galvis 
    @description: funcion para realizar el inicio de sesion a la plataforma 
    @POST
    @PATH : '/api/v1/authentication/iniciar-sesion' 
*/
const loginManagement = async (req, res) => {
    try {
        const { correo, clave } = req.body;
        const validate = await schemaStudentLogin.validateAsync({ correo, clave });

        // proceso para login estudiante
        const emailDomainStudent = checkEmailDomain(validate.correo, 'TYPE_STUDENT');
        if (emailDomainStudent) {
            const responseLogin = await authService.studentLogin(validate, );
            if (responseLogin === 'UNREGISTERED_USER') return res.status(404).json({ status: false, error: 'Usuario no registrado.' });
            if (responseLogin === 'PASSWORD_INCORRECT') return res.status(403).json({ status: false, error: 'Contraseña incorrecta.' });
            return res.json({
                status: true,
                message: 'Usuario verificado correctamente',
                user: responseLogin.userData,
                accessToken: responseLogin.accessToken
            });
        }

        /// proceso para login admin
        const emailDomainAdmin = checkEmailDomain(validate.correo, 'TYPE_ADMIN');
        if (emailDomainAdmin) {
            const responseLogin = await authService.adminLogin(validate);
            if (responseLogin === 'UNREGISTERED_USER') return res.status(404).json({ status: false, error: 'Usuario no registrado.' });
            if (responseLogin === 'PASSWORD_INCORRECT') return res.status(403).json({ status: false, error: 'Contraseña incorrecta.' });
            return res.json({
                status: true,
                message: 'Usuario verificado correctamente',
                user: responseLogin.userData,
                accessToken: responseLogin.accessToken
            });
        }

        return res.status(409).json({
            status: false,
            error: 'El dominio del correo no es un dominio valido para el sistema.'
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message
        })
    }
}





export default {
    getCampus,
    getFacultiesByCampus,
    getCoordinationByFacultie,
    getCareersByCoordination,
    studentRegistration,
    adminRegistration,
    loginManagement
}

