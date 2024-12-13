import firebaseConfig from './config/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get as firebaseGet } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

const emailLogin = signInWithEmailAndPassword;
const logout = signOut;
const authStateChanged = onAuthStateChanged;

export { app, db, storage, auth, emailLogin, logout, authStateChanged, ref, firebaseGet as get };
