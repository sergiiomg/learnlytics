const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      ok: true,
      message: 'Login correcto',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    ok: true,
    user: req.user
  });
};

module.exports = {
  register,
  login,
  getMe
};