const jwt = require('jsonwebtoken');
const global = require('../global')
const bcrypt = require('bcrypt');

const generateToken = (user) => {
  console.log(user)
  console.log(global)
  console.log(process.env)
  //return jwt.sign({ id: user.usu_id,  email: user.usu_email }, global.SEED, { expiresIn: '15d' });
  return jwt.sign({ id: user.usu_id,  email: user.usu_email }, process.env.JWT_SECRET, { expiresIn: '15d' });
};

// Función para encriptar una contraseña
async function encryptPassword(password) {
  try {
      const salt = await bcrypt.genSalt(10); // Genera un salt
      const hashedPassword = await bcrypt.hash(password, salt); // Encripta la contraseña
      return hashedPassword;
  } catch (error) {
      console.error('Error al encriptar la contraseña:', error);
      throw error;
  }
}

// Función para comparar la contraseña ingresada con la almacenada
async function verifyPassword(inputPassword, storedPassword) {
  try {
      const isMatch = await bcrypt.compare(inputPassword, storedPassword);
      return isMatch;
  } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      throw error;
  }
}

module.exports = {
  generateToken,
  encryptPassword,
  verifyPassword
};
