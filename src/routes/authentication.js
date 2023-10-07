import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import verifyToken from '../middlewares/verifyAccessToken.js';
import { checkUserRole } from '../middlewares/checkRole.js';







// creamos un router
const router = Router();


/*  ruta para obtener la lista de sedes disponibles */
router.get('/sedes', [], authController.getSedes);

/* ruta para obtener la lista de facultades correspondientes a la sede seleccionada */
router.get('/sede/:id_sede/facultades', [], authController.getFacultadesBySede);

/* ruta para obtener la lista de coordinaciones */
router.get('/facultad/:id_facultad/coordinaciones', [], authController.getCoordinacionByFacultad);

/* ruta paa obtener la lista de carreras correspondientes a la coordinacion */
router.get('/coordinacion/:id_coordinacion/carreras', [], authController.getCarrerasByCoordinacion);



/* ruta para hacer el registro de un estudiante */
router.post('/registrarse', [], authController.studentRegistration);

/* ruta para hacer el Inicio de sesion de un usuario */
router.post('/iniciar-sesion', [], authController.loginManagement);

/* ruta para hacer el registro de un admin */
router.post('/register/user-admin', [verifyToken, checkUserRole(2)], authController.adminRegistration);






export default router;