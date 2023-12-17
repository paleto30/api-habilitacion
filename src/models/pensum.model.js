import { DataTypes } from "sequelize";
import db from "../db/conexion.js";



// modelo de estudiante 
const PensumModel = db.define('pensum', {
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
        allowNull: false,
    },
    id_carrera: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_carrera',
            key: 'id'
        },
    }
}, {
    tableName: 'tg_pensum',
    timestamps: true,
    underscored: true
});


export default PensumModel;