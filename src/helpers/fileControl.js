import fs from 'fs'
import path from 'path';



// handler delete files 
const deleteFilesOfDirLoaded = (location_path) => {
    try {
        if (fs.existsSync(location_path)) { // retorna true si encuentra el path 
            fs.unlinkSync(location_path);
            console.log(`The file [ ${location_path} ] -> WAS_DELETED.`);
        } else {
            console.log(`The file [ ${location_path} ] -> WAS_NOT_FOUND.`);
        }
    } catch (error) {
        throw new Error('No se eliminaron los archivos del servidor.')
    }
}


// handler para mover a la ruta especifica si el archivo es valido 
const relocateTheFile = (originFolder, destinationFolder) => {
    const originPath = path.resolve(originFolder);
    const destinationPath = path.resolve(destinationFolder);
    fs.rename(originPath, destinationPath, (error) => {
        if (error) {
            console.log(" <<- Error al trasladar el archivo.");
        } else {
            console.log(" ->> Traslado exitoso del archivo.");
        }
    });
}



// handler search files
const findFileInFolderAndReturnPath = (folderPath, filename) => {
    const filePath = path.resolve(folderPath, filename);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return filePath;
}




// validate keys in files object
const validateFilesObjectKeys = (files) => {
    const extImgAvailable = ['png', 'jpeg', 'jpg'];
    const mimeImgAvailable = ['image/png', 'image/jpeg', 'image/jpg'];

    // si el objeto esta vacio
    if (Object.keys(files).length === 0) return false;

    // si el objeto trae mas de dos llaves
    if (Object.keys(files).length !== 2) return false;

    // si el objeto trae llaves diferentes a pdf o imagen 
    if (!('pdf' in files && 'imagen' in files)) return false;

    const pdf = files.pdf[0];
    const imagen = files.imagen[0];

    let imgExt = imagen.filename.split('.').pop();
    let imgMime = imagen.mimetype;

    // si llave pdf en realidad trae un pdf u otro tipo de archivo
    if (!(pdf.filename.endsWith('.pdf') && pdf.mimetype === 'application/pdf')) return false;

    // si la llave img en realidad trae un archivo de tipo imagen  
    if (!(extImgAvailable.includes(imgExt) && mimeImgAvailable.includes(imgMime))) return false;


    return true;
}



// eliminar los archivos 
const removeAllFilesOfDirLoaded = (files) => {
    for (const key in files) {
        deleteFilesOfDirLoaded(files[key][0].path);
    }
}




export default {
    deleteFilesOfDirLoaded,
    findFileInFolderAndReturnPath,
    validateFilesObjectKeys,
    removeAllFilesOfDirLoaded,
    relocateTheFile
}