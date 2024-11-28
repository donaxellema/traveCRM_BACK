const XLSX = require('xlsx');
const xlsx = require('xlsx');

const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');


const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multer = require('multer');


// Configuración de la conexión a PostgreSQL


// Controlador para manejar la carga y el procesamiento del archivo
/* const uploadFile = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Leer el archivo Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Iterar los datos y almacenarlos en PostgreSQL
    for (const row of data) {
      const { Nombre, Telefono } = row; // Ajusta estos nombres según tu Excel
      if (Nombre && Telefono) {
        await Pool.query(
          `INSERT INTO crm_personas (pers_nombres, pers_telefono) VALUES ($1, $2)`,
          [Nombre, Telefono]
        );
      }
    }

    // Eliminar el archivo subido
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Datos cargados exitosamente.' });
  } catch (error) {
    console.error('Error procesando el archivo:', error);
    res.status(500).json({ error: 'Error procesando el archivo.' });
  }
};

module.exports = { uploadFile }; */




const upload = multer({ dest: 'uploads/' });

exports.uploadContacts = async (req, res) => {
  /*
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado un archivo.' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log("data")
    console.log(data)

    const query = `
      INSERT INTO crm_whatsapp_contacts (contact_name, contact_etiqueta, contact_number)
      VALUES ($1, $2, $3)
      ON CONFLICT (contact_number) DO NOTHING
    `;

    for (const contact of data) {
      const { name, etiqueta, number } = contact;
      console.log( name, etiqueta, number )
      await pool.query(query, [
        name || 'Sin nombre',
        etiqueta || 'Contacto de Excel',
        number,
      ]);
    }

    res.status(200).json({ message: 'Contactos importados exitosamente.', total: data.length });
  } catch (error) {
    console.error('Error al procesar archivo:', error);
    res.status(500).json({ error: 'Error al procesar los contactos.' });
  }*/


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
