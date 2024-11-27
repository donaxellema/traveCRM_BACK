//const pool = require('../../Database/db');
const pool = require('../../Database/db');

const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const fs = require('fs');
const path = require('path');


let client;

const initializeClient = () => {
    if (client) return; // Evita la inicialización múltiple

    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: false, // Establece en `false` para ver el navegador
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log('QR Code recibido. Escanea este código QR con tu teléfono.');
        qrcode.generate(qr, { small: true }); // Genera el QR en la consola
    });

    client.on('ready', () => {
        console.log('WhatsApp Web está listo.');
    });

    client.on('auth_failure', (msg) => {
        console.error('Error en la autenticación:', msg);
    });

    client.on('disconnected', () => {
        console.log('Cliente de WhatsApp Web se ha desconectado.');
        client = null; // Permite reiniciar el cliente si se desconecta
    });


    const conversacion={
        msg0:null,
        msg0p:null,
        msg1p:null,
        msg1r:null,
        msg2p:null,
        msg2r:null,
        msg3p:null,
        msg3r:null,
        msg4p:null,
        msg4r:null,
        //msg5p:null,
        //msg5r:null,

    }


    // Evento para recibir mensajes
    const conversationState = {};
    let mensajeFinal='';
    let dataEmp;
    client.on('message', async (msg) => {
        // Verificar si el tipo de mensaje es de texto ('chat')
    if (msg.type === 'chat') {
        //console.log('Mensaje de texto recibido:', message.body);
        // Aquí puedes procesar el mensaje o almacenarlo en la base de datos
        conversacion.msg0=msg.body;
        console.log(msg.body)
        console.log(`Mensaje recibido desde el whatsapp del cliente  ${msg.from}: ${msg.body}`);
        let phoneNumber = msg.from.split('@')[0];
        console.log(phoneNumber)
        const obj_messageWhatsapp={
            //pers_id_sender:pers_id_sender,
            number:phoneNumber,
            msg_contenido:msg.body,
            msg_tipo:'W',
            chat_name:'Chat desde whatsapp'
        } 
        
        //RESPUESTA DEL CHAT
        const opcion="R_W_CHAT";
        const _limite=0;
        const _offset=0;

        
        const result = await pool.query(
            'SELECT crm_mensajes_v1($1, $2, $3, $4)',
            [obj_messageWhatsapp, opcion, _limite, _offset]
          );
          const respuesta = result.rows[0].crm_mensajes_v1;
          console.log("respuesta ++++++++++++++++++++++++++++++++++++++++")
          console.log(respuesta)
          if (respuesta.status === 'ok' && respuesta.code === 200) {
            console.log(respuesta)
            //res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
          } else if (respuesta.status === 'ok' && respuesta.code === 400) {
            
            const message="El usuario no se encuentra registrado en el sistema";
            const chatId = `${phoneNumber}@c.us`;
            console.log(respuesta)
            dataEmp= respuesta.empresa[0]
            //const response = await client.sendMessage(chatId, message);            
            //const userState = conversationState[phoneNumber];
            
            
            if (!conversationState[phoneNumber]) {
                conversationState[phoneNumber] = { step: 'start', data: {} };;
            }
            
            const userState = conversationState[phoneNumber];
            console.log(`Estado actual para ${phoneNumber}:`, userState); // Para verificar el estado del usuario
            
            // Flujo de preguntas según el estado del usuario
            if (userState.step === 'start') {
                //msg0
                conversacion.msg0p='Bienvenido a '+ dataEmp.emp_nombre +' \nDirección: '+ dataEmp.emp_camp1 +' \nen un momento te atenderemos?';
                conversacion.msg1p='Ayudanos con algunos datos para brindarte una mejor experiencia. \n ¿Cuál es tu nombre?';

                await client.sendMessage(msg.from, 'Bienvenido a '+ dataEmp.emp_nombre +' \nDirección: '+ dataEmp.emp_camp1 +' \nen un momento te atenderemos?');
                await client.sendMessage(msg.from, 'Ayudanos con algunos datos para brindarte una mejor experiencia. \n ¿Cuál es tu nombre?');
                userState.step = 'asking_name';  // Actualiza el estado
                console.log(`Nuevo estado para ${phoneNumber}:`, userState); // Para verificar si cambia el estado
            } else if (userState.step === 'asking_name') {
                userState.data.name = msg.body;  // Almacena el nombre proporcionado
                conversacion.msg1r=msg.body;
                conversacion.msg2p= `Gracias ${userState.data.name}, ¿Cuál es tu apellido?`;

                await client.sendMessage(msg.from, `Gracias ${userState.data.name}, ¿Cuál es tu apellido?`);
                userState.step = 'asking_lastname';  // Actualiza el estado
                console.log(`Nuevo estado para ${phoneNumber}:`, userState); // Para verificar si cambia el estado
            } else if (userState.step === 'asking_lastname') {
                userState.data.lastName = msg.body;  // Almacena el apellido proporcionado
                
                conversacion.msg2r=userState.data.lastName;
                conversacion.msg3p= `Gracias, ${userState.data.name} ${userState.data.lastName}, ¿Desde dónde nos escribes?`;

                await client.sendMessage(msg.from, `Gracias, ${userState.data.name} ${userState.data.lastName}, ¿Desde dónde nos escribes?`);
                userState.step = 'asking_ciudad';  // Actualiza el estado
                console.log(`Nuevo estado para ${phoneNumber}:`, userState); // Para verificar si cambia el estado
            } else if (userState.step === 'asking_ciudad') {
                userState.data.ciudad = msg.body;  // Almacena la cédula proporcionada

                conversacion.msg3r= userState.data.ciudad;
                conversacion.msg4p= `Gracias, ${userState.data.name} ${userState.data.lastName}, ¿puedes proporcionarnos tu correo electrónico?`;

                await client.sendMessage(msg.from, `Gracias, ${userState.data.name} ${userState.data.lastName}, ¿puedes proporcionarnos tu correo electrónico?`);
                userState.step = 'asking_email'; 
            } else if (userState.step === 'asking_email') {
                const email = msg.body;

                // Validación del correo electrónico
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    userState.data.email = email;  // Almacena el correo electrónico proporcionado
                    conversacion.msg4r=userState.data.email;

                    mensajeFinal='¡Gracias! Hemos recibido la siguiente información:\nNombre:'+ userState.data.name +' '+ userState.data.lastName+'\nCiudad: '+ userState.data.ciudad +'\nEmail: '+userState.data.email +'\nEn breve se te asignara un agente  ';
                    await client.sendMessage(msg.from, `¡Gracias! Hemos recibido la siguiente información:\nNombre: ${userState.data.name} ${userState.data.lastName}\nCiudad: ${userState.data.ciudad}\nEmail: ${userState.data.email} '\nEn breve se te asignara un agente `);
                    //await client.sendMessage(msg.from, mensajeFinal);
                    
                    // Aquí puedes almacenar la información en la base de datos o procesarla de alguna manera
                    //console.log(`Usuario: ${userState.data.name} ${userState.data.lastName}, Ciudad: ${userState.data.ciudad}, Email: ${userState.data.email}`);
                    
                    // Reiniciar el estado de la conversación
                    delete conversationState[phoneNumber];
                    console.log(`Estado eliminado para ${phoneNumber}.`);

                    //AQUI SE AGREGA EL PROCESO DE INGRESAR O LLAMAR AL API DE                     
                    //OBJETO DE PERSONA PARA EL INGRESO DENTRO DEL SISTEMA
                    const personas={
                        etiq_id:1,
                        pers_nombres:userState.data.name,
                        pers_apellidos:userState.data.lastName,
                        pers_telefono:phoneNumber,                        
                        pers_ciudad:userState.data.ciudad,
                        usuario:'BOT'
                    }
                    console.log("objeto persona");
                    console.log(personas);
                    
                    const new_Obj={
                        personas:personas,
                        usu_email:userState.data.email,
                        usu_nickname:'cliente',
                        usu_password1:null,
                        usu_password2:null,
                        usu_imagen:null,
                        usuario:'BOT',
                        etiq_id:1,
                    }

                    const result = await pool.query(
                        'SELECT crm_clientepersona_v1($1, $2, $3, $4)',
                        [new_Obj, "I", _limite, _offset]
                      );
                    

                    const respuesta = result.rows[0].crm_clientepersona_v1;
                    if (respuesta.status === 'ok' && respuesta.code === 200) {
                        console.log(respuesta)

                        // SE HACE REGISTRO DE UN NUEVO CHAT
                        const obj_messageWhatsappBOT={
                            //pers_id_sender:pers_id_sender,
                            pers_id_sender:48, //ID DEL BOT 
                            number:phoneNumber,
                            conversacionInicial:conversacion,
                            msg_contenido:mensajeFinal,
                            msg_tipo:'W',
                            chat_name:'Chat desde whatsapp'
                        } 
                        
                        //RESPUESTA DEL CHAT
                        const opcionM="I_W_CHAT";
                        const _limite=0;
                        const _offset=0;
                        
                        const resultM = await pool.query(
                            'SELECT crm_mensajes_v1($1, $2, $3, $4)',
                            [obj_messageWhatsappBOT, opcionM, _limite, _offset]
                          );
                          const respuestaM = resultM.rows[0].crm_mensajes_v1;
                          console.log(respuestaM);
                          if (respuestaM.status === 'ok' && respuestaM.code === 200) {
                            console.log(respuestaM)
                            //res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
                          } else if (respuestaM.status === 'ok' && respuestaM.code === 400) {

                          }





                        //res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
                    } else if (respuesta.status === 'ok' && respuesta.code === 400) {
                        
                    }




                } else {
                    // Si el email no es válido, enviar un mensaje y esperar a que el usuario lo ingrese nuevamente
                    await client.sendMessage(msg.from, 'El correo proporcionado no es válido. Por favor, ingresa un correo electrónico válido.');
                }



            }


          } else {
            console.log(respuesta)
            //res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
          }

         // SE DEBE CONTROLAR CUANDO NO ES UN NUMERO REGISTRADO
          console.log(respuesta)  

    } else if (msg.type === 'ptt') {
        //console.log('Nota de voz recibida, ignorando...');
        await client.sendMessage(msg.from, `No se puede aceptar este tipo de mensaje, Nota de voz recibida, ignorando... `);

        // Puedes hacer algo aquí si es una nota de voz, como notificar al usuario
    } else {
        //console.log('Otro tipo de mensaje recibido:', message.type);
        await client.sendMessage(msg.from, `No se puede aceptar este tipo de mensaje, ignorando... `);
        
    }

    
        
    });



    client.initialize();
};

