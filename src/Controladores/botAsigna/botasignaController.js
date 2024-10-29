const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../Middleware/authentication')
const cron = require('node-cron');  // No olvides instalar 'node-cron'


const whatsappController = require('../whatsappChromiun/whatsappController_web');


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//FUNCION PARA EXTRAER EL TIEMPO QUE ESTA EN BASE DE DATOS PARA LA EJECUCION DEL CRON

    async function getTiempos ()  {
    const obj = 
    {
        param_tipo:'Tiempo'
    }

    const opcion="CP";
    const _limite=0;
    const _offset=0; 
    try {
        const result = await pool.query(
            'SELECT crm_parametros_v1($1, $2, $3, $4)',
            [obj, opcion, _limite, _offset]
        );
      const respuesta = result.rows[0].crm_parametros_v1;
      console.log(respuesta)
      return respuesta.data.accountsid;
    } catch (error) {
        console.error('Error fetching cron time from DB:', err);
        return null;
    }
  
  };


  


  //ESTA FUNCION ACTUALIZARA LA ASIGNACION DEL BOT A UN AGENTE DISPONIBLE
  //const updateAsignaAgente = async (req, res) => {
    async function updateAsignaAgente() {
        const obj = 
        {
            data:''
        }

        const opcion="R_A";
        const _limite=0;
        const _offset=0;

        try {
        const result = await pool.query(
            'SELECT crm_agentepersona_v1($1, $2, $3, $4)',
            [obj, opcion, _limite, _offset]
        );
        const respuesta = result.rows[0].crm_agentepersona_v1;
            console.log(respuesta)
            if(respuesta.code==200 && respuesta.asignado==true){
                const phoneNumber = respuesta.data_pers[0].pers_telefono;
                const message = "¡Se te ha asignado un agente!";

                const sendMessageReq = {
                    body: {
                        pers_id_sender: respuesta.persona_sender, // o el ID del agente que estás manejando
                        number: phoneNumber,
                        message: message
                    }
                };


                try {
                    await delay(5000);
                    // Llama a la función sendMessage desde el controlador de WhatsApp
                    await whatsappController.sendMessage(sendMessageReq);
                    console.log("Mensaje enviado con éxito a " + phoneNumber);
                } catch (error) {
                    console.error('Error al enviar el mensaje de WhatsApp:', error);
                }

            }
        } catch (error) {
        console.error('Error updating data in DB:', err);
        }
    };
  
  
  // Función que reinicia el cron según el tiempo extraído de la base de datos
    async function startDynamicCron() {
        // Extrae el tiempo de la base de datos
        const cronTime = await getTiempos();
        console.log("cronTime")
        console.log(cronTime)
        if (cronTime) {
            console.log(`Starting cron job with time: ${cronTime}`);
            const cronTimeListo= `*/${cronTime} * * * *`; 
            console.log(cronTimeListo)
            // Configura el cron job con el tiempo extraído
            cron.schedule(cronTimeListo, async () => {
                console.log('Cron job running...');
                await updateAsignaAgente();  // Actualiza datos cuando se ejecuta el cron
            });
        } else {
            console.error('Invalid cron time. Could not start the cron job.');
        }
    };


/* // Iniciar el cron dinámico
startDynamicCron(); */

// Cerrar la conexión cuando el proceso termine
/* process.on('exit', () => {
    client.end();
}); */


  module.exports = {
    getTiempos,
    updateAsignaAgente,
    startDynamicCron
  };
  