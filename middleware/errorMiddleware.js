

function errorHandler(error, request, reply) {
    console.error(error);
  
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Une erreur est survenue sur le serveur';
  
    reply
      .code(statusCode)
      .send({
        status: 'error',
        statusCode,
        message
      });
  }
  
  module.exports = errorHandler;