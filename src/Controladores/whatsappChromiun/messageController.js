// controllers/messageController.js
//const db = require('../database/db');
const whatsappService = require('./puppeteerService');

exports.sendMessage = async (req, res) => {
  const { phone, message } = req.body;

  try {
    // Enviar el mensaje usando Puppeteer
    await whatsappService.sendMessage(phone, message);

    // Guardar el mensaje en la base de datos
    //const queryText = 'INSERT INTO messages(phone, message) VALUES($1, $2) RETURNING *';
    //const result = await db.query(queryText, [phone, message]);

    // Responder con éxito
    res.status(200).json({
      success: true,
      message: 'Mensaje enviado y guardado en la base de datos.',
      //data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje.',
      error: error.message,
    });
  }
};


/* 
exports.sendMessage = async (phone, message) => {
  try {
    await startBrowser();

    // Buscar el contacto a través de la barra de búsqueda
    const searchBoxSelector = 'div[contenteditable="true"][data-tab="3"]';
    await page.waitForSelector(searchBoxSelector);
    await page.click(searchBoxSelector);
    await page.type(searchBoxSelector, phone);

    // Esperar a que aparezcan los resultados y seleccionar el primer resultado
    const firstChatSelector = 'div._3m_Xw'; // Este selector puede cambiar, debes inspeccionar en WhatsApp Web
    await page.waitForSelector(firstChatSelector, { timeout: 10000 }); // Aumentar el timeout
    await page.click(firstChatSelector);

    // Esperar a que el chat esté listo para enviar el mensaje
    const messageBoxSelector = 'div[contenteditable="true"]';
    await page.waitForSelector(messageBoxSelector, { timeout: 20000 }); // Aumentar el timeout
    await page.type(messageBoxSelector, message);
    await page.keyboard.press('Enter');
    console.log('Mensaje enviado.');

    return true;
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    throw error;
  }
}; */

exports.logout = async (req, res) => {
  try {
    await whatsappService.closeBrowser();
    res.status(200).json({ success: true, message: 'Sesión cerrada correctamente.' });
  } catch (error) {
    console.error('Error al cerrar la sesión:', error.message);
    res.status(500).json({ success: false, message: 'Error al cerrar la sesión.', error: error.message });
  }
};
