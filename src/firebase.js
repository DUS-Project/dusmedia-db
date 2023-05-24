import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import "firebase/compat/remote-config";

const firebaseConfig = { projectId: "dusmedia-e4bb8" };

// firebaseConfig 정보로 firebase 시작
firebase.initializeApp(firebaseConfig);

// Remote Config 가져오기
const remoteConfig = firebase.remoteConfig();
remoteConfig.settings = {
  minimumFetchIntervalMillis: 3600000,
  fetchTimeoutMillis: 60000,
  fetchAndActivate: true,
};

// Remote Config 초기화 후 값을 가져오는 함수 선언
async function loadRemoteConfig() {
  await remoteConfig.fetchAndActivate();
  const apiKey = remoteConfig.getValue("REACT_APP_FIREBASE_API_KEY").asString();
  const appId = remoteConfig.getValue("REACT_APP_FIREBASE_APP_ID").asString();
  const authDomain = remoteConfig.getValue("REACT_APP_FIREBASE_AUTH_DOMAIN").asString();
  const measurementId = remoteConfig.getValue("REACT_APP_FIREBASE_MEASUREMENT_ID").asString();
  const messagingSenderId = remoteConfig.getValue("REACT_APP_FIREBASE_MESSAGING_SENDER_ID").asString();
  const projectId = remoteConfig.getValue("REACT_APP_FIREBASE_PROJECT_ID").asString();
  const storageBucket = remoteConfig.getValue("REACT_APP_FIREBASE_STORAGE_BUCKET").asString();

  return { apiKey, appId, authDomain, measurementId, messagingSenderId, projectId, storageBucket };
}

// Remote Config를 initialize하는 함수 선언
async function initializeRemoteConfig() {
  try {
    await remoteConfig.ensureInitialized();
    const configValues = await loadRemoteConfig();
    console.log(configValues);

    const newFirebaseConfig = {
      apiKey: configValues.apiKey,
      authDomain: configValues.authDomain,
      projectId: configValues.projectId,
      storageBucket: configValues.storageBucket,
      messagingSenderId: configValues.messagingSenderId,
      appId: configValues.appId,
      measurementId: configValues.measurementId
    };

    firebase.initializeApp(newFirebaseConfig);
  } catch (error) {
    console.error("Error initializing remote config:", error);
  }
}

initializeRemoteConfig();

const firestore = firebase.firestore();
const storage = firebase.storage();

export { firebase, firestore, storage };

