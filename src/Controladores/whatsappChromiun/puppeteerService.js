const puppeteer = require('puppeteer');

let browser, page;

/* const startBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');
    console.log('Escanea el código QR para iniciar sesión.');
  }
}; */

const startBrowser = async () => {
    /* if (!browser) {
      browser = await puppeteer.launch({ headless: false });
      page = await browser.newPage();
      await page.goto('https://web.whatsapp.com');
      console.log('Escanea el código QR para iniciar sesión en WhatsApp.');
      console.log(JSON.stringify (page.goto))
      //await page.waitForSelector('._3LX7r', { timeout: 60000 });
      //await page.waitForSelector(`span[title='${ContactName}']`, { timeout: 10000 }); // Aumenta el tiempo a 10 segundos
      
      const contact = await page.waitForSelector("span[title='ContactName']");
      console.log("Mi contacto");
      console.log(contact);
      await contact.click();


      console.log('Sesión de WhatsApp iniciada.');
    } */



      if (!browser) {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
        await page.goto('https://web.whatsapp.com');
        console.log('Escanea el código QR para iniciar sesión en WhatsApp.');

        // Espera hasta que la sesión esté lista
        await page.waitForSelector('._3LX7r', { timeout: 40000 });
        console.log('Sesión de WhatsApp iniciada.');

        // Búsqueda del contacto
        //const contactName = 'Alex Lema Tuenti';  // Aquí asegúrate de usar el formato correcto
        //console.log(`Buscando el contacto: ${contactName}`);

        // Esperar el cuadro de búsqueda
        const searchBoxSelector = 'div[contenteditable="true"][data-tab="3"]';
        await page.waitForSelector(searchBoxSelector);
        const searchBox = await page.$(searchBoxSelector);
        await searchBox.type(contactName);

        // Aumentar el timeout a 10 segundos
        try {
            const contactSelector = `span[title='${contactName}']`;
            console.log(`Buscando selector: ${contactSelector}`);
            await page.waitForSelector(contactSelector, { timeout: 10000 });

            const contact = await page.$(contactSelector);
            if (contact) {
                console.log("Contacto encontrado, haciendo clic...");
                await contact.click();

                // Enviar el mensaje
                const inputBoxSelector = 'div[contenteditable="true"][data-tab="6"]';
                await page.waitForSelector(inputBoxSelector, { timeout: 10000 });
                const inputBox = await page.$(inputBoxSelector);
                const message = 'Hola, este es un mensaje de prueba';
                await inputBox.type(message);
                await page.keyboard.press('Enter');
                console.log("Mensaje enviado.");
            } else {
                console.log("El contacto no fue encontrado.");
            }
        } catch (error) {
            console.error(`Error al enviar el mensaje: ${error.message}`);
        }

        // Cerrar el navegador cuando termines (opcional)
        // await browser.close();
    }

    
  };


/* 
// Servicio para enviar un mensaje usando WhatsApp Web
exports.sendMessage = async (phone, message) => {
  await startBrowser();

  // Espera hasta que WhatsApp Web esté listo y la sesión haya iniciado
  await page.waitForSelector('._3LX7r'); // Un selector de la página ya cargada

  // Busca el contacto por número de teléfono
  await page.click(`span[title='${phone}']`);
  
  // Escribir y enviar el mensaje
  const messageBoxSelector = 'div[contenteditable="true"]';
  await page.waitForSelector(messageBoxSelector);
  await page.type(messageBoxSelector, message);
  await page.keyboard.press('Enter');

  return { phone, message };
};



exports.logout = async () => {
    if (browser) {
      await page.evaluate(() => {
        // Cierra sesión desde la interfaz de WhatsApp Web si es necesario
        const logoutButton = document.querySelector('div[data-testid="menu"]');
        if (logoutButton) {
          logoutButton.click();
          const logoutMenuItem = document.querySelector('span[data-testid="logout"]');
          if (logoutMenuItem) {
            logoutMenuItem.click();
          }
        }
      });
  
      // Cierra el navegador de Puppeteer
      await browser.close();
      browser = null;
      page = null;
    }
  }; */



  /* const sendMessage = async (phone, message) => {
    try {
      await startBrowser();
  
      console.log(`Buscando el contacto: ${phone}`);
      await page.click(`span[title='${phone}']`);
      await page.waitForSelector('._2aBzC', { timeout: 5000 });
  
      const messageBoxSelector = 'div[contenteditable="true"]';
      await page.waitForSelector(messageBoxSelector);
      await page.type(messageBoxSelector, message);
      await page.keyboard.press('Enter');
      console.log('Mensaje enviado.');
  
      return true;
    } catch (error) {
      console.error('Error al enviar el mensaje:', error.message);
      throw error;
    }
  }; */


  


  const sendMessage = async (phone, message) => {
    try {
      await startBrowser();
  
      // Abrir la barra de búsqueda y escribir el número de teléfono
      const searchBoxSelector = 'div[contenteditable="true"][data-tab="3"]';
      const respuestaBusqueda =await page.waitForSelector(searchBoxSelector, { timeout: 10000 });
      console.log('Cuadro de busqueda encontrado ',respuestaBusqueda)
      const doyClik= await page.click(searchBoxSelector, { timeout: 10000 });
      console.log('Cuadro de busqueda encontrado ',doyClik)
      await page.type(searchBoxSelector, phone);
      
      // Esperar a que se cargue la lista de resultados y seleccionar el chat
      await page.waitForSelector(`span[title='${phone}']`, { timeout: 5000 },{ timeout: 10000 });
      const clickBusquedaNum = await page.click(`span[title='${phone}']`,{ timeout: 10000 });
      console.log("click en la busqueda ",await page.click(`span[title='${phone}']`,{ timeout: 10000 }))

      // Esperar a que el chat esté abierto y listo para recibir el mensaje
      await page.waitForSelector('._2aBzC', { timeout: 20000 });
  
      // Escribir y enviar el mensaje
      const messageBoxSelector = 'div[contenteditable="true"]';
      await page.waitForSelector(messageBoxSelector,{ timeout: 10000 });
      await page.type(messageBoxSelector, message);
      await page.keyboard.press('Enter');
      console.log('Mensaje enviado.');
  
      return true;
    } catch (error) {
      console.error('Error al enviar el mensaje:', error.message);
      throw error;
    }
  };



  
