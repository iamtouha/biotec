import firebase from "firebase";
import "firebase/firestore";
import "@firebase/auth";
import firebaseConfig from "./firabaseConfig.js";

const firebaseApp = firebase.initializeApp(firebaseConfig);

firebaseApp.firestore().settings({ timestampsInSnapshots: true });
export default firebaseApp.firestore();
