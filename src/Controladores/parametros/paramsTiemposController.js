const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../Middleware/authentication')


//REGISTRAR PARAMETROS TIWILO EN EL SISTEMA
const paramsTiempos = async (req, res) => {
  //const obj = JSON.stringify({ accountsid, authtoken,numtelephone,param_estado,param_tipo});
  const obj = req.body.data
  //obj.param_tipo='Tiempo';
  const { opcion, _limite, _offset} = req.body;
  try {
    const result = await pool.query(
      'SELECT crm_parametros_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_parametros_v1;
    //console.log(respuesta)
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      //const user = respuesta.data;
      //const token = generateToken(user);
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};

//EDITAR PARAMETROS TIWILO EN EL SISTEMA
/* const editarParamTiwilo = async (req, res) => {
  //const { etiq_id,pers_nombres,pers_apellidos,pers_telefono,pers_email, pers_estado, pers_audit_reg } = req.body.data;
  //const { etiq_id,pers_nombres,pers_apellidos,pers_telefono,pers_email, pers_estado, pers_audit_reg } = req.body.usuario;
 
  //LA COMENTO PARA DESPUES AGREGAR LA ENCRIPTACION EN EL PASSWORD

  //const obj = JSON.stringify({ accountsid, authtoken,numtelephone,param_estado,param_tipo});
  const obj = req.body.data
  const { opcion, _limite, _offset} = req.body;
  try {
    const result = await pool.query(
      'SELECT crm_parametros_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_auth_v1;
    //console.log(respuesta)
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      //const user = respuesta.data;
      //const token = generateToken(user);
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

}; */


module.exports = {
    paramsTiempos,
    //editarParamTiwilo
};