// Inicializa el cliente en la carga del controlador
initializeClient();

exports.sendMessage = async (req, res) => {
    console.log("req");
    //console.log(req);
    const { pers_id_sender,number, message, media } = req.body;

    try {
        const chatId = `${number}@c.us`;
        console.log(media);
        if(media == null){ 
            const response = await client.sendMessage(chatId, message);
            console.log(response);
            
         }else{
            //esta opcion es para poder ingresar la ruta de la imagen con localhost
            const mediaUrl = `http://localhost:3000/${media}`;
            const responseImage = await fetch(mediaUrl);
            console.log(responseImage)
            if (!responseImage.ok) {
                throw new Error(`Error al descargar la imagen: ${responseImage.statusText}`);
            }

            const arrayBuffer = await responseImage.arrayBuffer();

            const imageBuffer = Buffer.from(arrayBuffer);
            const mediaSrc = new MessageMedia('image/jpeg', imageBuffer.toString('base64'));
            
            const response = await client.sendMessage(chatId, mediaSrc, { caption: message });
            console.log(response);
        } 

        
        console.log(`Mensaje enviado a en  la que si usaaaa ${number}: ${message}`);

        /* res.status(200).json({
            success: true,
            message: `Mensaje enviado a ${number}`,
            response
        }); */
        const obj_messageWhatsapp={
            pers_id_sender:pers_id_sender,
            number:number,
            msg_contenido:message,
            msg_tipo:'W',
            chat_name:'Chat desde whatsapp'
        }  
        const opcion="I_W_CHAT";
        const _limite=0;
        const _offset=0;

        console.log("obj_messageWhatsapp");
        console.log(obj_messageWhatsapp);

        const result = await pool.query(
            'SELECT crm_mensajes_v1($1, $2, $3, $4)',
            [obj_messageWhatsapp, opcion, _limite, _offset]
          );
          const respuesta = result.rows[0].crm_mensajes_v1;
          if (respuesta.status === 'ok' && respuesta.code === 200) {
            console.log(respuesta)
            res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
          } else {
            console.log(respuesta)
            res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
          }
          

    } catch (error) {
        console.error(`Error al enviar el mensaje: ${error}`);
        /* res.status(500).json({
            success: false,
            error: `Error al enviar el mensaje: ${error.message}`
        }); */
    }
};


