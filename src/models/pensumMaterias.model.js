import { DataTypes } from "sequelize";
import db from "../db/conexion.js";



// modelo de estudiante 
const PensumMateriasModel = db.define('pensum_materias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_pensum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_pensum',
            key: 'id'
        },
    },
    id_materia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_materia',
            key: 'id'
        },
    }
}, {
    tableName: 'tr_pensum_materias',
    timestamps: true,
    underscored: true
});


export default PensumMateriasModel;