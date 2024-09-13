const pool = require('../../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../../Middleware/untils')
//const {generateToken} = require('../../Middleware/authentication')

/* const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email', [name, email, hashedPassword]);
    const user = result.rows[0];
    const token = generateToken(user);
    
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; */





//LOGIN EN EL SISTEMA DEL BACK
const login = async (req, res) => {
  console.log(req.body.data)
    const { usu_email, usu_password1 } = req.body.data;
    const usu_password1Par = usu_password1;
    //const usu_password1 = await bcrypt.hash(usu_password1_cl, 10); 
    //LA COMENTO PARA DESPUES AGREGAR LA ENCRIPTACION EN EL PASSWORD

    const obj = JSON.stringify({ usu_email, usu_password1 });
    const { opcion, _limite, _offset} = req.body;
    try {
      const result = await pool.query(
        'SELECT crm_auth_v1($1, $2, $3, $4)',
        [obj, "CL", _limite, _offset]
      );
      const respuesta = result.rows[0].crm_auth_v1;
      //console.log("respuesta")
      if (respuesta.status === 'ok' && respuesta.code === 200) {
        //console.log(respuesta)
        const isMatch = await bcrypt.compare(usu_password1Par, respuesta.data.usu_password1);
        if (isMatch) {
          //console.log('Login successful');

          const user = respuesta.data;
          console.log(user)
          user.emp_nombre=respuesta.empresa.emp_nombre
          user.emp_camp1=respuesta.empresa.emp_camp1
          const user1 ={
            usu_email:respuesta.data.usu_email,
            usu_id:respuesta.data.usu_id,
            usu_nickname:respuesta.data.usu_nickname,
            usu_imagen:respuesta.data.usu_imagen,
            usu_status:'On line'
          } 
          respuesta.data;
          actualizaStatus(user1)
          //console.log("El usuario " +  JSON.stringify(user))
          const token = generateToken(user);
          res.status(200).json({ token, user, message: respuesta.message,code:respuesta.code });

      } else {
          console.log('Incorrect password');
          res.status(respuesta.code).json({ status: 'error',code: 400, message: 'Error en los datos ingresados' });

      }
        /* const user = respuesta.data;
        console.log("El usuario " +  JSON.stringify(user))
        const token = generateToken(user); */
        //res.status(200).json({ token, user, message: respuesta.message,code:respuesta.code });
      } else {
        console.log( respuesta)
        res.status(respuesta.code).json({ status: respuesta.status, code:404 , message: respuesta.message });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }

};


const actualizaStatus = async (data,res) => {
  //const { usu_email, usu_password1 } = req.body.data;
    //const usu_password1Par = usu_password1;
    //const usu_password1 = await bcrypt.hash(usu_password1_cl, 10); 
    //LA COMENTO PARA DESPUES AGREGAR LA ENCRIPTACION EN EL PASSWORD
    //data.usu_status=estado;
    const obj = data;
    //console.log("obj actualiza estatus")
    //console.log(obj)
    //const { opcion, _limite, _offset} = req.body;
    try {
      const result = await pool.query(
        'SELECT crm_auth_v1($1, $2, $3, $4)',
        [obj, "US", 0, 0]
      );
      
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    } 
}


const logout = async (data,res) => {
  //const { usu_email, usu_password1 } = req.body.data;
    //const usu_password1Par = usu_password1;
    //const usu_password1 = await bcrypt.hash(usu_password1_cl, 10); 
    //LA COMENTO PARA DESPUES AGREGAR LA ENCRIPTACION EN EL PASSWORD
    //data.usu_status=estado;
    const obj = data.body;
    //console.log("obj actualiza estatus")
    console.log(obj)
    //const { opcion, _limite, _offset} = req.body;
    try {
      const result = await pool.query(
        'SELECT crm_auth_v1($1, $2, $3, $4)',
        [obj, "US", 0, 0]
      );

      actualizaStatus(user1,estado)
          //console.log("El usuario " +  JSON.stringify(user))
          const token = generateToken(user);
          res.status(200).json({ token, user, message: respuesta.message,code:respuesta.code });


    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    } 
}


module.exports = {
  login,
  logout
};
