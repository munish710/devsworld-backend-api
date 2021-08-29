const register = async (req, res) => {
  res.json("Registered User");
};

const login = async (req, res) => {
  res.json("login user");
};

module.exports = { register, login };
