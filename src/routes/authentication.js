import { Router } from "express";
import authController from "../controllers/auth.controller.js";


// creamos un router
const router = Router();


/*  ruta para obtener la lista de sedes disponibles */
router.get('/sedes',[], authController.getSedes);

/* ruta para obtener la lista de facultades correspondientes a la sede seleccionada */
router.get('/sede/:id_sede/facultades',[],authController.getFacultadesBySede);

/* ruta para obtener la lista de coordinaciones */
router.get('/facultad/:id_facultad/coordinaciones',[], authController.getCoordinacionByFacultad);

/* ruta paa obtener la lista de carreras correspondientes a la coordinacion */
router.get('/coordinacion/:id_coordinacion/carreras',[],authController.getCarrerasByCoordinacion);




/* ruta para hacer el registro de un estudiante */
router.post('/registrarse',[],authController.studentRegistration);








export default router;