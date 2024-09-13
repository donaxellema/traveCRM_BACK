const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../Middleware/authentication')


//Registrar etiquetas
const etiquetasCRUD = async (req, res) => {
  const obj = req.body.data
  const { opcion, _limite, _offset} = req.body;
  try {
    const result = await pool.query(
      'SELECT crm_etiquetas_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_etiquetas_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};


const getByID_etiquetasCRUD = async (req, res) => {
  const { opcion, _limite, _offset} = req.body;
  try {
    const result = await pool.query(
      'SELECT crm_etiquetas_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_etiquetas_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};

//Buscar coincidencias en el BDD y puede TRAER TODOS LOS DATOS
const get_etiquetasCRUD = async (req, res) => {
  const obj1 = req.query
  const obj = {buscar:obj1.buscar}
  const { opcion, _limite , _offset} = req.query;
  try {
    const result = await pool.query(
      'SELECT crm_etiquetas_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_etiquetas_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ obj: respuesta.obj,code:respuesta.code, status: respuesta.status, message: respuesta.message, data:respuesta.data, totalItems:respuesta.totalItems });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};


//eliminar registro
const delete_etiquetasCRUD = async (req, res) => {
  const { etiq_id,opcion, _limite , _offset} = req.query;
  const obj = {etiq_id:etiq_id}
  console.log(req.query)
  try {
    const result = await pool.query(
      'SELECT crm_etiquetas_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_etiquetas_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};


module.exports = {
    etiquetasCRUD,
    getByID_etiquetasCRUD,
    get_etiquetasCRUD,
    delete_etiquetasCRUD
};
