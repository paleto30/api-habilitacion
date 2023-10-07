
// middleware para verificacion del rol  
export const checkUserRole = (requiredRole) => {
    return (req, res, next) => {
        const rolUser = req.usuario.rol;
        if (rolUser !== requiredRole) {
            return res.status(401).json({ status: false, error: 'No cuenta con permisos para realizar esta acción' })
        }
        next();  // si todo estuvo ok, da permiso 
    };
};