// Obtener contactos
/* exports.getContacts = async (req, res) => {
    if (!client) {
        initializeClient();
        await new Promise((resolve) => client.on('ready', resolve));
    }

    const chats = await client.getChats();
    const contacts = chats.filter((chat) => !chat.isGroup).map((contact) => ({
        name: contact.name || 'Sin nombre',
        number: contact.id._serialized.split('@')[0]
    }));

    res.status(200).json({ contacts });
}; */

/*
exports.getContacts = async (req, res) => {
    try {
        if (!client) {
            console.log('Inicializando cliente de WhatsApp...');
            initializeClient();
            // Esperar hasta que el cliente esté completamente listo
            await new Promise(resolve => client.on('ready', resolve));
        }

        console.log('Cliente conectado, obteniendo chats...');
        const chats = await client.getChats();

        console.log(`Número de chats encontrados: ${chats.length}`);

        // Filtra los chats para obtener solo los contactos (excluye grupos)
        const contacts = chats.filter(chat => !chat.isGroup);
        console.log(contacts);

        res.status(200).json({
            contacts: contacts.map(contact => ({
                //image: (client.getProfilePicUrl(contact.id._serialized)),
                name: contact.name || 'Sin nombre',
                number: contact.id._serialized
            }))
        });
    } catch (error) {
        console.error('Error al obtener la lista de contactos:', error);
        res.status(500).json({ error: 'Error al obtener la lista de contactos.' });
    }
};*/



