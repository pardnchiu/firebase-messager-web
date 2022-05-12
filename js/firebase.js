import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getDatabase, ref, set, get, child, push, update, onValue } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

// const firebaseConfig = {
//   /* Firebase 專案資訊 */
//   // apiKey            : "",
//   // authDomain        : "",
//   // databaseURL       : "",
//   // projectId         : "",
//   // storageBucket     : "",
//   // messagingSenderId : "",
//   // appId             : "",
//   // measurementId     : ""
// };
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
const auth      = getAuth(app);
const db        = getDatabase(app);
const dbRef     = ref(getDatabase(app));

let auth_user     = null;
let chatbox_user  = null;
let chat_listener = null;

function error(str){
  let elm = document.createElement('p');
  elm.id        = "page-hint";
  elm.innerText = str;
  document.body.appendChild(elm);
  let timer = setTimeout(() => {
    clearTimeout(timer);
    elm.classList.add('hide');
    timer = setTimeout(() => {
      clearTimeout(timer);
      elm.remove();
    }, 500);
  }, 1000);
};

String.prototype._ = function(){
  var str   = String(this);
  var isId  = !/(\.|\=|\[|\])/g.test(str);
  var elm   = isId ? document.getElementById(str) : document.querySelector(str);
  if (elm) return elm;
};

String.prototype._all = function(){
  var str = String(this);
  var elm = document.querySelectorAll(str);
  if (elm) return elm;
};

/* 登入會員 */
function authLogin(email, passwd, completion){
  const now   = Math.floor(Date.now() / 1000);
  /* 登入帳戶 */
  signInWithEmailAndPassword(auth, String(email), String(passwd))
  .then((userCredential) => {
    /* 設定當前用戶 */
    auth_user = userCredential.user;
    /* 更新用戶登入時間 */
    (function updateUserLogin(){
      let db      = getDatabase();
      let updates = {}
      updates[`auth/${auth_user.uid}/login`] = now
      update(ref(db), updates);
    }());
    /* 移除非用戶遮罩 */
    (function removeUnauthView(){
      /* 淡化非用戶遮罩 */
      if (document.getElementById('unauth-view')) document.getElementById('unauth-view').classList.add('done');
      let timer = setTimeout(() => {
        clearTimeout(timer);
        /* 移除非用戶遮罩元件 */
        document.getElementById('unauth-view').remove();
      }, 500);
    }());
    /* 讀取用戶資料 */
    getUserData(auth_user.uid, (snapshot) => {
      if (!snapshot) return error('用戶不存在');
      auth_user.email = snapshot.val().email;
      auth_user.name  = snapshot.val().name;
      /* 讀取聊天列表 */
      getChatboxs();
    })
  })
  .catch((error) => {
    console.log(error.message);
  });
};

/* 讀取用戶資料 */
function getUserData(uid, completion){
  get(child(dbRef, `auth/${auth_user.uid}`))
  .then((snapshot) => {
    if (!snapshot.exists()) return (
      completion(null)
    );
    completion(snapshot);
  })
  .catch((error) => {
    console.error(error);
  });
};

/* 取得註冊用戶 */
function getAuths(){
  if (!auth_user) return error('請先登入');
  get(child(dbRef, 'auth')).then((snapshot) => {
    const elmUserList = document.getElementById('user-list');
    const list = (function(){
      let ary = [];
      Object.keys(snapshot.val()).forEach((uid) => {
        if (String(uid) === String(auth_user.uid)) return;
        let obj = snapshot.val()[uid];
        obj.uid = uid;
        ary.push(obj);
      });
      return ary;
    }());
    /* 設定空白提示 */
    elmUserList.setAttribute('df', `user-list ${snapshot.exists() ? "" : "empty"}`);
    /* 插入用戶列表 */
    list.sort((a, b) => b.update - a.update).forEach((user) => {
      const elmName     = document.createElement('strong');
      elmName.innerText = String(user.name);
      const elmDate     = document.createElement('p');
      elmDate.innerText = transTimestampToStr(Number(user.login));
      const elmUserRow  = document.createElement('li');
      elmUserRow.appendChild(elmName);
      elmUserRow.appendChild(elmDate);
      elmUserRow.onclick = function(){
        if (chatbox_user && String(chatbox_user.uid) === user.uid) return;
        /* 插入新內容 */
        getCheckboxContent({
          name: user.name, 
          uid : user.uid
        });
      };
      elmUserList.appendChild(elmUserRow);
    });
  }).catch((error) => {
    console.error(error);
  });

};

