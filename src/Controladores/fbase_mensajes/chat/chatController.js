const { db } = require('../../../Database/firebase');

// Función para agregar un chat a Firestore
const addChat = async (req, res) => {
  try {
    const { pers_id_owner, chat_name, chat_picture } = req.body;

    // Validación de campos obligatorios
    if (!pers_id_owner || !chat_name) {
      return res.status(400).json({
        error: 'Los campos pers_id_owner y chat_name son obligatorios.',
      });
    }

    // Verificar si el pers_id_owner existe en la colección crm_personas
    const personaDoc = await db.collection('crm_personas').doc(pers_id_owner).get();
    if (!personaDoc.exists) {
      return res.status(404).json({ error: `El pers_id_owner ${pers_id_owner} no existe en crm_personas.` });
    }

    // Agregar el documento en crm_chats
    const chatDoc = await db.collection('crm_chats').add({
      pers_id_owner,
      chat_name,
      chat_picture: chat_picture || null,
      chat_fchreg: new Date(),
    });

    res.status(201).json({ id: chatDoc.id, message: 'Chat agregado exitosamente.' });
  } catch (error) {
    console.error('Error al agregar chat:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función para obtener chats desde Firestore
const getChats = async (req, res) => {
    try {
      const chats = [];
      const snapshot = await db.collection('crm_chats').get();
  
      for (const doc of snapshot.docs) {
        const chatData = doc.data();
  
        // Obtener información del documento relacionado en crm_personas
        const personaDoc = await db.collection('crm_personas').doc(chatData.pers_id_owner).get();
  
        chats.push({
          id: doc.id,
          ...chatData,
          owner: personaDoc.exists ? personaDoc.data() : null, // Datos relacionados con crm_personas
        });
      }
  
      res.status(200).json(chats);
    } catch (error) {
      console.error('Error al obtener chats:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { addChat, getChats };
  
