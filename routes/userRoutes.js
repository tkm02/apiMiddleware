const {
    createUser,
    getUser,
    downloadQRCode,
    getAllUsers,
    updateUser,
    deleteUser
  } = require('../controllers/userController');
  
  async function userRoutes(fastify, options) {
    fastify.post('/', createUser);
  
    fastify.get('/:id', getUser);
  
    fastify.get('/:id/download', downloadQRCode);
  
    fastify.get('/', getAllUsers);
  
    fastify.put('/:id', updateUser);
  
    fastify.delete('/:id', deleteUser);
  }
  
  module.exports = userRoutes;