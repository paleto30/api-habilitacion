import SedeModel from '../models/sede.model.js';
import FacultadModel from '../models/facultad.model.js';
import CoordinacionModel from '../models/coordinacion.model.js';
import CarreraModel from '../models/carrera.model.js';
import EstudianteModel from '../models/estudiante.model.js';


// -> funcion para asignar las respectivas relaciones que tienen los modelos entre si 
export const createRelationship = () => {

    // una sede tiene varias facultades
    // una facultada solo pertenece a una sede
    SedeModel.hasMany(FacultadModel, { foreignKey: 'id_sede' });
    FacultadModel.belongsTo(SedeModel, { foreignKey: 'id_sede', targetKey: 'id' });


    // una facultad puede tener varias coordinaciones
    // una cordinacion solo puede pertenecer a una facultad
    FacultadModel.hasMany(CoordinacionModel, { foreignKey: 'id_facultad' });
    CoordinacionModel.belongsTo(FacultadModel, { foreignKey: 'id_facultad', targetKey: 'id' });


    // una coordinacion puede tener una o varias carreras (tecnologia e ingenieria)
    // una carrera solo puede pertenecer a una coordinacion
    CoordinacionModel.hasMany(CarreraModel, { foreignKey: 'id_coordinacion' });
    CarreraModel.belongsTo(CoordinacionModel, { foreignKey: 'id_coordinacion', targetKey: 'id' });


    //una carrera puede tener vairos estudiantes
    // un estudiante solo puede pertenecer a una carrera
    CarreraModel.hasMany(EstudianteModel, { foreignKey: 'id_carrera' });
    EstudianteModel.belongsTo(CarreraModel, { foreignKey: 'id_carrera', targetKey: 'id' });

}   