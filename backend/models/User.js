const users = [];

function getUserStore() {
  return users;
}

function createUser({ name, email, password }) {
  const user = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

module.exports = { getUserStore, createUser };