/*
exports.getContacts = async (req, res) => {
    try {
        if (!client) {
            console.log('Inicializando cliente de WhatsApp...');
            initializeClient();
            await new Promise(resolve => client.on('ready', resolve)); // Esperar a que esté listo
        }

        console.log('Cliente conectado, obteniendo chats...');
        const chats = await client.getChats();

        console.log(`Número de chats encontrados: ${chats.length}`);

        // Filtra los chats para obtener solo los contactos (excluye grupos)
        const contacts = chats.filter(chat => !chat.isGroup);

        // Inserta los contactos en la base de datos
        const promises = contacts.map(async (contact) => {
            const name = contact.name || 'Sin nombre';
            const number = contact.id.user;

            try {
                // Inserta contacto si no existe
                await pool.query(
                    `INSERT INTO whatsapp_contacts (name, number)
                     VALUES ($1, $2)
                     ON CONFLICT (number) DO NOTHING`,
                    [name, number]
                );
            } catch (err) {
                console.error(`Error al insertar el contacto ${name} (${number}):`, err);
            }
        });

        await Promise.all(promises);

        console.log('Contactos almacenados en la base de datos.');

        res.status(200).json({
            message: 'Contactos almacenados correctamente.',
            contacts: contacts.map(contact => ({
                name: contact.name || 'Sin nombre',
                number: contact.id.user,
            })),
        });
    } catch (error) {
        console.error('Error al obtener y almacenar la lista de contactos:', error);
        res.status(500).json({ error: 'Error al obtener y almacenar la lista de contactos.' });
    }
};
*/

