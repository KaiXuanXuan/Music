import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBgEPkRgb2BN0PeYrb2UNQjFZ1I_HEtjnE',
  authDomain: 'music-926f9.firebaseapp.com',
  projectId: 'music-926f9',
  storageBucket: 'music-926f9.appspot.com',
  messagingSenderId: '835709578180',
  appId: '1:835709578180:web:7807d9c36d1d3f1b48d291'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

db.enablePersistence()

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export { auth, db, storage, usersCollection, songsCollection, commentsCollection }
