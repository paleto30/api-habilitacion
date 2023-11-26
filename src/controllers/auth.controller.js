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

    const errorResponse = {
        'EMAIL_DOMAIN_INVALID': { status: 409, error: `El dominio del correo no es valido.` },
        'EXISTING_ID_DOCUMENT': { status: 409, error: `El documento de identidad ya esta registrado.` },
        'EXISTING_EMAIL': { status: 409, error: `El correo electronico ya esta registrado.` },
        'NOT_EXISTING_CAREER': { status: 404, error: `La carrera no es valida.` },
    }
    try {
        const body = req.body;
        const validate = await schemaStudentRegistration.validateAsync(body);
        const response = await authService.studentRegister(validate);
        const errorCase = errorResponse[response];
        if (errorCase) return res.status(errorCase.status).json({ status: false, error: errorCase.error });

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
        handlerHttpErrors(res, `${error.message}`, error.message);
    }
}





/** 
    @author: Andres Galvis 
    @description: funcion para realizar el inicio de sesion a la plataforma 
    @POST
    @PATH : '/api/v1/authentication/iniciar-sesion' 
*/
const loginManagement = async (req, res) => {

    const errorResponse = {
        'UNREGISTERED_USER': { status: 404, error: 'Usuario no registrado.' },
        'PASSWORD_INCORRECT': { status: 403, error: 'Contraseña incorrecta.' }
    }

    try {
        const { correo, clave } = req.body;
        const validate = await schemaStudentLogin.validateAsync({ correo, clave });

        // proceso para login estudiante
        const emailDomainStudent = checkEmailDomain(validate.correo, 'TYPE_STUDENT');
        if (emailDomainStudent) {
            const responseLogin = await authService.studentLogin(validate,);

            const errorCase = errorResponse[responseLogin];
            if (errorCase) return res.status(errorCase.status).json({ status: false, error: errorCase.error });
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

            const errorCase = errorResponse[responseLogin];
            if (errorCase) return res.status(errorCase.status).json({ status: false, error: errorCase.error });
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
        handlerHttpErrors(res, `${error.message}`);
    }
}





export default {
    getCampus,
    getFacultiesByCampus,
    getCoordinationByFacultie,
    getCareersByCoordination,
    studentRegistration,
    adminRegistration,
    loginManagement,
}

