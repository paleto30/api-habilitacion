import multer from "multer";




// definimos el storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './storage/loaded')
    },

    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`);
    }
});

// creamos un filtro para los archivos que se cargan 
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
        cb(null, true); // aceptamos el archivo
    } else {
        cb(new Error(`El archivo no tiene una extension permitida.`), false);
    }
}


// instanciamos multer 
const upload = multer({ storage, fileFilter });


// creamos el middleware para cargar los archivos en los campos correspondientes
export const middlewareUpload = upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'imagen', maxCount: 1 }]);



export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // error relacionado con multer
        res.status(400).json({ status: false, error: `Error en la carga de archivos: ${err.message}` })
    } else if (err) {
        res.status(400).json({ status: false, error: `Error en la carga de archivos: ${err.message}` })
    } else {
        next();
    }
}