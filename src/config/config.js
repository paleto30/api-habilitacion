import { config } from "dotenv"

config()

export default {
    host: process.env.HOST_NAME,
    database: process.env.DATABASE_NAME,
    nameuser: process.env.NAME_USER,
    password: process.env.PASSWORD_USER,
    port: process.env.PORT,
    dialect: process.env.DIALECT,
    secret_key: process.env.JWT_KEY_PUBLIC
}