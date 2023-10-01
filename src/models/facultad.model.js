import { DataTypes } from "sequelize";
import db from "../db/conexion.js";



const FacultadModel = db.define('facultad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [5, 255]
        }
    },
    id_sede: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_sede',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'tg_facultad',
    timestamps: true,
    underscored: true
});


export default FacultadModel;