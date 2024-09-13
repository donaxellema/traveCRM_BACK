const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Crear una nueva instancia del cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea el código QR con WhatsApp.');
});

client.on('ready', () => {
    console.log('Cliente de WhatsApp listo.');

    // Enviar un mensaje
    const numero = '593978618791'; // Número en formato internacional
    const mensaje = 'Hola, este es un mensaje de prueba desde Node.js con whatsapp-web.js';

    client.sendMessage(`${numero}@c.us`, mensaje)
        .then(response => {
            console.log('Mensaje enviado con éxito:', response);
        })
        .catch(error => {
            console.error('Error al enviar el mensaje:', error);
        });
});

client.on('error', (error) => {
    console.error('Error en el cliente de WhatsApp:', error);
});

client.initialize();
