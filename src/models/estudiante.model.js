import { DataTypes } from "sequelize";
import db from "../db/conexion.js";



// modelo de estudiante 
const EstudianteModel = db.define('estudiante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    doc_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    },
    apellido: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [3, 255]
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
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [10, 100]
        }
    },
    clave: {
        type: DataTypes.STRING(300),
        allowNull: false,
        validate: {
            len: [8, 255]
        }
    },
    id_carrera: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tg_carrera',
            key: 'id'
        },
    },
    rol: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 3,
        validate: {
            is: [3]
        }

    }
}, {
    tableName: 'tg_estudiante',
    timestamps: true,
    underscored: true
});


export default EstudianteModel;