// controllers/userController.js
const { db, auth } = require('../../Database/firebase');

// Crear un nuevo usuario en Firebase Authentication y agregarlo a Firestore
async function createUser(req, res) {
  const { email, password, displayName } = req.body;

  try {
    // Verificar si el email ya existe
    const existingUser = await auth.getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Crear un nuevo usuario en Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      disabled: false,
    });

    // Guardar información adicional del usuario en Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
}

module.exports = { createUser };
