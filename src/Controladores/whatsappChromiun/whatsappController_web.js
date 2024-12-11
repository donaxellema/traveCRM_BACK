//const pool = require('../../Database/db');
const pool = require('../../Database/db');

const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const fs = require('fs');
const path = require('path');
//const { addMessage } = require('../fbase_mensajes/mensajes/messagesController.js') 
const { addMessage } = require('../fbase_mensajes/mensajes/messagesController') 

//controladores
const { getEmpresasCRUD } = require('../../Controladores/empresas/empresasController');





let client;

let empresas_data;

const llamarEmpresas = async () => {
    console.log("first******************")
    let respuestaCapturada;

    const req = {
        query: {
            param_tipo: '',
            opcion: 'C',
        },
    };
    const res = {
        status: (statusCode) => ({
            json: (responseBody) => (
                respuestaCapturada={ statusCode, responseBody }
            ),
        }),
    };

    try {
        // Simplemente invocar la función con los mismos req y res
        //await getEmpresasCRUD(req, res);
        await getEmpresasCRUD(req, res);
        empresas_data=respuestaCapturada;
        console.log('Respuesta obtenida::::::::::::::', JSON.stringify(respuestaCapturada.responseBody.data[0].emp_nombre) );
        return respuestaCapturada; // Retorna la respuesta si es necesario

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al llamar a getEmpresasCRUD', details: error.message });
    }
};


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

    // Definir el estado inicial de la conversación
    const conversacion = {
        msg0: null,
        msg0p: null,
        msg1p: null,
        msg1r: null,
        msg2p: null,
        msg2r: null,
        msg3p: null,
        msg3r: null,
        msg4p: null,
        msg4r: null,
    };


    

    // Estado de las conversaciones por número de teléfono
    const conversationState = {};
    let mensajeFinal = '';
    let dataEmp;

    client.on('message', async (msg) => {
        //llamarEmpresas();
        
        
        
        // Diccionario de palabras clave
        const keywords = {
            envio: '👋 ¡Si! realizamos envios a nivel *nacional* ',
            envios: '¡Si! realizamos envios a nivel *nacional* ',
            'buena tarde': '👋 ¡Bienvenido estimado! Soy el bot de soporte de *'+ empresas_data.responseBody.data[0].emp_nombre +'*. ¿En qué puedo ayudarte hoy?',
            'buenas tardes': '👋 ¡Bienvenido estimado! Soy el bot de soporte de *'+ empresas_data.responseBody.data[0].emp_nombre +'*. ¿En qué puedo ayudarte hoy?',
            'buen día': '👋 ¡Bienvenido estimado! Soy el bot de soporte de *'+ empresas_data.responseBody.data[0].emp_nombre +'*. ¿En qué puedo ayudarte hoy?',
            'buenos días': '👋 ¡Bienvenido estimado! Soy el bot de soporte de *'+ empresas_data.responseBody.data[0].emp_nombre +'*. ¿En qué puedo ayudarte hoy?',
            hola: '👋 ¡Bienvenido estimado! Soy el bot de soporte de *'+ empresas_data.responseBody.data[0].emp_nombre +'*. ¿En qué puedo ayudarte hoy?',
            producto: async (msg, userState) => {
                userState.step = 'start';
                conversacion.msg0p='📦 Para brindarte información sobre productos, primero necesitamos que estés registrado.';
                await client.sendMessage(
                    msg.from,
                    '📦 Para brindarte información sobre productos, primero necesitamos que estés registrado.'
                );
                //userState.step = 'asking_name';
            },

            ayuda: 'ℹ️ Estoy aquí para ayudarte. Puedes escribir "hola" para empezar o preguntar por productos.',
        };
        //FIN DE DICCIONARIO


    
        if (msg.type === 'chat') {
            console.log(`Mensaje recibido desde el WhatsApp del cliente ${msg.from}: ${msg.body}`);
            let phoneNumber = msg.from.split('@')[0];
            const obj_messageWhatsapp = {
                number: phoneNumber,
                msg_contenido: msg.body,
                msg_tipo: 'W',
                chat_name: 'Chat desde WhatsApp'
            };

            // Obtener respuesta del sistema
            const opcion = "R_W_CHAT";
            const _limite = 0;
            const _offset = 0;

            const result = await pool.query(
                'SELECT crm_mensajes_v1($1, $2, $3, $4)',
                [obj_messageWhatsapp, opcion, _limite, _offset]
            );

            const respuesta = result.rows[0].crm_mensajes_v1;

            if (respuesta.status === 'ok' && respuesta.code === 200) {
                console.log(respuesta);
                /*INICIO, CODIGO FIREBASE*/ 
                // Usar el chat_id y pers_id_sender de la respuesta
                const chatId = respuesta.chat_id;
                const senderId = respuesta.pers_id_sender;  // Ahora usamos pers_id_sender de la respuesta
                const message = msg.body;  // El contenido del mensaje recibido
                const receiverId = 1;  // El ID del receptor (puedes obtenerlo de la base de datos si es necesario)
                const msg_fchreg = new Date().toISOString();  // Fecha actual en formato ISO

                // Crear el objeto messageData que será enviado a la función addMessage
                const messageData = {
                    message: message,           // Contenido del mensaje
                    senderId: senderId,         // ID del remitente (pers_id_sender de la respuesta)
                    receiverId: receiverId,     // ID del receptor
                    chatId: chatId,             // ID del chat (obtenido de la respuesta)
                    msg_fchreg: msg_fchreg      // Fecha actual
                };

                console.log("messageData")
                console.log(messageData)

                // Llamar a la función addMessage y pasar el objeto messageData
                try {
                    const response = await addMessage({ body: messageData });  // Pasamos messageData como req.body
                    console.log('Mensaje guardado correctamente en Firestore:', response);
                } catch (error) {
                    console.error('Error al guardar el mensaje:', error);
                }
                /*FIN, CODIGO FIREBASE*/ 
            } else if (respuesta.status === 'ok' && respuesta.code === 400) {
                console.log(respuesta)
                console.log(dataEmp)
                const message = "El usuario no se encuentra registrado en el sistema";
                const chatId = `${phoneNumber}@c.us`;
                dataEmp = respuesta.empresa[0];
                //inicio
                
                if (!conversationState[phoneNumber]) {
                    conversationState[phoneNumber] = { step: 'null', data: {} };
                }
                
                const userState = conversationState[phoneNumber];
                console.log(`Estado actual para ${phoneNumber}:`, userState);
                
                const messageLowerCase = msg.body.trim().toLowerCase();  // Limpiar y convertir a minúsculas
                console.log("messageLowerCase")
                console.log(messageLowerCase)
                const matchedKeyword = Object.keys(keywords).find((key) =>
                    messageLowerCase.includes(key)  // Comparar con la versión limpia y en minúsculas
                );
                console.log("matchedKeyword");
                console.log(matchedKeyword);

                
                if (matchedKeyword) {
                    const response = keywords[matchedKeyword];
                
                    // Verificar si la respuesta es una función o texto
                    if (typeof response === 'function') {
                        userState.step = 'start';
                        await response(msg, userState);
                    } else {
                        await client.sendMessage(msg.from, response);
                    }
                } else if(userState.step == 'start' || userState.step == 'asking_name' || userState.step == 'asking_lastname' || userState.step == 'asking_ciudad' || userState.step == 'asking_email' )
                    {
                        
                    }else
                    { 
                    await client.sendMessage(
                        msg.from,
                        '🤔 No entendí tu mensaje. Escribe "hola" para empezar o "ayuda" para más información.'
                    );
                }
                
                // Flujo de preguntas según el estado del usuario
                switch (userState.step) {
                    case 'start': {
                        //conversacion.msg0p = `Bienvenido a ${dataEmp.emp_nombre} \nDirección: ${dataEmp.emp_camp1}\nEn un momento te atenderemos.`;
                        //conversacion.msg1p = 'Ayúdanos con algunos datos para brindarte una mejor experiencia. ¿Cuál es tu nombre?';
                        conversacion.msg1p = '😊 Comencemos con tus datos. Por favor, dime tu *nombre*.';
                
                        //await client.sendMessage(msg.from, conversacion.msg0p);
                        await client.sendMessage(msg.from, conversacion.msg1p);
                        userState.step = 'asking_name';
                        break;
                    }
                
                    case 'asking_name': {
                        userState.data.name = msg.body;
                        conversacion.msg1r=msg.body;
                        conversacion.msg2p = `Gracias ${userState.data.name}, ¿Cuál es tu apellido?`;
                
                        await client.sendMessage(msg.from, conversacion.msg2p);
                        userState.step = 'asking_lastname';
                        break;
                    }
                
                    case 'asking_lastname': {
                        userState.data.lastName = msg.body;
                        conversacion.msg2r=userState.data.lastName;
                        conversacion.msg3p = `Gracias, ${userState.data.name} ${userState.data.lastName}, ¿Desde dónde nos escribes?`;
                
                        await client.sendMessage(msg.from, conversacion.msg3p);
                        userState.step = 'asking_ciudad';
                        break;
                    }
                
                    case 'asking_ciudad': {
                        userState.data.ciudad = msg.body;
                        conversacion.msg3r = userState.data.ciudad;
                        conversacion.msg4p = `Gracias, ${userState.data.name} ${userState.data.lastName}, ¿puedes proporcionarnos tu correo electrónico?`;
                
                        await client.sendMessage(msg.from, conversacion.msg4p);
                        userState.step = 'asking_email';
                        break;
                    }
                
                    case 'asking_email': {
                        const email = msg.body;
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                        if (emailRegex.test(email)) {
                            userState.data.email = email;
                            conversacion.msg4r=userState.data.email;
                            mensajeFinal = `¡Gracias! Hemos recibido la siguiente información:\nNombre: ${userState.data.name} ${userState.data.lastName}\nCiudad: ${userState.data.ciudad}\nEmail: ${userState.data.email}\nEn breve se te asignará un agente.`;
                            await client.sendMessage(msg.from, mensajeFinal);
                
                            // Limpiar el estado del usuario
                            delete conversationState[phoneNumber];
                
                            // Crear y almacenar información en el sistema
                            const personas = {
                                etiq_id: 1,
                                pers_nombres: userState.data.name,
                                pers_apellidos: userState.data.lastName,
                                pers_telefono: phoneNumber,
                                pers_ciudad: userState.data.ciudad,
                                usuario: 'BOT',
                            };
                
                            const new_Obj = {
                                personas,
                                usu_email: userState.data.email,
                                usu_nickname: 'cliente',
                                usuario: 'BOT',
                                etiq_id: 1,
                            };
                
                            const result = await pool.query(
                                'SELECT crm_clientepersona_v1($1, $2, $3, $4)',
                                [new_Obj, "I", _limite, _offset]
                            );
                
                            const respuesta = result.rows[0]?.crm_clientepersona_v1;
                
                            if (respuesta?.status === 'ok' && respuesta.code === 200) {
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

                                    /*INICIO, CODIGO FIREBASE*/ 
                                    // Usar el chat_id y pers_id_sender de la respuesta
                                        const chatId = respuesta.chat_id;
                                        const senderId = respuesta.pers_id_sender;  // Ahora usamos pers_id_sender de la respuesta
                                        const message = msg.body;  // El contenido del mensaje recibido
                                        const receiverId = 1;  // El ID del receptor (puedes obtenerlo de la base de datos si es necesario)
                                        const msg_fchreg = new Date().toISOString();  // Fecha actual en formato ISO

                                        // Crear el objeto messageData que será enviado a la función addMessage
                                        const messageData = {
                                            message: message,           // Contenido del mensaje
                                            senderId: senderId,         // ID del remitente (pers_id_sender de la respuesta)
                                            receiverId: receiverId,     // ID del receptor
                                            chatId: chatId,             // ID del chat (obtenido de la respuesta)
                                            msg_fchreg: msg_fchreg      // Fecha actual
                                        };

                                        console.log("messageData")
                                        console.log(messageData)

                                        // Llamar a la función addMessage y pasar el objeto messageData
                                        try {
                                            const response = await addMessage({ body: messageData });  // Pasamos messageData como req.body
                                            console.log('Mensaje guardado correctamente en Firestore:', response);
                                        } catch (error) {
                                            console.error('Error al guardar el mensaje:', error);
                                        }
                                    /*FIN, CODIGO FIREBASE*/ 
                
                                  } else if (respuestaM.status === 'ok' && respuestaM.code === 400) {
        
                                  }
        
        
        
        
        
                                //res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
                            } else if (respuesta.status === 'ok' && respuesta.code === 400) {
                                
                            }
                        } else {
                            await client.sendMessage(msg.from, 'El correo proporcionado no es válido. Por favor, ingresa un correo electrónico válido.');
                        }
                        break;
                    }
                
                    default:
                        console.log(`Estado no manejado: ${userState.step}`);
                        break;
                }


                //fin
            }
        }
    });

    client.initialize();
};


