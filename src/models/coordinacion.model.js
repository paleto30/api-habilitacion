import db from "../db/conexion.js";
import { DataTypes } from 'sequelize';



// modelo par ala tabla de coordinacion
const CoordinacionModel = db.define('coordinacion',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [5, 255]
        }
    },
    id_facultad:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_facultad',
            key: 'id'
        }
    },
},{
    tableName: 'tg_coordinacion',
    timestamps: true,
    underscored: true
});


export default CoordinacionModel;