const puppeteerService = require('./puppeteerService');

exports.sendMessage = async (req, res) => {
  const { phone, message } = req.body;

  try {
    // Aquí invocas al servicio de Puppeteer para enviar el mensaje
    const result = await puppeteerService.sendMessage(phone, message);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.logout = async (req, res) => {
    try {
      // Llama al servicio para cerrar el navegador
      await puppeteerService.closeBrowser();
      res.status(200).json({ success: true, message: 'Sesión de WhatsApp cerrada.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al cerrar sesión.', error: error.message });
    }
  };