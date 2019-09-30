const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./qcServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://quranconnect-4e4bc.firebaseio.com"
  });