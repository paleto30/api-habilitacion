import authService from "../services/auth.service.js";




/**
 *  funcion para obtener las sedes disponibles en el registro de estudiante 
 */
const getSedes = async (req, res) => {
    try {
        const sedes = await authService.getAvailableSedes();

        return res.json({
            status: true,
            message: 'consultado correctamente',
            sedes
        })
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
}

/**
 *  Funcion para obtener las facultades disponibles segun el la sede 
*/
const getFacultadesBySede = async (req, res) => {
    try {
        const { id_sede } = req.params;
        const facultades = await authService.getAvailableFacultades(Number(id_sede));

        return res.json({
            status: true, 
            message: 'consultado correctamente',
            facultades
        })

    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
}





// funcion para registrar un estudiante
const studentRegistration = async (req, res) => {
    try {





    } catch (error) {
        res.status(400).json({ status: false, error: error.message })
    }
}







export default {
    studentRegistration,
    getSedes,
    getFacultadesBySede
}

