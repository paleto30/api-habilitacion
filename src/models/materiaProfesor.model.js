import { DataTypes } from "sequelize";
import db from "../db/conexion.js";



// modelo de estudiante 
const MateriaProfesorModel = db.define('materia_profesor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_materia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_materia',
            key: 'id'
        }
    },
    id_profesor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_profesor',
            key: 'id'
        }
    },
}, {
    tableName: 'tr_materia_profesor',
    timestamps: true,
    underscored: true
});


export default MateriaProfesorModel;