/* 取得聊天室列表 */
function getChatboxs(){
  if (!auth_user) return error('請先登入');
  get(child(dbRef, `chatbox/${auth_user.uid}`)).then((snapshot) => {
    if (!snapshot.exists()) return;
    const elmUserList = document.getElementById('user-list');
    const checkbox = (function(){
      let ary = [];
      Object.keys(snapshot.val()).forEach((uid) => {
        let obj = snapshot.val()[uid];
        obj.uid = uid;
        ary.push(obj);
      });
      return ary;
    }());
    /* 設定空白提示 */
    elmUserList.setAttribute('df', `user-list ${snapshot.exists() ? "" : "empty"}`);
    /* 插入聊天列表 */
    checkbox.sort((a, b) => b.update - a.update).forEach((user) => {
      const elmName     = document.createElement('strong');
      elmName.innerText = String(user.name);
      const elmDate     = document.createElement('em');
      elmDate.innerText = transTimestampToStr(Number(user.update));
      const elmLast     = document.createElement('p');
      elmLast.innerText = String(user.last);
      const elmUserRow  = document.createElement('li');
      elmUserRow.appendChild(elmName);
      elmUserRow.appendChild(elmDate);
      elmUserRow.appendChild(elmLast);
      elmUserRow.onclick = function(){
        if (chatbox_user && String(chatbox_user.uid) === user.uid) return;
        /* 插入新內容 */
        getCheckboxContent({
          name: user.name, 
          uid : user.uid
        });
      };
      elmUserList.appendChild(elmUserRow);
    });
  }).catch((error) => {
    console.error(error);
  });
};

/* 讀取聊天內容 */
function getCheckboxContent(user){
  if (!auth_user) return error('請先登入');
  /* 標註當前user */
  chatbox_user = user;
  document.getElementById('chatbox-title').parentElement.classList.add('show');
  document.getElementById('chatbox-title').innerText = user.name;
  chatboxBtnsOnClick();
  /* 刪除原有監聽器 */
  if (chat_listener) chat_listener();
  chat_listener = onValue(ref(db, `chat/${auth_user.uid}/${user.uid}`), (snapshot) => {
    /* 清空當前內容 */
    document.getElementById('chatbox-body').innerHTML = null;
    /* 插入聊天內容 */
    Object.keys(snapshot.val())
    /* 排序 -> 舊到新 */
    .sort((a, b) => a - b)
    .forEach((timestamp) => {
      /* 聊天內容 */
      const val     = snapshot.val()[timestamp];
      const isOwner = Boolean(String(val.from) === String(auth_user.uid));
      /* 創建元件 */
      let head = document.createElement('img');
      let date = (function(){
        let elm = document.createElement('em');
        elm.innerHTML = `${transTimestampToStr(timestamp)}`;
        return elm;
      }());
      let content = (function(){
        let elm = document.createElement('p');
        elm.innerHTML = `${val.content.replace(/\n/g, '<br>')}`;
        return elm;
      }());
      let row     = (function(){
        let elm = document.createElement('li');
        elm.setAttribute('df', isOwner ? 'right' : 'left');
        if (!isOwner) elm.appendChild(head);
        if (isOwner) elm.appendChild(date);
        elm.appendChild(content);
        if (isOwner) elm.appendChild(head);
        if (!isOwner) elm.appendChild(date);
        return elm;
      }());
      "chatbox-body"._().appendChild(row);
    });
    "chatbox-body"._().scrollTo('top', 'chatbox-body'._().scrollHeight)
  });
};

/* 傳送聊天內容 */
function postChat(str){
  const db  = getDatabase();
  const now = Math.floor(Date.now() / 1000);
  const chatbox_updates = {};
  const chat_updates    = {};
  if (!str.replace(/ /g, '').length) return;
  /* 個人收件匣紀錄 */
  set(ref(db, `chatbox/${auth_user.uid}/${chatbox_user.uid}`), {
    dismiss : 0,
    last    : str,
    name    : chatbox_user.name,
    unread  : 1,
    update  : now
  });

  /* 個人對話內容紀錄 */
  set(ref(db, `chat/${auth_user.uid}/${chatbox_user.uid}/${now}`), {
    content : str,
    date    : now,
    dismiss : 0,
    from    : auth_user.uid,
    read    : 0
  });
  
  /* 對方收件匣紀錄 */
  set(ref(db, `chatbox/${chatbox_user.uid}/${auth_user.uid}`), {
    dismiss : 0,
    last    : str,
    name    : auth_user.name,
    unread  : 1,
    update  : now
  });

  /* 對方對話內容紀錄 */
  set(ref(db, `chat/${chatbox_user.uid}/${auth_user.uid}/${now}`), {
    content : str,
    date    : now,
    dismiss : 0,
    from    : auth_user.uid,
    read    : 0
  });
};

