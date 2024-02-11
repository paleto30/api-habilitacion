import { Router } from "express";
import administratorsController from "../controllers/administrators.controller.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import { checkUserRole } from "../middlewares/checkRole.js";
import { createNewDTO, getByIdDto, updateDto } from "../middlewares/DTO/administrator.dto.js";



const router = Router();

//* ruta para acceder a todos los registros
router.get(
    '/',                                    //? <-- path
    [verifyAccessToken, checkUserRole(1)],  //? <-- middlewares
    administratorsController.findAll        //? <-- controller/method
);


//* ruta para encontrar un registro por id
router.get(
    '/:id',
    [verifyAccessToken, checkUserRole(1), getByIdDto],
    administratorsController.findById
);


//* ruta para crear un registro
router.post(
    '/',
    [verifyAccessToken, checkUserRole(1), createNewDTO],
    administratorsController.createNew
);


//* ruta para actualizar un registro
router.put(
    '/:id',
    [verifyAccessToken, checkUserRole(1), updateDto],
    administratorsController.updateOne);


//* ruta para eliminar un registro
router.delete(
    '/:id',
    [verifyAccessToken, checkUserRole(1), getByIdDto],
    administratorsController.deteleOne
);


export default router;