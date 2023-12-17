import { Router } from "express";
import estudianteController from '../controllers/estudiante.controller.js';
import { handleMulterError, middlewareUpload } from '../middlewares/getFiles.js';
import verifyAccessToken from '../middlewares/verifyAccessToken.js';
import { checkUserRole } from '../middlewares/checkRole.js';









const router = Router();




// ruta para obtener el listado de materias para el estudiante 
router.get('/student-subjects', [verifyAccessToken, checkUserRole(3), estudianteController.getStudentSubjects]);

// ruta para obtener el listado de profesores que dictan la materia
router.get('/student-subjects/:id_materia/teacher', [verifyAccessToken, checkUserRole(3)], estudianteController.getTeachersForSubject);

// ruta para realizar la solicitud de una habilitacion para un estudiante
router.post('/make-request/', [verifyAccessToken, checkUserRole(3), middlewareUpload, handleMulterError], estudianteController.makeOneRequest);


// ruta para listar  las solicitudes del estudiante
router.get('/request-history', [verifyAccessToken, checkUserRole(3)], estudianteController.getHistoryOfRequest);





export default router;