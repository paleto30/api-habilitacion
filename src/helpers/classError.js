
/**
 *  mi Exception principal 
*/
export class Exceptions extends Error {
    httpCode;
    constructor(message, httpCode) {
        super(message);
        this.httpCode = httpCode;
    }
    getHttpCode() {
        return this.httpCode;
    }
}

/**
 *  Clase para manejar las execpciones de notfound
*/
export class NotFoundException extends Exceptions {
    constructor(message) {
        super(message, 404);
    }
}


/**
 *  Clase para manejar las Excepcions de Conflicto
*/
export class ConflictException extends Exceptions {
    constructor(message) {
        super(message, 409);
    }
}


/**
 * clase para manejar las excepciones de Forbiden
*/
export class UnauthorizedException extends Exceptions {
    constructor(message) {
        super(message, 401);
    }
}


/**
 *  clase para manejar Unprocessable Entity execption
*/
export class UnprocessableException extends Exceptions {
    constructor(message) {
        super(message, 422);
    }
}