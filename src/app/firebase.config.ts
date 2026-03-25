import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ REPLACE with your Firebase project "Social Network" config
// Go to: Firebase Console → Project Settings → Your Apps → SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyDDjJLO6C89-2cBlVhIuC_voOEc3jTdkiI",
  authDomain: "studio-5157311556-7784f.firebaseapp.com",
  projectId: "studio-5157311556-7784f",
  storageBucket: "studio-5157311556-7784f.firebasestorage.app",
  messagingSenderId: "126835520603",
  appId: "1:126835520603:web:e183b3b82ea3c8685efb7e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
