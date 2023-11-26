import { DataTypes } from "sequelize";
import db from "../db/conexion.js";



// modelo de estudiante 
const MateriaModel = db.define('materia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    creditos: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            max: 1
        }
    },
}, {
    tableName: 'tg_materia',
    timestamps: true,
    underscored: true
});


export default MateriaModel;