/*
exports.getContacts = async (req, res) => {
    try {
        if (!client) {
            console.log('Inicializando cliente de WhatsApp...');
            initializeClient();
            await new Promise(resolve => client.on('ready', resolve)); // Esperar a que esté listo
        }

        console.log('Cliente conectado, obteniendo chats...');
        const chats = await client.getChats();

        console.log(`Número total de chats encontrados: ${chats.length}`);

        // Filtrar solo contactos, excluyendo grupos
        const contacts = chats.filter(chat => !chat.isGroup && chat.id.server === 'c.us');

        console.log(`Número de contactos encontrados: ${contacts.length}`);

        // Procesar e insertar contactos en la base de datos
        const promises = contacts.map(async (contact) => {
            const name = contact.name || 'Sin nombre';
            const number = contact.id.user; // Obtener el número del contacto
            const etiqueta = 'Contacto de WhatsApp'; // Etiqueta predeterminada

            try {
                await pool.query(
                    `INSERT INTO crm_whatsapp_contacts (
                        contact_name, contact_etiqueta, contact_number
                    ) VALUES ($1, $2, $3)
                    ON CONFLICT (contact_number) DO NOTHING`,
                    [name, etiqueta, number]
                );
            } catch (err) {
                console.error(`Error al insertar el contacto ${name} (${number}):`, err);
            }
        });

        // Esperar a que todos los contactos se procesen
        await Promise.all(promises);

        console.log('Contactos almacenados en la base de datos.');

        // Responder con los contactos procesados
        res.status(200).json({
            message: 'Contactos procesados correctamente.',
            contacts: contacts.map(contact => ({
                name: contact.name || 'Sin nombre',
                number: contact.id.user,
            })),
        });
    } catch (error) {
        console.error('Error al obtener y almacenar la lista de contactos:', error);
        res.status(500).json({ error: 'Error al obtener y almacenar la lista de contactos.' });
    }
};*/



exports.getContacts = async (req, res) => {
    try {
        if (!client) {
            console.log('Inicializando cliente de WhatsApp...');
            initializeClient();
            await new Promise(resolve => client.on('ready', resolve));
        }

        console.log('Cliente conectado, obteniendo chats...');
        const chats = await client.getChats();

        console.log(`Número total de chats encontrados: ${chats.length}`);

        // Filtrar solo contactos personales (no grupos)
        const contacts = chats
            .filter(chat => !chat.isGroup && chat.id.server === 'c.us')
            .map(contact => ({
                name: contact.name || 'Sin nombre',
                number: contact.id.user,
                etiqueta: 'Contacto de WhatsApp',
            }));

        console.log(`Número de contactos personales encontrados: ${contacts.length}`);

        // Llamar al procedimiento almacenado
        const contactsJson = JSON.stringify(contacts);
        await pool.query('SELECT crm_contacts_from_whatsapp($1)', [contactsJson]);

        console.log('Contactos almacenados exitosamente.');

        res.status(200).json({
            code: 200,
            message: 'Contactos procesados y almacenados correctamente.',
            //contacts,
        });
    } catch (error) {
        console.error('Error al procesar los contactos:', error);
        res.status(500).json({ error: 'Error al procesar los contactos.' });
    }
};