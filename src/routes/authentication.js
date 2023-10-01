import { Router } from "express";
import authController from "../controllers/auth.controller.js";


// creamos un router
const router = Router();


/*  ruta para obtener la lista de sedes disponibles */
router.get('/sedes',[], authController.getSedes);

/* ruta para obtener la lista de facultades correspondientes a la sede seleccionada */
router.get('/facultades/:id_sede',[],authController.getFacultadesBySede);

/* ruta para hacer el registro de un estudiante */
router.post('/register',);








export default router;