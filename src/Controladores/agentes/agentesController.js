const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../Middleware/authentication')


//REGISTRAR O ACTUALIZAR PERSONAS EN EL SISTEMA
const agentesCRUD = async (req, res) => {
  //const { etiq_id,pers_nombres,pers_apellidos,pers_telefono,pers_email, pers_estado, pers_audit_reg } = req.body.data;
  const obj= req.body.data
  const { opcion, _limite, _offset} = req.body;
  console.log("obj")
  console.log(obj)
  
  if (obj.usu_password != ''){
    const hashedPassword = await bcrypt.hash(obj.usu_password, 10);
    obj.usu_password1=hashedPassword;
    obj.usu_password2=hashedPassword;
  }
    

  /* console.log(opcion)
  console.log(_limite)
  console.log(_offset) */
  try {
    const result = await pool.query(
      'SELECT crm_agentepersona_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_agentepersona_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      console.log(respuesta)
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
    } else {
      console.log(respuesta)
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};

//Actualizar agente
const agentesCRUDU = async (req, res) => {
  //const { etiq_id,pers_nombres,pers_apellidos,pers_telefono,pers_email, pers_estado, pers_audit_reg } = req.body.data;
  const obj= req.body.data
  const { opcion, _limite, _offset} = req.body;
  console.log("obj")
  console.log(obj)
  /*
  if (obj.usu_password != ''){
    const hashedPassword = await bcrypt.hash(obj.usu_password, 10);
    obj.usu_password1=hashedPassword;
    obj.usu_password2=hashedPassword;
  }
    */
    

  /* console.log(opcion)
  console.log(_limite)
  console.log(_offset) */
  try {
    const result = await pool.query(
      'SELECT crm_agentepersona_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_agentepersona_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      console.log(respuesta)
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
    } else {
      console.log(respuesta)
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};


const getAgenteByID = async (req, res) => {
    const obj1 = req.query
  
    const obj = {usu_id:obj1.usu_id}
    const { opcion} = req.query;
    const _limite = 0;
    const _offset = 0;
  
    try {
      const result = await pool.query('SELECT crm_agentePersona_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_agentePersona_v1;
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, data: respuesta.data });
      } else {
        res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };

//Buscar coincidencias en el BDD y puede TRAER TODOS LOS DATOS
const get_agentesSearchCRUD = async (req, res) => {
  const obj1 = req.query
  const obj = {buscar:obj1.buscar}
  const { opcion, _limite , _offset} = req.query;
  console.log(opcion)
  console.log(_limite)
  console.log(_offset)
  console.log(obj)
  try {
    const result = await pool.query(
      'SELECT crm_agentepersona_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_agentepersona_v1;
    console.log("respuesta")
    console.log(respuesta)
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ obj: respuesta.obj,code:respuesta.code, status: respuesta.status, message: respuesta.message, data:respuesta.data, totalItems:respuesta.totalItems });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message });
  }

};


const getAgentesCRUD = async (req, res) => {
    console.log(req.query)
    const { usu_id,opcion, _limite, _offset} = req.query;
    const obj={usu_id:usu_id}
    try {
      const result = await pool.query(
        'SELECT crm_agentepersona_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_agentepersona_v1;
      console.log("respuesta")
      console.log(respuesta)
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, persona:respuesta.persona ,data:respuesta.data ,totalItems:respuesta.totalItems});
      } else {
        res.status(respuesta.code).json({ obj:obj, status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };




  const getAgentesCRUD_last_Message = async (req, res) => {
    console.log("req.query")
    console.log(req.query)
    const { pers_id,opcion, _limite, _offset} = req.query;
    const obj={pers_id:pers_id}
    try {
      const result = await pool.query(
        'SELECT crm_mensajes_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_mensajes_v1;
      console.log("respuesta")
      console.log(respuesta)
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, 
          persona:respuesta.persona ,data:respuesta.data ,data_sender:respuesta.data_sender,
          totalItems:respuesta.totalItems});
      } else {
        res.status(respuesta.code).json({ obj:obj, status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };

  //para verificar si existen un usuario agente con esa persona
  const agentes_verifica = async (req, res) => {
    console.log(req.query)
    const { pers_id,opcion, _limite, _offset} = req.query;
    const obj={pers_id:pers_id}
    try {
      const result = await pool.query(
        'SELECT crm_agentepersona_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_agentepersona_v1;
      console.log("respuesta")
      console.log(respuesta)
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message, persona:respuesta.persona ,data:respuesta.data ,totalItems:respuesta.totalItems});
      } else {
        res.status(respuesta.code).json({ obj:obj, status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ status: 'error', message: error.message });
    }
  
  };


// CONSULTAR CONVERSACION POR ID
//REGISTRAR O ACTUALIZAR PERSONAS EN EL SISTEMA
const getMessageConversation = async (req, res) => {
  //const { etiq_id,pers_nombres,pers_apellidos,pers_telefono,pers_email, pers_estado, pers_audit_reg } = req.body.data;
  const obj= {
    pers_id:req.body.pers_id,
    chat_id:req.body.chat_id,
    pers_sender:req.body.pers_sender
  }
  const { opcion, _limite, _offset} = req.body;
  console.log("obj")
  console.log(req.body)
  try {
    const result = await pool.query(
      'SELECT crm_mensajes_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_mensajes_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      console.log(respuesta)
      res.status(200).json({ code:respuesta.code,data:respuesta.data,data_sender:respuesta.data_sender, status: respuesta.status, message: respuesta.message, obj:respuesta.obj });
    } else {
      console.log(respuesta)
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};


//eliminar registro
const delete_agentesCRUD = async (req, res) => {
  const { pers_id,opcion, _limite , _offset} = req.query;
  const obj = {pers_id:pers_id}
  console.log(req.query)
  try {
    const result = await pool.query(
      'SELECT crm_agentePersona_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_agentePersona_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};



//registro cambios

module.exports = {
  agentesCRUD,
  agentesCRUDU,
  //get_agentesCRUD,
  getAgenteByID,
  get_agentesSearchCRUD,
  delete_agentesCRUD,
  agentes_verifica,
  getAgentesCRUD,
  getAgentesCRUD_last_Message,
  getMessageConversation
};
