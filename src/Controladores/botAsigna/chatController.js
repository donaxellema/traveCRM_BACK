require('dotenv').config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const askChatGPT = async (question) => {
  const contextMessage = "Responde solo sobre carnes y cárnicos, como carne de res, cerdo, pollo y embutidos.";

  try {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto("https://chat.openai.com/");

    // Espera y clic en el botón de "Iniciar sesión"
    await page.waitForSelector('button[data-testid="login-button"]');
    await page.evaluate(() => {
      document.querySelector('button[data-testid="login-button"]').scrollIntoView();
    });
    await page.click('button[data-testid="login-button"]');

    // Espera a que el campo de email esté presente
    await page.waitForSelector('input[name="email"]', { visible: true });
    await page.type('input[name="email"]', process.env.OPENAI_EMAIL);

    // Espera a que el campo de password esté presente
    await page.waitForSelector('input[name="password"]', { visible: true });
    await page.type('input[name="password"]', process.env.OPENAI_PASSWORD);

    // Envía el formulario de inicio de sesión
    await page.click('button[type="submit"]');

    // Espera a que la página se recargue después de iniciar sesión
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // Ahora que estás logueado, espera que el área de entrada esté disponible y envía la pregunta
    await page.waitForSelector("textarea");
    await page.type("textarea", `${contextMessage} ${question}`);
    await page.keyboard.press("Enter");

    // Espera a que la respuesta de ChatGPT aparezca en la pantalla
    await page.waitForSelector(".message");

    // Extrae el texto de la respuesta de manera segura
    const answer = await page.evaluate(() => {
      const messages = document.querySelectorAll(".message");

      // Verifica que haya mensajes antes de intentar acceder a ellos
      if (messages.length === 0) {
        throw new Error("No se encontraron mensajes en la conversación.");
      }

      // Verifica que el texto sea válido y accesible
      const lastMessage = messages[messages.length - 1].innerText;
      if (!lastMessage) {
        throw new Error("No se pudo obtener el texto del mensaje.");
      }

      return lastMessage.toString();
    });

    await browser.close();
    return answer;
  } catch (error) {
    console.error("Error connecting to ChatGPT:", error.message);
    throw new Error("Error al conectarse a ChatGPT");
  }
};

module.exports = { askChatGPT };
