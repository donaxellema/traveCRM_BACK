const { db } = require('../../../Database/firebase');

// Función para agregar un usuario a Firestore
const addUser = async (req, res) => {
  try {
    const {
      pers_id,
      usu_email,
      usu_nickname,
      usu_password1,
      usu_password2,
      usu_imagen,
      usu_estado,
      registro,
      usu_reg,
      usu_status,
      usu_rol,
      usu_banner,
      usu_descripcion,
      usu_mensajes,
      usu_fecha_sesion,
    } = req.body;

    // Validación de campos obligatorios
    if (!pers_id || !usu_email || !usu_password1 || !usu_nickname) {
      return res.status(400).json({
        error: 'Los campos pers_id, usu_email, usu_password1 y usu_nickname son obligatorios.',
      });
    }

    // Verificar si el pers_id existe en la colección crm_personas
    const personaDoc = await db.collection('crm_personas').doc(pers_id).get();
    if (!personaDoc.exists) {
      return res.status(404).json({ error: `El pers_id ${pers_id} no existe en crm_personas.` });
    }

    // Agregar el documento en crm_usuario
    const userDoc = await db.collection('crm_usuario').add({
      pers_id,
      usu_email,
      usu_nickname,
      usu_password1,
      usu_password2,
      usu_imagen: usu_imagen || null,
      usu_estado: usu_estado || true, // Activo por defecto
      registro: registro || {},
      usu_reg: usu_reg || new Date(),
      usu_status: usu_status || 'desconectado',
      usu_rol: usu_rol || 'usuario',
      usu_banner: usu_banner || null,
      usu_descripcion: usu_descripcion || '',
      usu_mensajes: usu_mensajes || '',
      usu_fecha_sesion: usu_fecha_sesion || null,
    });

    res.status(201).json({ id: userDoc.id, message: 'Usuario agregado exitosamente.' });
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función para obtener usuarios desde Firestore
const getUsers = async (req, res) => {
    try {
      const users = [];
      const snapshot = await db.collection('crm_usuario').get();
  
      for (const doc of snapshot.docs) {
        const userData = doc.data();
  
        // Obtener información del documento relacionado en crm_personas
        const personaDoc = await db.collection('crm_personas').doc(userData.pers_id).get();
  
        users.push({
          id: doc.id,
          ...userData,
          persona: personaDoc.exists ? personaDoc.data() : null, // Agregar datos relacionados
        });
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { addUser, getUsers };
  
