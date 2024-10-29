const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../Middleware/authentication')

//Obtener empresa
const getClientesByAgentes = async (req, res) => {
    //const obj = req.query
    const obj={}
    console.log("req.query")
    console.log(req.query)

    const opcion  = "CAB";
    const _limite = 0;
    const _offset = 0;
  
    try {
      const result = await pool.query('SELECT crm_dashboard_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_dashboard_v1;
      console.log("respuesta");
        console.log(respuesta);
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, data: respuesta.data });
      } else {
        res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };
  
const getClientesByProvincia = async (req, res) => {
    //const obj = req.query
    const obj={}
    console.log("req.query")
    console.log(req.query)

    const opcion  = "PROV";
    const _limite = 0;
    const _offset = 0;
  
    try {
      const result = await pool.query('SELECT crm_dashboard_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_dashboard_v1;
      console.log("respuesta_prov");
        console.log(respuesta);
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, data: respuesta.data });
      } else {
        res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };
  

  
  module.exports = {
    getClientesByAgentes,
    getClientesByProvincia
  };
  