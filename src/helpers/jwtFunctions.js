import jwt  from "jsonwebtoken";
import config from "../config/config.js";



// funcion para crear los tokens
export const createToken = (payload, expiration) =>{
    const token = jwt.sign(payload,config.secret_key,{
        algorithm: 'HS256',
        expiresIn: expiration,
        issuer: 'optimunZoe'
    });
    return token;
}


// funcion para obtener la data de los tokens
export const getTokenData = (token) => {
    let data = null;
    
    jwt.verify(token,config.secret_key,(err,decode)=>{
        if (err) {
            return data;
        }else{
            data = decode 
        }
    })

    return data;
}