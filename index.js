require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { startDynamicCron } = require('./src/Controladores/botAsigna/botasignaController');

//const dotenv = require('dotenv');

//const userRoutes = require('./src/Routes/userRoutes');
const chatBot = require("./src/Routes/chatBotRoutes");
const authRoutes = require('./src/Routes/authRoutes');
const personRoutes = require('./src/Routes/personRoutes'); 
const parametrosTiwilo = require('./src/Routes/paramTiwiloRoutes'); 
const parametrosTiempos = require('./src/Routes/paramTiemposRoutes'); 
const empresa = require('./src/Routes/empresaRoutes'); 
const etiquetas = require('./src/Routes/etiquetasRoutes'); 
const agentes = require('./src/Routes/agentesRoutes'); 
const clientes = require('./src/Routes/clientesRoutes'); 
const subirImagen = require('./src/Routes/subirImagenRoute'); 
const subirImagenBanner = require('./src/Routes/subirImagenRoute'); 
const campanias = require('./src/Routes/campaniasRoutes'); 
const perfil = require('./src/Routes/perfilRoutes'); 
const chats = require('./src/Routes/chatsRoutes'); 
const dashboard = require('./src/Routes/dashboardRoutes'); 


const whatsapp = require('./src/Routes/whatsappRoutes'); 


const cronRoutes = require('./src/Routes/robot.Routes');


const userRoutes = require('./src/Routes/FB_userRoutes');
//CARGA de archivos EXCEL
const campaMasivaRoutes = require('./src/Routes/campaMasivaRoutes');

//dotenv.config();  // Esto carga el archivo .env
// Definir el puerto en el que el servidor escuchará
const port = 3000;


const options = {
    cors: {
        //origin: "http://localhost:4200",
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ['Content-Type', 'Authorization']
        //methods: "POST",
    },
};
app.use(cors(options));


// Definir una ruta para la URL raíz
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use('/api', personRoutes);
app.use('/api', parametrosTiwilo);
app.use('/api', parametrosTiempos);
app.use('/api', empresa);
app.use('/api', etiquetas);
app.use('/api', agentes);
app.use('/api', clientes);
app.use('/api', campanias);
app.use('/api', perfil);
app.use('/api', dashboard);

app.use('/api', chats);

app.use(express.static('uploads')); 
app.use('/api', subirImagen);
app.use('/api', subirImagenBanner);


app.use('/api', whatsapp);
app.use('/api', chatBot);


app.use('/api', cronRoutes);
app.use('/api', campaMasivaRoutes);

/* app.use('/api/personas',(req, res) => {
  res.send('¡Hola, mundo!');
}); */
//app.use('/api', userRoutes);


//RUTAS CON FIREBASE
app.use('/api', userRoutes);


// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port,async  () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);


    // Llamar a la función para iniciar el cron automáticamente
    const currentCronJob = await startDynamicCron();
    if (currentCronJob) {
        console.log('Cron job started automatically on server startup');
    } else {
        console.error('Failed to start cron job automatically');
    }
});
