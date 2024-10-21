const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  personalPhone: { type: String, required: true },
  professionalPhone: { type: String },
  personalEmail: { type: String, unique: true, required: true },
  professionalEmail: { type: String, unique: true },
  website: String,
  companyName: String,
  profession: String,
  bio: String,
  city: String,
  country: String,
  postalCode: String,
  socialLinks: {
    linkedIn: String,
    tiktok: String,
    facebook: String,
    snapchat: String,
    telegram: String,
    instagram: String,
    twitter: String,
  },
  profileImageUrl: String,
  qrCodeUrl: { type: String, required: true },
  primaryColor: { type: String, default: '#000000' },
  secondaryColor: { type: String, default: '#FFFFFF' },
  qrCodeShape: { 
    type: String, 
    enum: ['square', 'circle'], 
    default: 'circle' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);