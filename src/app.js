import express from 'express';
import cors from 'cors'
import config from './config/config.js';
import routes from './routes/zindex.js';
import db from './db/conexion.js';
import { createRelationship } from './db/ralationship.js';






// asignamos express a la constante app
const app = express();


// decimos que use algunos middlewares
app.use(express.json());

// configuracion de cors
app.use(cors());



// -> hook db_proccess
(async () => {
    try {

        // llamamos las respectivas relaciones
        createRelationship()
        // autenticamos y sincronizamos la base de datos
        await db.authenticate();
        await db.sync();

        console.log(`[ --- CONEXION ESTABLECIDA CON LA BASE DE DATOS ${config.database} --- ]`);

    } catch (error) {
        console.log(`Error en db_proccess hook: ${error.message}`);
    }
})();



// ruta principal 
app.use('/api/v1', routes)






// ponemos el puerto a la app y hacemos uso de la funcion listen 
const port = config.port || 5500;

app.listen(port, () => {
    console.log(`server running on port ${port}:   http://localhost:5500/`);
})