const { db,auth } = require('../../../Database/firebase');

// Función para agregar un mensaje a la colección 'messages'
const addMessage = async (req, res) => {
    try {
      const { message, senderId, receiverId } = req.body;
  
      // Validar que los campos requeridos estén presentes
      if (!message || !senderId || !receiverId) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: message, senderId, receiverId' });
      }
  
      // Agregar el documento a Firestore
      const docRef = await db.collection('messages').add({
        message,
        senderId,
        receiverId,
        timestamp: new Date(), // Marca de tiempo actual
      });
  
      res.status(200).json({ id: docRef.id, message: 'Mensaje agregado correctamente' });
    } catch (error) {
      console.error('Error al agregar el mensaje:', error);
      res.status(500).json({ error: error.message });
    }
  };





// Función para agregar un usuario a Firebase Authentication
const addUser = async (req, res) => {
    try {
      const { email, password, displayName, role } = req.body;
  
      // Validar que los campos requeridos estén presentes
      if (!email || !password || !displayName) {
        return res.status(400).json({ error: 'Faltan campos requeridos: email, password, displayName' });
      }
  
      // Crear un nuevo usuario en Firebase Authentication
      const user = await auth.createUser({
        email,
        password,
        displayName,
      });
  
      // Opcional: Asignar un rol al usuario
      if (role) {
        await auth.setCustomUserClaims(user.uid, { role });
      }
  
      res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { addMessage ,addUser};
