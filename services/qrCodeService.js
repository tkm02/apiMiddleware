const QRCode = require('qrcode');
const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

async function generateQRCode(id, options) {
    try {
        const profileUrl = `https://middlewareprofile.onrender.com?id=${id}`;
      const canvas = createCanvas(500, 500);
      await QRCode.toCanvas(canvas, profileUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: options.primaryColor,
          light: options.secondaryColor,
        },
      });
      return canvas.toBuffer();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
function createVCard(user) {
  const socialLinks = Object.entries(user.socialLinks || {})
    .filter(([_, value]) => value)
    .map(([key, value]) => `X-SOCIAL-${key.toUpperCase()}:${value}`)
    .join('\n');

  return `BEGIN:VCARD
VERSION:3.0
N:${user.lastName};${user.firstName};;;
FN:${user.firstName} ${user.lastName}
TEL;TYPE=HOME,VOICE:${user.personalPhone}
TEL;TYPE=WORK,VOICE:${user.professionalPhone || ''}
EMAIL;TYPE=HOME,INTERNET:${user.personalEmail}
EMAIL;TYPE=WORK,INTERNET:${user.professionalEmail || ''}
URL:${user.website || ''}
ORG:${user.companyName || ''}
TITLE:${user.profession || ''}
ADR;TYPE=WORK:;;${user.city || ''};${user.country || ''};${user.postalCode || ''}
NOTE:${user.bio || ''}
${socialLinks}
END:VCARD`;
}

async function downloadQRCode(format, userId, options) {
    console.log(format);
    console.log(userId);
    console.log(options);
      
    const buffer = await generateQRCode(userId, options);
    const outputDir = path.join(__dirname, '../public/qrcodes');
    await fs.mkdir(outputDir, { recursive: true });
    
    const fileName = `qrcode_${userId}.${format}`;
    const filePath = path.join(outputDir, fileName);
  
    await fs.writeFile(filePath, buffer);
    return filePath;
  }
module.exports = { generateQRCode, createVCard, downloadQRCode };