/* const sendMessage = async (phone, message) => {
    try {
      await startBrowser();
  
      // Buscar el contacto a través de la barra de búsqueda
      const searchBoxSelector = 'div[contenteditable="true"][data-tab="3"]';
      await page.waitForSelector(searchBoxSelector);
      await page.click(searchBoxSelector);
      await page.type(searchBoxSelector, phone);
  
      // Esperar a que aparezcan los resultados y seleccionar el primer resultado
      const firstChatSelector = 'div._3m_Xw'; // Este selector puede cambiar, debes inspeccionar en WhatsApp Web
      await page.waitForSelector(firstChatSelector, { timeout: 50000 }); // Aumentar el timeout
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




/*   const sendMessage = async (phone, message) => {
    console.log(phone);
    console.log(message);
    try {
      await startBrowser();
  
      // Buscar el contacto a través de la barra de búsqueda
      const searchBoxSelector = 'div[contenteditable="true"][data-tab="3"]';
      await page.waitForSelector(searchBoxSelector);
      await page.click(searchBoxSelector);
      await page.type(searchBoxSelector, phone);
  
      // Esperar a que aparezcan los resultados
      const chatSelector = 'div.x1n2onr6'; // Selecciona el primer chat en los resultados
      //const chatSelector = 'div._3m_Xw'; // Selecciona el primer chat en los resultados
      await page.waitForSelector(chatSelector, { timeout: 10000 });
      const chats = await page.$$(chatSelector);
      
      if (chats.length === 0) {
        throw new Error('No se encontró el chat.');
      }
      
      // Hacer clic en el primer chat
      await chats[0].click();
  
      // Esperar a que el chat esté listo para recibir mensajes
      const messageBoxSelector = 'div[contenteditable="true"][data-tab="6"]'; // Asegúrate de que el selector sea correcto
      await page.waitForSelector(messageBoxSelector, { timeout: 10000 });
  
      // Escribir y enviar el mensaje
      await page.type(messageBoxSelector, message);
      await page.keyboard.press('Enter');
      console.log('Mensaje enviado.');
  
      return true;
    } catch (error) {
      console.error('Error al enviar el mensaje:', error.message);
      throw error;
    }
  };
 */







  /* const sendMessage = async (phone, message) => {
  try {
    const formattedPhone = phone.replace(/\s+/g, '').replace('++', '+'); // Limpia el número
    
    // Espera a que aparezca el chat
    await page.waitForSelector(`span[title='${formattedPhone}']`, { timeout: 40000 });
    const chat = await page.$(`span[title='${formattedPhone}']`);
    await chat.click();

    // Envía el mensaje
    await page.waitForSelector("div[contenteditable='true']", { timeout: 10000 });
    const inputBox = await page.$("div[contenteditable='true']");
    await inputBox.type(message);
    await page.keyboard.press("Enter");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; */


/* const sendMessage = async (phone, message) => {
    try {
      const formattedPhone = phone.replace(/\s+/g, '').replace('++', '+'); // Limpia el número
      
      // Espera a que aparezca el chat
      await page.waitForSelector(`span[title='${formattedPhone}']`, { timeout: 30000 });
      const chat = await page.$(`span[title='${formattedPhone}']`);
      await chat.click();
  
      // Envía el mensaje
      await page.waitForSelector("div[contenteditable='true']", { timeout: 30000 });
      const inputBox = await page.$("div[contenteditable='true']");
      await inputBox.type(message);
      await page.keyboard.press("Enter");
  
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }; */
  
  const closeBrowser = async () => {
    if (browser) {
      await browser.close();
      browser = null;
      page = null;
      console.log('Sesión de WhatsApp cerrada.');
    }
  };


  module.exports = { sendMessage, closeBrowser };
