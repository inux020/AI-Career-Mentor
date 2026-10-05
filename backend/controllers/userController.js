const { getUserStore } = require("../models/User");

function getProfile(req, res) {
  const user = req.user;
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
}

function getUsers(req, res) {
  const users = getUserStore().map(({ id, name, email }) => ({ id, name, email }));
  res.json({ users });
}

module.exports = { getProfile, getUsers };
