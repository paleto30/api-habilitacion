
function getDateError() {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
    return `${dia}/${mes}/${anio} - ${horas}:${minutos}:${segundos}`;
}


/**
 * 
 * @param {Request} res 
 * @param {string} error 
 */
export const handlerHttpErrors = (res, error) => {
    console.error(`[ ${getDateError()} ] Error -> ${error.message}`);
    res.status(error.httpCode || 400).json({ status: false, error: error.message });
}




export const idIsNumber = (id) => {

    if (Number.isNaN(Number(id))) {
        return false;
    }

    return true;
}



export const checkEmailDomain = (email, typeUser) => {
    const expressionAdmin = /^[a-zA-Z0-9._%+-]+@correo\.uts\.edu\.co$/;
    const expressionStudent = /^[a-zA-Z0-9._%+-]+@uts\.edu\.co$/;
    const actions = {
        "TYPE_STUDENT": (email) => expressionStudent.test(email),
        "TYPE_ADMIN": (email) => expressionAdmin.test(email)
    }

    return actions[typeUser](email);
}




