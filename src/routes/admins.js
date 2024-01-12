import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { DTOvalidateQueryFilters } from "../middlewares/DTO/admin.DTO.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import { checkUserRole } from "../middlewares/checkRole.js";



const router = Router();



router.get('/student-list', [verifyAccessToken, checkUserRole(2), DTOvalidateQueryFilters], adminController.getStudentList);



export default router;