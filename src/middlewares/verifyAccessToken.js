import jwt from "jsonwebtoken";
import config from "../config/config.js";


// middleware para la verificacion del bearer token en las diferentes rutas 
const verifyAccessToken = (req, res, next) => {

    // verificamos que exista el token y sea de tipo Bearer
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ status: false, error: 'Token no proporcionado.' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: false, error: 'Formato de token incorrecto.' });
    }

    // obtenemos el token excluyendo el Bearer
    const token = authHeader.split(' ').pop();

    try {
        const verifytoken = jwt.verify(token, config.secret_key);
        req.usuario = verifytoken;
        next();
    } catch (error) {
        res.status(401).json({ status: false, error: error.message })
    }
}

// exportamos el middleware
export default verifyAccessToken; 