const { db } = require('../../../Database/firebase');

// Función para agregar un registro a Firestore
const addPerson = async (req, res) => {
  try {
    const {
      etiq_id,
      pers_nombres,
      pers_apellidos,
      pers_telefono,
      pers_email,
      pers_estado,
      pers_audit_reg,
      pers_ciudad,
      pers_pais,
      pers_provincia,
    } = req.body;

    // Validación de campos obligatorios
    if (!pers_nombres || !pers_apellidos || !pers_email) {
      return res.status(400).json({
        error: 'Los campos pers_nombres, pers_apellidos y pers_email son obligatorios.',
      });
    }

    // Crear el documento en la colección `crm_personas`
    const docRef = await db.collection('crm_personas').add({
      etiq_id: etiq_id || null,
      pers_nombres,
      pers_apellidos,
      pers_telefono: pers_telefono || null,
      pers_email,
      pers_estado: pers_estado || true, // Por defecto, activo
      pers_audit_reg: pers_audit_reg || {},
      pers_ciudad: pers_ciudad || null,
      pers_pais: pers_pais || null,
      pers_provincia: pers_provincia || null,
    });

    res.status(201).json({ id: docRef.id, message: 'Persona agregada exitosamente' });
  } catch (error) {
    console.error('Error al agregar persona:', error);
    res.status(500).json({ error: error.message });
  }
};


// Función para obtener registros de Firestore
const getPersons = async (req, res) => {
    try {
      const persons = [];
      const snapshot = await db.collection('crm_personas').get();
  
      snapshot.forEach((doc) => {
        persons.push({ id: doc.id, ...doc.data() });
      });
  
      res.status(200).json(persons);
    } catch (error) {
      console.error('Error al obtener personas:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { addPerson, getPersons };