// Inicializa el cliente en la carga del controlador
llamarEmpresas();
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
            /*INICIO, CODIGO FIREBASE*/ 
               
                /*FIN, CODIGO FIREBASE*/ 

                
            res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });




             // Usar el chat_id y pers_id_sender de la respuesta
             const chatId = respuesta.chat_id;
             const senderId = respuesta.pers_id_sender;  // Ahora usamos pers_id_sender de la respuesta
             const message = msg.body;  // El contenido del mensaje recibido
             const receiverId = 1;  // El ID del receptor (puedes obtenerlo de la base de datos si es necesario)
             const msg_fchreg = new Date().toISOString();  // Fecha actual en formato ISO

             // Crear el objeto messageData que será enviado a la función addMessage
             const messageData = {
                 message: message,           // Contenido del mensaje
                 senderId: senderId,         // ID del remitente (pers_id_sender de la respuesta)
                 receiverId: receiverId,     // ID del receptor
                 chatId: chatId,             // ID del chat (obtenido de la respuesta)
                 msg_fchreg: msg_fchreg      // Fecha actual
             };

             console.log("messageData")
             console.log(messageData)

             // Llamar a la función addMessage y pasar el objeto messageData
             try {
                 const response = await addMessage({ body: messageData });  // Pasamos messageData como req.body
                 console.log('Mensaje guardado correctamente en Firestore:', response);
             } catch (error) {
                 console.error('Error al guardar el mensaje:', error);
             }
             
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
            total: chats.length,
            data:contacts,
        });
    } catch (error) {
        console.error('Error al procesar los contactos:', error);
        res.status(500).json({ error: 'Error al procesar los contactos.' });
    }
};