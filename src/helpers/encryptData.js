import bcrypt from 'bcrypt';



/*  
    funcion recibe dos parametros:
    el primero es la palabra a encryptar y el segundo es el numero de salt 
    retorna la palabra encryptada
*/ 
export const encryptData = async (wordToEncrypt, saltNumber)=>{
    try {
        const salts = await bcrypt.genSalt(Number(saltNumber));
        const wordEncrypt = await bcrypt.hash(wordToEncrypt,salts);
        return wordEncrypt;
    } catch (error) {
        throw new Error('No se pudo encriptar la clave.');
    }
}


/* 
    funcion para comparar los hash (verificacion)

    el primer parametro es la palabra que se quiere comparar
    el segundo es la palabra ya hasheada con la que se quiere verificar la similitud
*/
export const verifyEncryptData = async (wordToConfirm, wordEncrypt)=>{
    try {
        const wordValid = await bcrypt.compare(wordToConfirm, wordEncrypt);
        return wordValid;
    } catch (error) {
        throw new Error('No se pudo comparar la palabra encriptada');
    }
}