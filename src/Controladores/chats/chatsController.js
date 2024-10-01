const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../Middleware/authentication')


//REGISTRAR O MENSAJES INTERNOS ENTRE AGENTES SIN EL USO DE WHATSAPP
const chatsCRUD = async (req, res) => {

  const obj= req.body.data
  const { opcion, _limite, _offset} = req.body;
  try {
    const result = await pool.query(
      'SELECT crm_mensajes_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_mensajes_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
    } else {
      console.log(respuesta)
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};

//TRAE TODOS LOS MENSAJES ENVIADOS POR ID DE CHAT -- PERO SOLO MENSAJES QUE SON ENVIADOS DENTRO DEL SISTEMA SIN WHATSAPP
const getChatByID = async (req, res) => {
    const obj1 = req.query
    const obj = {
        pers_id_sender:obj1.pers_id_sender,
        pers_id_receiver:obj1.pers_id_receiver
    }
    const { opcion} = req.query;
    const _limite = 0;
    const _offset = 0;
  
    try {
      const result = await pool.query('SELECT crm_mensajes_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_mensajes_v1;
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, data: respuesta.data });
      } else {
        res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };


  //TRAE TODOS LOS MENSAJES DEL ULTIMO CHAT DE WHATSAPP POR USUARIO SELECCIONADO
const last_Chat_by_user = async (req, res) => {

    /* const obj= req.body.data
    const { _limite, _offset} = req.body;
    const opcion="H_W_CHAT"; //HISTORIAL WHATSAPP 
    console.log("obj")
    console.log(obj) */
    console.log(JSON.stringify(req.query) )
    const obj1 = req.query
    const obj = {
        pers_id_sender:obj1.pers_id_sender,
        pers_id_receiver:obj1.pers_id_receiver
    }
    const  opcion = "H_W_CHAT";
    const _limite = 0;
    const _offset = 0;

    
    try {
      const result = await pool.query(
        'SELECT crm_mensajes_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_mensajes_v1;
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        console.log(respuesta)
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, data: respuesta.data, obj:respuesta.obj });
      } else {
        console.log(respuesta)
        res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };
  
module.exports = {
    getChatByID,
    chatsCRUD,
    last_Chat_by_user
};
