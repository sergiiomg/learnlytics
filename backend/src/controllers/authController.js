const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Nombre, email y contraseña son obligatorios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un usuario con ese email'
      });
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en register:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const login = async (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Endpoint de login pendiente de implementar'
  });
};

module.exports = {
  register,
  login
};