import { Sequelize } from "sequelize";
import config from "../config/config.js";



const db = new Sequelize(
    config.database,
    config.nameuser,
    config.password,
    {
        host: config.host,
        dialect: config.dialect
    }
);



export default db;