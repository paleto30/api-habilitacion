import { Router } from "express";
import recoveriesController from "../controllers/recoveries.controller.js";
import { DTOvalidateNameFile, DTOvalidateQueryFilters, DTOvalidateRecoveryDetails, DTOvalidateRecoveryTable } from "../middlewares/DTO/recoveries.dto.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import { checkUserRole } from "../middlewares/checkRole.js";



const router = Router();



/* ruta para retornar el listado de estudiantes */
router.get(
    '/student-list',
    [verifyAccessToken, checkUserRole(2), DTOvalidateQueryFilters],
    recoveriesController.getStudentList
);



/* ruta para retornar el listado de habilitaciones */
router.get(
    '/recovery-list',
    [verifyAccessToken, checkUserRole(2), DTOvalidateRecoveryTable],
    recoveriesController.getQualificationsList
);



/* ruta para mostrar la informacion */
router.get(
    '/recovery-details/:id_recovery', //*  id, id_estudiante, id_profesor <- retorna full data 
    [verifyAccessToken, checkUserRole(2), DTOvalidateRecoveryDetails],
    recoveriesController.getDetailsInformacion
)


// ruta para mostrar el pdf
router.get(
    '/view-pdf/:name',
    [DTOvalidateNameFile],
    recoveriesController.sendPdfFile
)

// ruta para mostrar el pdf
router.get(
    '/view-image/:name',
    [DTOvalidateNameFile],
    recoveriesController.sendImgFile
)


export default router;