/* 聊天框按鈕 */
function chatboxBtnsOnClick(){
  if (document.getElementById('btn-chatbox-pin')) document.getElementById('btn-chatbox-pin').onclick = function(){
    
  }
  if (document.getElementById('btn-chatbox-user')) document.getElementById('btn-chatbox-user').onclick = function(){
    
  }
  if (document.getElementById('btn-chatbox-delete')) document.getElementById('btn-chatbox-delete').onclick = function(){
    
  }
  if (document.getElementById('btn-chatbox-report')) document.getElementById('btn-chatbox-report').onclick = function(){

  }
  if (document.getElementById('btn-chatbox-close')) document.getElementById('btn-chatbox-close').onclick = function(){
    if (chat_listener) chat_listener();
    chat_listener     = null;
    chatbox_user  = null;
    document.getElementById('chatbox-body').innerHTML = null;
    document.getElementById('chatbox-title').parentElement.classList.remove('show');
    document.getElementById('chatbox-title').innerText = null;
  }
};

if (document.getElementById('chat-act')) document.getElementById('chat-act').onclick = function(){
  if (!auth_user)                             return error('請先登入');
  if (!chatbox_user)                      return error('未選擇用戶');
  if (!document.getElementById('chat-input')) return error('無輸入框');
  const str = String(document.getElementById('chat-input').value);
  document.getElementById('chat-input').value = "";
  postChat(str);
};

if (document.getElementById('get-auths')) document.getElementById('get-auths').onclick = function(){
  document.getElementById('page-title').innerText = "平台用戶";
  document.getElementById('get-auths').classList.add('selected');
  document.getElementById('get-chatbox').classList.remove('selected');
  document.getElementById('get-history').classList.remove('selected');
  document.getElementById('user-list').setAttribute('df', 'empty auth');
  document.getElementById('user-list').innerHTML = null;
  getAuths();
};

if (document.getElementById('get-chatbox')) document.getElementById('get-chatbox').onclick = function(){
  document.getElementById('page-title').innerText = "所有訊息";
  document.getElementById('get-auths').classList.remove('selected');
  document.getElementById('get-chatbox').classList.add('selected');
  document.getElementById('get-history').classList.remove('selected');
  document.getElementById('user-list').setAttribute('df', 'empty inbox');
  document.getElementById('user-list').innerHTML = null;
  getChatboxs();
};

if (document.getElementById('get-history')) document.getElementById('get-history').onclick = function(){
  document.getElementById('page-title').innerText = "過往紀錄";
  document.getElementById('get-auths').classList.remove('selected');
  document.getElementById('get-chatbox').classList.remove('selected');
  document.getElementById('get-history').classList.add('selected');
  document.getElementById('user-list').setAttribute('df', 'empty inbox');
  document.getElementById('user-list').innerHTML = null;
};

/* 登入 */
if (document.getElementById('login-act')) document.getElementById('login-act').onclick = function(){
  const email   = document.querySelector('input[type="email"]').value; //"chiuchingwei@icloud.com"//
  const passwd  = document.querySelector('input[type="password"]').value; //"Rroc24924502"//
  authLogin(email, passwd);
};

/* 註冊 */
if (document.getElementById('signup-act')) document.getElementById('signup-act').onclick = function(){
  const name    = String(document.querySelector('input[type="text"]').value);
  const email   = String(document.querySelector('input[type="email"]').value);
  const passwd  = String(document.querySelector('input[type="password"]').value);
  const now     = Math.floor(Date.now() / 1000);
  createUserWithEmailAndPassword(auth, email, passwd)
  .then((userCredential) => {
    auth_user = userCredential.user;
    signup(auth_user.uid, name, email, passwd);
    function signup(uid, name, email, passwd){
      const db = getDatabase();
      set(ref(db, 'auth/' + uid), {
        name    : name,
        email   : email,
        // passwd  : passwd,
        login   : now,
        signup  : now,
        dismiss : 0
      });
      document.getElementById('unauth-view').classList.add('done');
      let timer = setTimeout(() => {
        clearTimeout(timer);
        document.getElementById('unauth-view').remove();
      }, 500);
    };
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    error(errorMessage);
  });
}

/* 切換登入 */
if (document.getElementById('login-show')) document.getElementById('login-show').onclick = function(){
  this.parentElement.setAttribute('df', 'login')
};

/* 切換註冊 */
if (document.getElementById('signup-show')) document.getElementById('signup-show').onclick = function(){
  this.parentElement.setAttribute('df', 'signup')
};

if (login_data.email && login_data.passwd){
  authLogin(login_data.email, login_data.passwd);
};
function transTimestampToStr(timestamp){
  let now     = Math.floor(Date.now() / 1000);
  let second  = now - Number(timestamp);
  let time    = new Date(Number(timestamp) * 1000);
  switch (true){
    case (second >= 86400 * 365): return `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日-${time.getHours()}:${time.getMinutes()}`;
    case (second >= 86400 * 30): return `${Math.floor(second / (86400 * 30))}月前`;
    case (second >= 86400 * 7): return `${Math.floor(second / (86400 * 7))}週前`;
    case (second >= 86400): return `${Math.floor(second / 86400)}天前`;
    case (second >= 3600): return `${Math.floor(second / 3600)}小時前`;
    case (second >= 60): return `${Math.floor(second / 60)}分鐘前`;
    default: return `${second}秒前`;
  };
};