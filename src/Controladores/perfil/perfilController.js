const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../Middleware/authentication')


//REGISTRAR O ACTUALIZAR PERSONAS EN EL SISTEMA
const perfilCRUD = async (req, res) => {
  //const { etiq_id,pers_nombres,pers_apellidos,pers_telefono,pers_email, pers_estado, pers_audit_reg } = req.body.data;
  const obj= req.body.data
  const { opcion, _limite, _offset} = req.body;
  console.log("obj")
  console.log(obj)
  /* console.log(opcion)
  console.log(_limite)
  console.log(_offset) */
  try {
    const result = await pool.query(
      'SELECT crm_registrousuario_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_registrousuario_v1;
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


const getPerfilByID = async (req, res) => {
    const obj1 = req.query
  
    const obj = {usu_id:obj1.usu_id}
    const { opcion} = req.query;
    const _limite = 0;
    const _offset = 0;
  
    try {
      const result = await pool.query('SELECT crm_registrousuario_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_registrousuario_v1;
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
const get_PerfilSearchCRUD = async (req, res) => {
  const obj1 = req.query
  const obj = {buscar:obj1.buscar}
  const { opcion, _limite , _offset} = req.query;
  console.log(opcion)
  console.log(_limite)
  console.log(_offset)
  console.log(obj)
  try {
    const result = await pool.query(
      'SELECT crm_registrousuario_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_registrousuario_v1;
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


const getPerfilCRUD = async (req, res) => {
    console.log(req.query)
    const { usu_id,opcion, _limite, _offset} = req.query;
    const obj={usu_id:usu_id}
    try {
      const result = await pool.query(
        'SELECT crm_registrousuario_v1($1, $2, $3, $4)',
        [obj, opcion, _limite, _offset]
      );
      const respuesta = result.rows[0].crm_registrousuario_v1;
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




//eliminar registro
const delete_perfilCRUD = async (req, res) => {
  const { pers_id,opcion, _limite , _offset} = req.query;
  const obj = {pers_id:pers_id}
  console.log(req.query)
  try {
    const result = await pool.query(
      'SELECT crm_campanias_v1($1, $2, $3, $4)',
      [obj, opcion, _limite, _offset]
    );
    const respuesta = result.rows[0].crm_campanias_v1;
    if (respuesta.status === 'ok' && respuesta.code === 200) {
      res.status(200).json({ code:respuesta.code, status: respuesta.status, message: respuesta.message });
    } else {
      res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};


const cambiaPassword = async (req,res)=>{
    const { usu_password_new, usu_password1,usu_email,usu_id } = req.body;
    console.log(req.body)
    const obj = JSON.stringify({ usu_email });
    const { opcion, _limite, _offset} = req.body;
    try {
      const result = await pool.query(
        'SELECT crm_auth_v1($1, $2, $3, $4)',
        [obj, "CL", _limite, _offset]
      );
      const respuesta = result.rows[0].crm_auth_v1;
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        console.log(respuesta.data)
        const isMatch = await bcrypt.compare(usu_password1, respuesta.data.usu_password1);
        if (isMatch) {
          //console.log('Login successful');
          const hashedPassword = await bcrypt.hash(usu_password_new, 10);
          const user1={
            usu_password1: hashedPassword,
            usu_id:usu_id
          }
          actualizaContrasenia(user1)
          //console.log("El usuario " +  JSON.stringify(user))
          //const token = generateToken(user);
          res.status(200).json({ status:'ok', code:200, message: 'Se actualizo la contraseña' });

      } else {
          console.log('Incorrect password');
          res.status(respuesta.code).json({ status: 'error',code: 400, message: 'Error en los datos ingresados' });

      }
        /* const user = respuesta.data;
        console.log("El usuario " +  JSON.stringify(user))
        const token = generateToken(user); */
        //res.status(200).json({ token, user, message: respuesta.message,code:respuesta.code });
      } else {
        res.status(respuesta.code).json({ status: respuesta.status, message: respuesta.message });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
}



const actualizaContrasenia = async (data,res) => {
      const obj = data;
      try {
        const result = await pool.query(
          'SELECT crm_registrousuario_v1($1, $2, $3, $4)',
          [obj, "UC", 0, 0]
        );
        
      } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
      } 
  }

module.exports = {
  perfilCRUD,
  //get_agentesCRUD,
  getPerfilByID,
  get_PerfilSearchCRUD,
  delete_perfilCRUD,
  getPerfilCRUD,
  cambiaPassword
};
