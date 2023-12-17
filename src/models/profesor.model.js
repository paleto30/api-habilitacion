import { DataTypes } from "sequelize";
import db from "../db/conexion.js";



// modelo de estudiante 
const ProfesorModel = db.define('profesor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cedula: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            len: [3, 150]
        }
    },
    apellido: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            len: [3, 150]
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: [6, 20]
        }
    },
    correo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [10, 100]
        }
    },
    titulo: {
        type: DataTypes.STRING(300),
        allowNull: false,
        validate: {
            len: [8, 255]
        }
    },
}, {
    tableName: 'tg_profesor',
    timestamps: true,
    underscored: true
});


export default ProfesorModel;