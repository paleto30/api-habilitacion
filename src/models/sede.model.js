import { DataTypes } from 'sequelize';
import db from '../db/conexion.js';


// Modelo de la tabla de sedes
const SedeModel = db.define('sedes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    municipio: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate:{
            isEmail: true
        },
        defaultValue: null
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'tg_sede',
    timestamps: true,
    underscored: true
})




export default SedeModel;