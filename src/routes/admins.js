import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { DTOvalidateQueryFilters, DTOvalidateRecoveryTable } from "../middlewares/DTO/admin.DTO.js";
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
)

export default router;