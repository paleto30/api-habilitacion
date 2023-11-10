import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import verifyToken from '../middlewares/verifyAccessToken.js';
import { checkUserRoles } from '../middlewares/checkRole.js';







// creamos un router
const router = Router();


/*  ruta para obtener la lista de sedes disponibles */
router.get('/campus', [], authController.getCampus);

/* ruta para obtener la lista de facultades correspondientes a la sede seleccionada */
router.get('/campus/:id_sede/faculties', [], authController.getFacultiesByCampus);

/* ruta para obtener la lista de coordinaciones */
router.get('/faculties/:id_facultad/coordinations', [], authController.getCoordinationByFacultie);

/* ruta paa obtener la lista de carreras correspondientes a la coordinacion */
router.get('/coordinations/:id_coordinacion/careers', [], authController.getCareersByCoordination);





/* ruta para hacer el registro de un estudiante */
router.post('/register', [], authController.studentRegistration);

/* ruta para hacer el Inicio de sesion de un usuario */
router.post('/login', [], authController.loginManagement);

/* ruta para hacer el registro de un admin */
router.post('/register/user-admin', [verifyToken, checkUserRoles([1, 2])], authController.adminRegistration);






export default router;