

export const handlerHttpErrors = (res, error, errorRaw = 'Ocurrio un error.') => {
    console.error(` <Error> Log-handler-error -> ${errorRaw}`);
    res.status(400).json({ status: false, error: error });
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

