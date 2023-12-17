import { Sequelize } from "sequelize";
import config from "../config/config.js";



const db = new Sequelize(
    config.database,
    config.nameuser,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: false,
    }
);



export default db;




export const getDbInstance = () => {
    return new Sequelize(
        config.database,
        config.nameuser,
        config.password,
        {
            pool: {
                max: 2,
                min: 0,
                acquire: 30000,
                logging: true
            },
            host: config.host,
            dialect: config.dialect
        }
    );
}