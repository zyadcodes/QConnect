const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./qcServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://quranconnect-4e4bc.firebaseio.com"
});

//Method sends a notification with a custom title and body to a specific topic (user)
exports.sendNotification = functions.https.onCall(async (input, context) => {

    const { topic, title, body } = input;
    await admin.messaging().sendToTopic(topic,
        {
            notification: {
                title,
                body,
            }
        }
    );
    return 0;

});