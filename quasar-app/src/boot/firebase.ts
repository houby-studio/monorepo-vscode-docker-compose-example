import { boot } from 'quasar/wrappers'
import firebaseServices from '../services/firebase'

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const FIREBASE_CONFIG : FirebaseConfig = {
  apiKey: process.env.API_KEY as string,
  authDomain: process.env.AUTH_DOMAIN as string,
  databaseURL: process.env.DATA_BASE_URL as string,
  projectId: process.env.PROJECT_ID as string,
  storageBucket: process.env.STORAGE_BUCKET as string,
  messagingSenderId: process.env.MESSAGING_SENDER_ID as string,
  appId: process.env.APP_ID as string,
  measurementId: process.env.MEASUREMENT_ID as string
}

export default boot(({ app }) => {
  const fb = firebaseServices.fBInit(FIREBASE_CONFIG)

  // Validation that our service structure is working
  // with an initialize Firebase application and auth instance.
  console.log('Firebase App Instantiation:', fb)
  console.log('Firebase Auth Module:', firebaseServices.auth())
})
