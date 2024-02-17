import { Router } from "express";
import administratorsController from "../controllers/administrators.controller.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import { checkUserRoles } from "../middlewares/checkRole.js";
import { createNewDTO, getByIdDto, updateDto, validateQueryFiltersDto } from "../middlewares/DTO/administrator.dto.js";



const router = Router();

//* ruta para acceder a todos los registros
router.get(
    '/',                                    //? <-- path
    [verifyAccessToken, checkUserRoles([1]), validateQueryFiltersDto],  //? <-- middlewares
    administratorsController.findAll        //? <-- controller/method
);


//* ruta para encontrar un registro por id
router.get(
    '/:id',
    [verifyAccessToken, checkUserRoles([1]), getByIdDto],
    administratorsController.findById
);


//* ruta para crear un registro
router.post(
    '/',
    [verifyAccessToken, checkUserRoles([1]), createNewDTO],
    administratorsController.createNew
);


//* ruta para actualizar un registro
router.put(
    '/:id',
    [verifyAccessToken, checkUserRoles([1]), updateDto],
    administratorsController.updateOne);


//* ruta para eliminar un registro
router.delete(
    '/:id',
    [verifyAccessToken, checkUserRoles([1]), getByIdDto],
    administratorsController.deteleOne
);


export default router;