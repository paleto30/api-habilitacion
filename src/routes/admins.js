import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { DTOvalidateQueryFilters, DTOvalidateRecoveryDetails, DTOvalidateRecoveryTable } from "../middlewares/DTO/admin.DTO.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import { checkUserRole } from "../middlewares/checkRole.js";



const router = Router();



/* ruta para retornar el listado de estudiantes */
router.get(
    '/student-list',
    [verifyAccessToken, checkUserRole(2), DTOvalidateQueryFilters],
    adminController.getStudentList
);



/* ruta para retornar el listado de habilitaciones */
router.get(
    '/recovery-list',
    [verifyAccessToken, checkUserRole(2), DTOvalidateRecoveryTable],
    adminController.getQualificationsList
);



/* ruta para mostrar la informacion */
router.get(
    '/recovery-details/:id_recovery', //*  id, id_estudiante, id_profesor <- retorna full data 
    [verifyAccessToken, checkUserRole(2), DTOvalidateRecoveryDetails],
    adminController.getDetailsInformacion
)


export default router;