//registration controller
const User = require("../models/user.model");

const register = (req, res) => {
  const { body } = req;
  User.create(req.body)
    .then((newUser) => res.json({ msg: "success!", newUser }))
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  register,
};
