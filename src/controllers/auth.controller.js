//import { schemaAdminRegistration } from "../schemas/auth.schema.js";
import authService from "../services/auth.service.js";
import { checkEmailDomain, handlerHttpErrors } from '../helpers/errorhandler.js';
import { ConflictException } from "../helpers/classError.js";






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
        handlerHttpErrors(res, error);
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
        const { id_sede } = req.dto;
        const facultades = await authService.getAvailableFaculties(id_sede);
        return res.json({
            status: true,
            message: 'consultado correctamente',
            facultades
        })
    } catch (error) {
        handlerHttpErrors(res, error);
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
        const { id_facultad } = req.dto;
        const coordinaciones = await authService.getAvailableCoordination(id_facultad);
        return res.json({
            status: true,
            message: 'consultado correctamente',
            coordinaciones
        });
    } catch (error) {
        handlerHttpErrors(res, error);
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
        const { id_coordinacion } = req.dto;
        const carreras = await authService.getAvailableCareers(id_coordinacion);
        return res.json({
            status: true,
            message: 'consultado ccorrectamente',
            carreras
        })

    } catch (error) {
        handlerHttpErrors(res, error);
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
        const response = await authService.studentRegister(req.dto);
        return res.status(201).json({
            status: true,
            message: 'Registro exitoso',
            estudiante: response
        });
    } catch (error) {
        handlerHttpErrors(res, error);
    }
};




/** 
    @author: Andres Galvis
    @description: funcion para realizar el registro de un Administrador dentro de la plataforma
    @POST
    @PATH : '/api/v1/authentication/register/user-admin' 
*/

/* const adminRegistration = async (req, res) => {

    const errorResponse = {
        'EMAIL_DOMAIN_INVALID': { status: 409, error: `El dominio del correo no es valido.` },
        'EXISTING_ID_DOCUMENT': { status: 409, error: `El documento de identidad ya esta registrado.` },
        'EXISTING_EMAIL': { status: 409, error: `El correo electronico ya esta registrado.` },
        'NOT_EXISTING_COORDINATION': { status: 404, error: `La coordinacion no es valida.` }
    }

    try {
        const { body } = req;
        const validate = await schemaAdminRegistration.validateAsync(body);
        const resAdmin = await authService.adminRegister(validate);

        const errorCase = errorResponse[resAdmin];
        if (errorCase) return res.status(errorCase.status).json({ status: false, error: errorCase.error });

        return res.status(201).json({
            status: true,
            message: 'Registrado correctamente',
            administrador: resAdmin
        });
    } catch (error) {
        handlerHttpErrors(res, error.message);
    }
} */





/** 
    @author: Andres Galvis 
    @description: funcion para realizar el inicio de sesion a la plataforma 
    @POST
    @PATH : '/api/v1/authentication/iniciar-sesion' 
*/
const loginManagement = async (req, res) => {
    try {
        const { correo, clave } = req.dto;
        // proceso para login estudiante
        const emailDomainStudent = checkEmailDomain(correo, 'TYPE_STUDENT');
        if (emailDomainStudent) {
            const responseLogin = await authService.studentLogin(correo, clave);
            return res.json({
                status: true,
                message: 'Usuario verificado correctamente',
                user: responseLogin.userData,
                accessToken: responseLogin.accessToken
            });
        }

        /// proceso para login admin
        const emailDomainAdmin = checkEmailDomain(correo, 'TYPE_ADMIN');
        if (emailDomainAdmin) {
            const responseLogin = await authService.adminLogin(correo, clave);
            return res.json({
                status: true,
                message: 'Usuario verificado correctamente',
                user: responseLogin.userData,
                accessToken: responseLogin.accessToken
            });
        }

        throw new ConflictException('El dominio del correo no es un dominio valido para el sistema.');
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}





export default {
    getCampus,
    getFacultiesByCampus,
    getCoordinationByFacultie,
    getCareersByCoordination,
    studentRegistration,
    //adminRegistration,
    loginManagement,
}

