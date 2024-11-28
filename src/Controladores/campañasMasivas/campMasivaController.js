const XLSX = require('xlsx');
const xlsx = require('xlsx');

const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');


const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multer = require('multer');






const upload = multer({ dest: 'uploads/' });

exports.uploadContacts = async (req, res) => {

  //implementacion del controlador para la implementacion de excel
    try {
      // Verificar si se cargó un archivo
      if (!req.file) {
          return res.status(400).json({ message: 'No se ha cargado ningún archivo.' });
      }

      // Leer el archivo Excel cargado
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
      const sheet = workbook.Sheets[sheetName];

      // Convertir los datos de la hoja a un JSON
      const contacts = xlsx.utils.sheet_to_json(sheet);

      // Formatear los datos al formato esperado por el procedimiento almacenado
      const contactsJson = JSON.stringify(
          contacts.map((contact) => ({
              name: contact.name || 'Sin nombre', // Asume que hay una columna "Name"
              number: contact.number, // Asume que hay una columna "Number"
              etiqueta: contact.etiqueta || 'Contacto de WhatsApp EXCEL', // Opcional
          }))
      );

      // Llamar al procedimiento almacenado
      await pool.query('SELECT crm_contacts_from_whatsapp($1)', [contactsJson]);

      // Responder al cliente
      res.status(200).json({
          message: 'Contactos cargados e importados correctamente.',
          total: contacts.length,
      });
  } catch (error) {
      console.error('Error al procesar el archivo:', error);
      res.status(500).json({ error: 'Error al procesar el archivo.' });
  }

};
