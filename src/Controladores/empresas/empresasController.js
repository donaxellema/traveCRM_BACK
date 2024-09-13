const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../Middleware/authentication')

//Obtener empresa
const getEmpresasCRUD = async (req, res) => {
    const obj1 = req.query
  
    const obj = {param_tipo:obj1.param_tipo}
    const { opcion} = req.query;
    const _limite = 0;
    const _offset = 0;
  
    try {
      const result = await pool.query('SELECT crm_registroempresa_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_registroempresa_v1;
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, data: respuesta.data });
      } else {
        res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };
  

//Actualizar o Ingresar nueva empresa
const empresasCRUD = async (req, res) => {
  const obj = req.body.data
  const { opcion, _limite, _offset} = req.body;
  try {
    const result = await pool.query(
      'SELECT crm_registroempresa_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_registroempresa_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message , data: respuesta.data });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};

module.exports = {
    empresasCRUD,
    getEmpresasCRUD
};
