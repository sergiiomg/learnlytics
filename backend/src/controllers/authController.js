const register = async (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Endpoint de registro pendiente de implementar'
  });
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