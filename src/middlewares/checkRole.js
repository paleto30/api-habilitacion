
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




export const checkUserRoles = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.usuario.rol;

        if (!requiredRole.includes(userRole)) {
            return res.status(401).json({ status: false, error: 'No cuenta con permisos para realizar esta acción' })
        }
        next();
    }
}