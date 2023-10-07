import jwt from "jsonwebtoken";
import config from "../config/config.js";


// middleware para la verificacion del bearer token en las diferentes rutas 
const verifyAccessToken = (req, res, next) => {

    // verificamos que exista el token y sea de tipo Bearer
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: false, error: 'Token no proporcionao o formato de token incorrecto' });
    }

    // obtenemos el token excluyendo el Bearer
    const token = authHeader.split(' ')[1]; 

    try {
        const verifytoken = jwt.verify(token, config.secret_key);
        req.usuario = verifytoken;
        next();
    } catch (error) {
        res.status(401).json({ status: false, error: "No cuenta con permisos para realizar esta acción", error: error.message })
    }
}

// exportamos el middleware
export default verifyAccessToken; 