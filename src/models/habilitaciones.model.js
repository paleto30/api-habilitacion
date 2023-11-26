import { DataTypes } from "sequelize";
import db from "../db/conexion.js";



// modelo de estudiante 
const HabilitacionModel = db.define('habilitacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    referencia_pago: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    id_estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'tg_estudiante',
            key: 'id'
        }
    },
    id_materia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'tg_materia',
            key: 'id'
        }
    },
    img_factura: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    img_recibo_pago:{
        type: DataTypes.STRING(1000),
        allowNull: false
    }
}, {
    tableName: 'tg_habilitaciones',
    timestamps: true,
    underscored: true
});


export default HabilitacionModel;