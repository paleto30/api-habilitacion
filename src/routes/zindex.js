import { Router } from "express";
import fs from 'fs/promises';  // se importa con promesas para poder usar async/await
import { dirname } from "path"; 
import { fileURLToPath } from "url";





// Router de express
const router = Router();


// obtenemos la ruta actual de este archivo:  zindex,js
const __filename = fileURLToPath(import.meta.url);
// directorio actual 
const __dirname = dirname(__filename);

// esta constante almacena la ruta donde estaran todos los archivos de ruta
const PATH_ROUTES = __dirname;

// funcion para limpiar el nombre del archivo
const cleanFileName = (fileName) =>{
    const clean = fileName.split('.').shift();
    return clean; // -nombre del archivo de rutas sin el .js
} 


// funcion para cargar las rutas 
const loaderRoutes = async () =>{
    try {
        const files = await fs.readdir(PATH_ROUTES);
        for(const fileName of files){
            const prefixRoute =  cleanFileName(fileName); // esto le quita el .js a todos los archivos dentro de la carpeta routes
            if (prefixRoute !== 'zindex' && fileName.endsWith('.js')) {
                console.log(`Cargando la ruta... ${prefixRoute}`);
                const routeModule = await import(`./${prefixRoute}.js`);  // importamos el archivo correspondiente
                router.use(`/${prefixRoute}`, routeModule.default); // le decimos al router que use la ruta indicada
            }
        }
    } catch (error) {
        console.error(`Error al cargar rutas: ${error}`);
    }
};


loaderRoutes(); 


export default router;