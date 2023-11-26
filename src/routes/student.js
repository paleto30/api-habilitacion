import { Router } from "express";
import estudianteController from '../controllers/estudiante.controller.js';
import { handleMulterError, middlewareUpload } from '../middlewares/getFiles.js';
import verifyAccessToken from '../middlewares/verifyAccessToken.js';
import { checkUserRoles } from '../middlewares/checkRole.js';
const router = Router();




// ruta para obtener el listado de materias para el estudiante 
router.get('/student-subjects', [verifyAccessToken, checkUserRoles([3]), estudianteController.getStudentSubjects]);

// ruta para obtener el listado de profesores que dictan la materia
router.get('/student-subjects/:id_materia/teacher',[], estudianteController.getTeachersForSubject);

// ruta para realizar la solicitud de una habilitacion para un estudiante
router.post('/make-request/', [verifyAccessToken, checkUserRoles([3]), middlewareUpload, handleMulterError], estudianteController.makeOneRequest);








export default router;