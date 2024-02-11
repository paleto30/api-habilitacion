import SedeModel from '../models/sede.model.js';
import FacultadModel from '../models/facultad.model.js';
import CoordinacionModel from '../models/coordinacion.model.js';
import CarreraModel from '../models/carrera.model.js';
import EstudianteModel from '../models/estudiante.model.js';
import AdministradorModel from '../models/administrador.model.js';
import PensumModel from '../models/pensum.model.js';
import MateriaModel from '../models/materia.model.js';
import PensumMateriasModel from '../models/pensumMaterias.model.js';
import ProfesorModel from '../models/profesor.model.js';
import HabilitacionModel from '../models/habilitaciones.model.js';
import MateriaProfesorModel from '../models/materiaProfesor.model.js';



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


    // una Coordinacion puede tener varios usuarios administradores
    // un administrador solo puede pertenecer a una coordinacion 
    CoordinacionModel.hasMany(AdministradorModel, { foreignKey: 'id_coordinacion' });
    AdministradorModel.belongsTo(CoordinacionModel, { foreignKey: 'id_coordinacion', targetKey: 'id' });


    // 1 carrera puede tener varios pensum 
    // 1 pensum pertenece a una carrera
    CarreraModel.hasMany(PensumModel, { foreignKey: 'id_carrera' });
    PensumModel.belongsTo(CarreraModel, { foreignKey: 'id_carrera', targetKey: 'id' });


    // relacion uno a muchos entre estudiante habilitaciones
    EstudianteModel.hasMany(HabilitacionModel, { foreignKey: 'id_estudiante' });
    HabilitacionModel.belongsTo(EstudianteModel, { foreignKey: 'id_estudiante', targetKey: 'id' });


    // ralacion uno a muchos entre materia habilitaciones
    MateriaModel.hasMany(HabilitacionModel, { foreignKey: 'id_materia' });
    HabilitacionModel.belongsTo(MateriaModel, { foreignKey: 'id_materia', targetKey: 'id' })
    

    // relacion muchos a muchos entre pensum y materias por medio de la tabla pensumMaterias
    PensumModel.belongsToMany(MateriaModel, { through: PensumMateriasModel, foreignKey: 'id_pensum', targetKey: 'id' });
    MateriaModel.belongsToMany(PensumModel, { through: PensumMateriasModel, foreignKey: 'id_materia', targetKey: 'id' });


    // relacion muchos a muchos entre estudiante y materia , por medio de la tabla de habilitaciones 
    EstudianteModel.belongsToMany(MateriaModel, { through: HabilitacionModel, foreignKey: 'id_estudiante', targetKey: 'id' });
    MateriaModel.belongsToMany(EstudianteModel, { through: HabilitacionModel, foreignKey: 'id_materia', targetKey: 'id' });


    // relacion muchos a muchos entre materia y profesor, por medio de la tabla materiaProfeso
    MateriaModel.belongsToMany(ProfesorModel, { through: MateriaProfesorModel, foreignKey: 'id_materia', targetKey: 'id' });
    ProfesorModel.belongsToMany(MateriaModel, { through: MateriaProfesorModel, foreignKey: 'id_profesor', targetKey: 'id' });


    // relacion uno a muchos entre habilitaciones y profesor
    ProfesorModel.hasMany(HabilitacionModel, { foreignKey: 'id_profesor' })
    HabilitacionModel.belongsTo(ProfesorModel, { foreignKey: 'id_profesor', targetKey: 'id' });

}   