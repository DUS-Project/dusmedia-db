import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import "firebase/compat/remote-config";


const firebaseConfig = { 
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, 
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, 
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, 
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, 
  appId: process.env.REACT_APP_FIREBASE_APP_ID, 
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID 
};

// firebaseConfig 정보로 firebase 시작
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const storage = firebase.storage();

// Remote Config 가져오기
const remoteConfig = firebase.remoteConfig();

// Remote Config를 로드하고 활성화하는 함수 선언
async function loadRemoteConfig() {
  await remoteConfig.fetchAndActivate();
  const values = remoteConfig.getAll();
  return {
    apiKey: values.FIREBASE_API_KEY.asString(),
    appId: values.FIREBASE_APP_ID.asString(),
    authDomain: values.FIREBASE_AUTH_DOMAIN.asString(),
    measurementId: values.FIREBASE_MEASUREMENT_ID.asString(),
    messagingSenderId: values.FIREBASE_MESSAGING_SENDER_ID.asString(),
    projectId: values.FIREBASE_PROJECT_ID.asString(),
    storageBucket: values.FIREBASE_STORAGE_BUCKET.asString(),
  };
}

// Remote Config 초기화
loadRemoteConfig();

// Remote Config 값을 가져오는 함수 선언
function getRemoteConfigValue(name) {
  return remoteConfig.getString(name);
}

// Remote Config 사용
const apiKey = getRemoteConfigValue("REACT_APP_FIREBASE_API_KEY");
const appId = getRemoteConfigValue("REACT_APP_FIREBASE_APP_ID");
const authDomain = getRemoteConfigValue("REACT_APP_FIREBASE_AUTH_DOMAIN");
const measurementId = getRemoteConfigValue("REACT_APP_FIREBASE_MEASUREMENT_ID");
const messagingSenderId = getRemoteConfigValue("REACT_APP_FIREBASE_MESSAGING_SENDER_ID");
const projectId = getRemoteConfigValue("REACT_APP_FIREBASE_PROJECT_ID");
const storageBucket = getRemoteConfigValue("REACT_APP_FIREBASE_STORAGE_BUCKET");





export { firebase, firestore, storage };