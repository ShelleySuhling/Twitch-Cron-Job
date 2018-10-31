const axios = require('axios')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const _ = require('lodash')
const twitch_keys = require('./private_keys/keys.js')
const serviceAccount = require("./private_keys/serviceAccountKey.json")

const SCI_AND_TECH_ID = "509670"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://twitch-project-c5024.firebaseio.com"
});

var db = admin.firestore();
var docRef= db.collection('new-viewer-data')

console.log(admin.database.ServerValue.TIMESTAMP)
getStreamData().then((result) => {
    addToFirestore(SCI_AND_TECH_ID,  result)
})

async function getStreamData() {
   return axios.get('/streams/', {
            baseURL: 'https://api.twitch.tv/helix/',
            timeout: 1000,
            headers: {'client-id': twitch_keys.twitch_client_id},
            params: {
                game_id: SCI_AND_TECH_ID
            }
        }).then((result, error) => {
            console.log('result')
            return result.data.data
    })
}

function addToFirestore(game_id, all_results) {
    console.log('addToFirestore()')
    let setCurStream = docRef.add({
        gameId: game_id,
        timeDate: admin.firestore.FieldValue.serverTimestamp(),
        data: all_results
    })
}
