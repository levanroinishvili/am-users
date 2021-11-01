const functions = require("firebase-functions");

const {firestore, initializeApp} = require("firebase-admin");

initializeApp();
const users = firestore().collection("users-x");

exports.deleteUser = functions.https.onRequest((request, response) => {
  if ( typeof request.query.docId !== 'string' ) {
    response.send(JSON.stringify({error: 'No document id provided as a query parameter docId'}));
    return;
  }

  try {
    users.doc(request.query.docId).delete()
    .then(
      () => (response.send({result: 'Ok'}), console.log(`Removed user ${request.query.docId}`)),
      () => response.send({error: `Could not delete document ${request.query.docId}`})
    )
  } catch (e) {
    response.send({error: `Could not find document ${request.query.docId}`});
  }

});
