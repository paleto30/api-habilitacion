import db from "../db/conexion.js";
import { DataTypes } from "sequelize";



const CarreraModel = db.define('carrera',{
    id:{
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
    id_coordinacion:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_coordinacion',
            key: 'id'
        }
    },
    estado:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},
{
    tableName: 'tg_carrera',
    timestamps: true,
    underscored: true
});


export default CarreraModel;