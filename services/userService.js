const User = require('../model/user');
const { generateQRCode } = require('./qrCodeService');

// Création d'un utilisateur avec génération d'un QR Code
async function createUser(request, reply) {
  try {
    const data = request;
    //console.log(data);
    
    if (!data) {
      return ({ error: 'Invalid data' });
    }

    const user = new User(data);
    //const profileUrl = `https://middlewareprofile.onrender.com?id=${user._id}`;
    const options = data.options || {}; // Récupération des options depuis la requête
    const qrCode = await generateQRCode(user._id, options);
    user.qrCodeUrl = qrCode;

    await user.save();
    return ({ user });
  } catch (err) {
    console.error(err);
    return { error: 'Failed to create user', details: err.message }
  }
}

// Récupérer un utilisateur par ID
async function getUserById(id) {
  try {
    // const { id } = request.params;
    const user = await User.findById(id);
    if (!user) {
      return ({ error: 'User not found' });
    }
    return ({user});
  } catch (err) {
    return { error: 'Failed to get user', details: err.message }
  }
}

// Récupérer tous les utilisateurs
async function getAllUsers(request, reply) {
  try {
    const users = await User.find();
    return {users};
  } catch (err) {
    return { error: 'Failed to fetch users', details: err.message };
  }
}

// Mise à jour d'un utilisateur par ID
async function updateUser(request, reply) {
  try {
    const { id } = request.params;
    const data = request.body;

    if (data.qrCodeUrl) {
     // const profileUrl = `https://middlewareprofile.onrender.com?id=${id}`;
      const qrCodePath = await generateQRCode(id, {
        primaryColor: data.primaryColor || '#000000',
        secondaryColor: data.secondaryColor || '#FFFFFF',
        shape: data.shape || 'circle'
      });
      data.qrCodeUrl = qrCodePath;
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    if (!updatedUser) {
      return ({ error: 'User not found' });
    }
    return ({updatedUser});
  } catch (err) {
    return { error: 'Failed to update user', details: err.message }
  }
}

// Suppression d'un utilisateur par ID
async function deleteUser(request, reply) {
  try {
    const { id } = request.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return ({ error: 'User not found' });
    }
    return({ message: 'User deleted' });
  } catch (err) {
    return { error: 'Failed to delete user', details: err.message }
  }
}

module.exports = { createUser, getUserById, getAllUsers, updateUser, deleteUser };
