// backend/firebase.js
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccount = require(path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;

