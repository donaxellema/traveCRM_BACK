const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;

// Inicializa el cliente de WhatsApp
const initializeClient = () => {
    if (client) return; // Evita la inicialización múltiple

    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', async () => {
        console.log('Cliente de WhatsApp Web está listo.');
    });

    client.on('auth_failure', (msg) => {
        console.error('Error en la autenticación:', msg);
    });

    client.initialize();
};

// Obtiene la lista de contactos
const getContacts = async (req, res) => {
    try {
        if (!client) {
            initializeClient();
            return res.status(500).json({ error: 'El cliente de WhatsApp aún no está listo.' });
        }

        // Espera a que el cliente esté listo
        await client.waitForConnected();

        // Obtén la lista de chats
        const chats = await client.getChats();

        // Filtra los chats para obtener solo los contactos (excluye grupos)
        const contacts = chats.filter(chat => !chat.isGroup);

        // Devuelve los contactos como respuesta
        res.status(200).json({
            contacts: contacts.map(contact => ({
                name: contact.name,
                number: contact.id._serialized
            }))
        });
    } catch (error) {
        console.error('Error al obtener la lista de contactos:', error);
        res.status(500).json({ error: 'Error al obtener la lista de contactos.' });
    }
};

module.exports = {
    getContacts,
};