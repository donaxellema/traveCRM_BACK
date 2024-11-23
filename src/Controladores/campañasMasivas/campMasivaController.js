const XLSX = require('xlsx');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');


const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Configuración de la conexión a PostgreSQL


// Controlador para manejar la carga y el procesamiento del archivo
const uploadFile = async (req, res) => {
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

module.exports = { uploadFile };
