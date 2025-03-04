import firebase from "firebase/compat/app";
import "firebase/compat/auth";  // 確保身份驗證功能可用
import "firebase/compat/firestore";  // Firestore 
import "firebase/compat/storage"; 

const firebaseConfig = {
    apiKey: "AIzaSyBtpZrBB1LXkO0MoqberDRdQx8u6xZ_mV8",
    authDomain: "side-project-a530b.firebaseapp.com",
    projectId: "side-project-a530b",
    storageBucket: "side-project-a530b.firebasestorage.app",
    messagingSenderId: "486447469613",
    appId: "1:486447469613:web:8c5b4d96f33721b87e94a4"
  };
firebase.initializeApp(firebaseConfig);
export default firebase;