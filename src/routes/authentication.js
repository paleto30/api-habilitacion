import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { dtoCoordinaciondId, dtoFacultadId, dtoLogin, dtoRegisterStudent, dtoSedeId } from "../middlewares/DTO/auth.dto.js";







// creamos un router
const router = Router();


/*  ruta para obtener la lista de sedes disponibles */
router.get(
    '/campus',
    [],
    authController.getCampus
);

/* ruta para obtener la lista de facultades correspondientes a la sede seleccionada */
router.get(
    '/campus/:id_sede/faculties',
    [dtoSedeId],
    authController.getFacultiesByCampus
);

/* ruta para obtener la lista de coordinaciones */
router.get(
    '/faculties/:id_facultad/coordinations',
    [dtoFacultadId],
    authController.getCoordinationByFacultie
);

/* ruta paa obtener la lista de carreras correspondientes a la coordinacion */
router.get(
    '/coordinations/:id_coordinacion/careers',
    [dtoCoordinaciondId],
    authController.getCareersByCoordination
);


/* ruta para hacer el registro de un estudiante */
router.post(
    '/register',
    [dtoRegisterStudent],
    authController.studentRegistration
);

/* ruta para hacer el Inicio de sesion de un usuario */
router.post(
    '/login',
    [dtoLogin],
    authController.loginManagement
);

/* ruta para hacer el registro de un admin */
//router.post('/register/user-admin', [verifyToken, checkUserRoles([1, 2])], authController.adminRegistration);






export default router;