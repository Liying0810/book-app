const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

admin.initializeApp({
  credential: admin.credential.cert(require(path.resolve(__dirname, serviceAccountPath)))
});

const db = admin.firestore();

module.exports = db;
