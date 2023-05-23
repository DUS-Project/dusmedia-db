import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyABt5TNZc1EwVqt7WxX_U2L-k-VuKOn72Y",
    authDomain: "dusmedia-e4bb8.firebaseapp.com",
    projectId: "dusmedia-e4bb8",
    storageBucket: "dusmedia-e4bb8.appspot.com",
    messagingSenderId: "395561482290",
    appId: "1:395561482290:web:edafdd884f0906f768e42b",
    measurementId: "G-SPWQZX7Q62"
  };

// firebaseConfig 정보로 firebase 시작
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const storage = firebase.storage();

export { firebase, firestore, storage };