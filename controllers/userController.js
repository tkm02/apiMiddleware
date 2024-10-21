const userService = require('../services/userService');
const qrCodeService = require('../services/qrCodeService');

async function createUser(request, reply) {
  try {
    const data = request.body;
    //console.log(data);
    
    const options = {
      primaryColor: data.primaryColor || '#000000',
      secondaryColor: data.secondaryColor || '#FFFFFF',
      shape: data.shape || 'square'
    };
    const result = await userService.createUser(data, options);
    reply.code(201).send(result); 
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
}

async function getUser(request, reply) {
  try {
    console.log(request.params.id);
    
    const {id} = request.params;
    const user = await userService.getUserById(id);
    if (user) {
      reply.code(200).send(user);
    } else {
      reply.code(404).send({ error: 'User not found' });
    }
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
}

async function getAllUsers(request, reply) {
    // console.log('====================================');
    // console.log(request);
    // console.log('====================================');
  try {
    const users = await userService.getAllUsers();
    //console.log(users);
    
    reply.code(200).send(users);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
}

async function updateUser(request, reply) {
  try {
    const id = request.params.id;
    const data = request.body;

    if (!data) {
      return reply.code(400).send({ error: 'Invalid request body' });
    }

    const user = await userService.updateUser(id, data);
    
    if (user) {
      reply.code(200).send(user);
    } else {
      reply.code(404).send({ error: 'User not found' });
    }
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
}
 
// async function downloadQRCode(request, reply) {
//   try {
//     const id = request.params.id;
   
    
//     const format = request.query.format || 'png';
//     const user = await userService.getUserById(id);

//     if (!user) {
//       return reply.code(404).send({ error: 'User not found' });
//     }

//     const vCardData = qrCodeService.createVCard(user);
//     const qrCodePath = await qrCodeService.downloadQRCode(format, vCardData, {
//       primaryColor: user.primaryColor || '#000000',
//       secondaryColor: user.secondaryColor || '#FFFFFF',
//       shape: user.qrCodeShape || 'circle'
//     }, id);
//     console.log(qrCodePath);
    
//     reply.send(qrCodePath); // Assurez-vous d'avoir enregistré le plugin @fastify/static
//   } catch (err) {
//     reply.code(500).send({ error: err.message });
//   }
// }

async function downloadQRCode(request, reply) {
    try {
      const id = request.params.id;
      const format = request.query.format || 'png';
      
      const user = await userService.getUserById(id);
  
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
  
      //const vCardData = qrCodeService.createVCard(user);
      const qrCodeBuffer = await qrCodeService.generateQRCode(id, {
        primaryColor: user.primaryColor || '#000000',
        secondaryColor: user.secondaryColor || '#FFFFFF',
        shape: user.qrCodeShape || 'circle'
      });
  
      reply.type(`image/${format}`).send(qrCodeBuffer.Buffer);
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  }
async function deleteUser(request, reply) {
  try {
    const id = request.params.id;
    const user = await userService.deleteUser(id);
    if (user) {
      reply.code(200).send({ message: 'User deleted successfully' });
    } else {
      reply.code(404).send({ error: 'User not found' });
    }
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
}

module.exports = { createUser, getUser, getAllUsers, updateUser, deleteUser, downloadQRCode };