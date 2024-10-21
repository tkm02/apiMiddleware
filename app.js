const fastify = require('fastify')({ logger: true });
const connectDB = require('./config/database');
const userRouter = require("./routes/userRoutes");
const errorHandler = require('./middleware/errorMiddleware');
const path = require('path');
const fastifyStatic = require('@fastify/static');

// Gérer les erreurs
fastify.setErrorHandler(errorHandler);

// Enregistrer les plugins
fastify.register(require('@fastify/cors'), {
  origin: (origin, cb) => {
    // Autoriser certaines origines spécifiques ou toutes (ici tout est autorisé)
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5500','https://middlewareprofile.onrender.com']; // Ajouter tes domaines autorisés ici
    if (allowedOrigins.includes(origin) || !origin) {
      cb(null, true); 
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permettre l'envoi de cookies si nécessaire
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Autoriser uniquement certaines méthodes
  allowedHeaders: ['Content-Type', 'Authorization'], // Autoriser certains headers seulement
});

// Formbody pour gérer les formulaires
fastify.register(require('@fastify/formbody'));


fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // ceci est optionnel et dépend de votre configuration
  });

  //fastify.decorate('userService', require('./services/userService'));
// Connecter à la base de données
connectDB();

// Enregistrer les routes
fastify.register(userRouter, { prefix: '/api/users' });

// Démarrer le serveur
const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' }); // Ajouter 'host' pour autoriser l'accès extérieur
    fastify.log.info(`Server is running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
