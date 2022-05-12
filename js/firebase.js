import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js";
    import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
  
    const firebaseConfig = {
      apiKey            : "AIzaSyBM8O4cG40qtW_hBJgEKHjQRgwmeBNomN8",
      authDomain        : "pardnltd-firebase-messager.firebaseapp.com",
      databaseURL       : "https://pardnltd-firebase-messager-default-rtdb.firebaseio.com",
      projectId         : "pardnltd-firebase-messager",
      storageBucket     : "pardnltd-firebase-messager.appspot.com",
      messagingSenderId : "913598491540",
      appId             : "1:913598491540:web:bf2e878095214a7284fd81",
      measurementId     : "G-GRY5WSZQ19"
    };
    const app       = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    function isAuth() {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (user) return true;
      else return false;
    };
    
    document.getElementById('login-act').onclick = function() {
      const auth = getAuth(app);
      
      signInWithEmailAndPassword(auth, "chiuchingwei@icloud.com", "Rroc24924502")
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        document.getElementById('login').style["display"] = "none";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    };
    // auth_login();
    // setTimeout(() => {
    //   console.log(isAuth() ? "已登入" : "未登入");
    //   if (isAuth()) {
    //     document.getElementById('login').style["display"] = "none";
    //   }
    // }, 1000)

    // setTimeout(() => {
    //   import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore"; 
    //   const db = getFirestore(app);
    //   // Add a new document in collection "cities"
    //   await setDoc(doc(db, "cities", "LA"), {
    //     name: "Los Angeles",
    //     state: "CA",
    //     country: "USA"
    //   });
    // }, 5000)

    // import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";