import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getDatabase, ref, set, get, child, push, update, onValue } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

/* 覆蓋 Firebase 專案資料 */
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
const headAry   = [
  "01.svg",
  "Afterclap-0.svg",
  "Afterclap-1.svg",
  "Afterclap-2.svg",
  "Afterclap-3.svg",
  "Afterclap-4.svg",
  "Afterclap-5.svg",
  "Afterclap-6.svg",
  "Afterclap-7.svg",
  "Afterclap-8.svg",
  "Afterclap-9.svg",
  "Cranks-0.svg",
  "Cranks-1.svg",
  "Cranks-2.svg",
  "Delivery boy-0.svg",
  "Delivery boy-1.svg",
  "Delivery boy-2.svg",
  "Delivery boy-3.svg",
  "Delivery boy-4.svg",
  "Delivery boy-5.svg",
  "E-commerce-0.svg",
  "E-commerce-1.svg",
  "E-commerce-2.svg",
  "Funny Bunny-0.svg",
  "Funny Bunny-1.svg",
  "Funny Bunny-2.svg",
  "Funny Bunny-3.svg",
  "Funny Bunny-4.svg",
  "Funny Bunny-5.svg",
  "Funny Bunny-6.svg",
  "Funny Bunny-7.svg",
  "Funny Bunny-8.svg",
  "Guacamole-0.svg",
  "Guacamole-1.svg",
  "Guacamole-2.svg",
  "Guacamole-3.svg",
  "Juicy-0.svg",
  "Juicy-1.svg",
  "No comments 3.svg",
  "No comments 4.svg",
  "No comments 5.svg",
  "No comments 6.svg",
  "No comments 7.svg",
  "No comments 8.svg",
  "No comments 9.svg",
  "No Comments-0.svg",
  "No Comments-1.svg",
  "No Comments-2.svg",
  "No Comments-3.svg",
  "No gravity-0.svg",
  "No gravity-1.svg",
  "No gravity-2.svg",
  "No gravity-3.svg",
  "OSLO-0.svg",
  "OSLO-1.svg",
  "OSLO-2.svg",
  "OSLO-3.svg",
  "OSLO-4.svg",
  "OSLO-5.svg",
  "OSLO-6.svg",
  "OSLO-7.svg",
  "OSLO-8.svg",
  "OSLO-9.svg",
  "OSLO-10.svg",
  "OSLO-11.svg",
  "OSLO-12.svg",
  "OSLO-13.svg",
  "OSLO-14.svg",
  "Teamwork-0.svg",
  "Teamwork-1.svg",
  "Teamwork-2.svg",
  "Teamwork-3.svg",
  "Teamwork-4.svg",
  "Teamwork-5.svg",
  "Teamwork-6.svg",
  "Teamwork-7.svg",
  "Teamwork-8.svg",
  "Upstream-0.svg",
  "Upstream-1.svg",
  "Upstream-2.svg",
  "Upstream-3.svg",
  "Upstream-4.svg",
  "Upstream-5.svg",
  "Upstream-6.svg",
  "Upstream-7.svg",
  "Upstream-8.svg",
  "Upstream-9.svg",
  "Upstream-10.svg",
  "Upstream-11.svg",
  "Upstream-12.svg",
  "Upstream-13.svg",
  "Upstream-14.svg",
  "Upstream-15.svg",
  "Upstream-16.svg",
  "Upstream-17.svg"
];
let auth_user       = null;
let chatbox_user    = null;
let chatboxListener = null;
let chatListener    = null;
let user_block      = [];
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

(function onclick(){
  /* 切換登入 */
  if ("login-show"._()) "login-show"._().onclick = function(){
    this.parentElement.setAttribute('df', 'login')
  };
  /* 切換註冊 */
  if ("signup-show"._()) "signup-show"._().onclick = function(){
    this.parentElement.setAttribute('df', 'signup')
  };
  /* 登入 */
  if ("login-act"._()) "login-act"._().onclick = function(){
    const email   = document.querySelector('input[type="email"]').value; //"chiuchingwei@icloud.com"//
    const passwd  = document.querySelector('input[type="password"]').value; //"Rroc24924502"//
    authLogin(email, passwd);
  };
  /* 註冊 */
  if ("signup-act"._()) "signup-act"._().onclick = function(){
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
  };
  if ("get-pages"._()) "get-pages"._().onclick = function(){
    console.log(this.parentElement.classList)
    const isShow = Boolean(this.parentElement.classList.contains('show'));
    isShow ? this.parentElement.classList.remove('show') : this.parentElement.classList.add('show');
  };
  /* 更換頁面 -> 註冊用戶 */
  if ("get-auths"._()) "get-auths"._().onclick = function(){
    pageSwitch('get-auths', this.parentElement);
    _getAuthList();
  };
  /* 更換頁面 -> 收件匣 */
  if ("get-chatbox"._()) "get-chatbox"._().onclick = function(){
    pageSwitch('get-chatbox', this.parentElement);
    _getChatbox(false);
  };
  /* 更換頁面 -> 已封鎖 */
  if ("get-auths-block"._()) "get-auths-block"._().onclick = function(){
    pageSwitch('get-auths-block', this.parentElement);
    _getChatbox(true);
    const elmUserList = document.getElementById('user-list');
    /* 插入用戶列表 */
    user_block
    .sort((a, b) => b.update - a.update)
    .forEach((user) => {
      const elmName       = document.createElement('strong');
      elmName.innerText   = String(user.name);
      const elmUserRow    = document.createElement('li');
      elmUserRow.appendChild(elmName);
      elmUserRow.onclick = function(){
        if (chatbox_user && String(chatbox_user.uid) === user.uid) return;
        /* 插入新內容 */
        _getChat(user);
      };
      elmUserList.appendChild(elmUserRow);
    });
  };
  /* 送出訊息 */
  if ("chat-act"._()) "chat-act"._().onclick = function(){
    if (!auth_user)     return error('請先登入');
    if (!chatbox_user)  return error('未選擇用戶');
    const str = String("chat-input"._().value);
    "chat-input"._().value = "";
    postChat(str);
  };
  /* 更換頭像 */
  if ("btn-head-change"._()) "btn-head-change"._().onclick = function(){
    const elm = _('div', null, [
      _('h6', { innerText: "選取頭像" }),
      _('div', null, 
        (function(){
          let ary = [
          ];
          headAry.forEach(head => {
            ary.push(
              _('img', { 
                src: `./image/Userpics/SVG/Square/${head}`,
                onclick: function(){
                  _updateAuthHead(head);
                  elm.remove();
                } 
              })
            )
          });
          return ary;
        }())
      )
    ]);
    "right-view"._().appendChild(elm);
  };
  /**
   * 
   * 函式
   * 
   */
  /* 更換頁面 */
  function pageSwitch(page, nav){
    // document.getElementById('page-title').innerText = "過往紀錄";
    nav.classList.remove('show');
    document.getElementById('user-list').innerHTML  = null;
    if (chatboxListener) chatboxListener();
    
    ["get-auths", "get-chatbox",  "get-auths-block"].forEach(e => {
      if (e === page) { 
        "main-view-title"._().innerText = e._().querySelector('p').innerText;
        e._().classList.add('selected');
      } else { 
        e._().classList.remove('selected');
      };
    });
  
    if (page === 'get-chatbox') "user-list"._().setAttribute('df', 'empty inbox');
    else "user-list"._().setAttribute('df', 'empty auth');
  
    closeChatbox();
  };
}());

if (login_data.email && login_data.passwd){
  authLogin(login_data.email, login_data.passwd);
};
/**
 * 
 * 函式
 * 
 */
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
/* 登入會員 */
function authLogin(email, passwd, completion){
  const now   = Math.floor(Date.now() / 1000);
  /* 登入帳戶 */
  signInWithEmailAndPassword(auth, String(email), String(passwd))
  .then((userCredential) => {
    /* 設定當前用戶 */
    auth_user = userCredential.user;
    /* 更新用戶登入時間 */
    (function(){
      let db      = getDatabase();
      let updates = {}
      updates[`auth/${auth_user.uid}/login`] = now
      update(ref(db), updates);
    }());
    /* 移除非用戶遮罩 */
    (function(){
      /* 淡化非用戶遮罩 */
      if (document.getElementById('unauth-view')) document.getElementById('unauth-view').classList.add('done');
      let timer = setTimeout(() => {
        clearTimeout(timer);
        /* 移除非用戶遮罩元件 */
        document.getElementById('unauth-view').remove();
      }, 500);
    }());
    /* 讀取用戶資料 */
    _getAuthSingle(auth_user.uid, (snapshot) => {
      if (!snapshot) return error('用戶不存在');
      auth_user.email = snapshot.val().email;
      auth_user.name  = snapshot.val().name;
      auth_user.head  = snapshot.val().head;
      "auth-head"._().src         = `./image/Userpics/SVG/Square/${snapshot.val().head}`;
      "auth-name"._().innerText   = snapshot.val().name;
      "auth-signup"._().innerText = `${transTimestampToStr(snapshot.val().signup)}註冊`;
      /* 讀取聊天列表 */
      _getChatbox(false);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
};
/* 讀取用戶資料 */
function _getAuthSingle(uid, completion){
  get(child(dbRef, `auth/${uid}`))
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
function _getAuthList(){
  if (!auth_user) return error('請先登入');
  get(child(dbRef, 'auth')).then((snapshot) => {

    if (!snapshot.exists()) return;
    /* */
    let list = [];
    Object.keys(snapshot.val()).forEach((uid) => {
      if (String(uid) === String(auth_user.uid)) return;
      let obj = snapshot.val()[uid];
      obj.uid = uid;
      /* 已封鎖 */
      if (user_block.filter(a => a.uid === obj.uid).length) return;
      list.push(obj);
    });
    /*  */
    "user-list"._().setAttribute('df', `${list.length ? "" : "empty inbox"}`);
    /* 插入用戶 */
    if (!list.length) return;
    list.sort((a, b) => b.update - a.update).forEach((user) => {
      "user-list"._().appendChild(
        _('li', {
          onclick: function(){
            if (chatbox_user && String(chatbox_user.uid) === user.uid) return;
            /* 插入內容 */
            _getChat(user);
          }
        }, [
          _('img', { src: `./image/Userpics/SVG/Square/${user.head}` }),
          _('strong', { innerText: String(user.name) }),
          _('em', { innerText: `${transTimestampToStr(Number(user.login))}登入` }),
          _('p', { innerText: hideUserEmail(user.email) })
        ])
      );
    });
  }).catch((error) => {
    console.error(error);
  });

};
/* 取得聊天室列表 */
function _getChatbox(isBlock){
  if (!auth_user) return error('請先登入');
  /* 取得資料 */
  if (chatboxListener) chatboxListener();
  chatboxListener = onValue(ref(db, `chatbox/${auth_user.uid}`), (snapshot) => {
    /* init */
    "user-list"._().innerHTML = null;
    "user-list"._().setAttribute('df', "empty inbox");

    user_block = [];
    if (!snapshot.exists()) return;
    let ary = [];
    Object.keys(snapshot.val()).forEach((uid) => {
      let obj = snapshot.val()[uid];
      obj.uid = uid;
      switch (isBlock) {
        case true:
          if (Number(obj.block) === 1) user_block.push(obj), ary.push(obj);
          break;
        case false:
          if (Number(obj.block) === 1) user_block.push(obj);
          else if (Number(obj.hide) === 0) ary.push(obj);
          break;
      };
    });
    /* 插入聊天 */
    (function(){
      if (!ary.length) return;
      /* 移除提示 */
      "user-list"._().setAttribute('df', "");
      /* 插入資料 */
      ary.sort((a, b) => b.update - a.update).forEach((user) => {
        "user-list"._().appendChild(
          _('li', {
            onclick: function(){
              if (chatbox_user && String(chatbox_user.uid) === user.uid) return;
              /* 插入新內容 */
              _getChat(user);
            }
          }, [
            _('img', { src: `./image/Userpics/SVG/Square/${user.head}` }),
            _('strong', { innerText: String(user.name) }),
            _('em', { innerText: transTimestampToStr(Number(user.update)) }),
            _('p', { innerText: user.last ? user.last : "無聊天內容" })
          ])
        );
      });
    }());
  });
};
/* 讀取聊天內容 */
function _getChat(user){
  if (!auth_user) return error('請先登入');
  /* 刪除原有監聽器 */
  if (chatListener) chatListener();
  chatListener = onValue(ref(db, `chat/${auth_user.uid}/${user.uid}`), (snapshot) => {
    /* init */
    chatbox_user = user;
    "main-view"._().setAttribute('uid', user.uid);
    "chatbox-head"._().src = `./image/Userpics/SVG/Square/${user.head}`;
    "chatbox-title"._().innerText = user.name;
    "chatbox-title"._().parentElement.classList.add('show');
    "chatbox-body"._().innerHTML = null;
    const isBlock = snapshot.val() ? snapshot.val().block : null;
    const isHide = snapshot.val() ? snapshot.val().hide : null;
    isBlock ? "chatbox-body"._().parentElement.classList.add('block') : "chatbox-body"._().parentElement.classList.remove('block');
    initChat(isBlock, snapshot.exists(), isHide);
    if (!snapshot.exists()) return;
    Object.keys(snapshot.val())
    /* 排序 -> 舊到新 */
    .sort((a, b) => a - b)
    .forEach((timestamp) => {
      if (timestamp === "block" || timestamp === "hide") return;
      /* 聊天內容 */
      const val     = snapshot.val()[timestamp];
      const isOwner = Boolean(String(val.from) === String(auth_user.uid));
      /* 創建元件 */
      // let head = document.createElement('img');
      // head.src = `./image/Userpics/SVG/Square/${isOwner ? auth_user.head : chatbox_user.head}`;
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
        // if (!isOwner) elm.appendChild(head);
        if (isOwner) elm.appendChild(date);
        elm.appendChild(content);
        // if (isOwner) elm.appendChild(head);
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
  if (!str.replace(/ /g, '').length) return;
  /* 個人收件匣紀錄 */
  set(ref(db, `chatbox/${auth_user.uid}/${chatbox_user.uid}`), {
    uid     : chatbox_user.uid,
    last    : str,                /* 最新內容 */
    name    : chatbox_user.name,  /* 用戶名稱 */
    head    : chatbox_user.head,  /* 用戶頭像 */
    unread  : 1,                  /* 未讀 */
    block   : 0,                  /* 封鎖 */
    hide    : 0,                  /* 隱藏 */
    update  : now,                /* 時間 */
    dismiss : 0                   /* 刪除 */
  });

  /* 個人對話內容紀錄 */
  set(ref(db, `chat/${auth_user.uid}/${chatbox_user.uid}/${now}`), {
    uid     : chatbox_user.uid,
    content : str,
    date    : now,
    dismiss : 0,
    from    : auth_user.uid,
    read    : 0
  });
  set(ref(db, `chat/${auth_user.uid}/${chatbox_user.uid}/hide`), null);
  
  /* 對方收件匣紀錄 */
  set(ref(db, `chatbox/${chatbox_user.uid}/${auth_user.uid}`), {
    uid     : auth_user.uid,
    last    : str,              /* 最新內容 */
    name    : auth_user.name,   /* 用戶名稱 */
    head    : auth_user.head,   /* 用戶頭像 */
    unread  : 1,                /* 未讀 */
    block   : 0,                /* 封鎖 */
    hide    : 0,                /* 隱藏 */
    update  : now,              /* 時間 */
    dismiss : 0                 /* 刪除 */
  });

  /* 對方對話內容紀錄 */
  set(ref(db, `chat/${chatbox_user.uid}/${auth_user.uid}/${now}`), {
    uid     : auth_user.uid,
    content : str,
    date    : now,
    dismiss : 0,
    from    : auth_user.uid,
    read    : 0
  });
};
/* 傳送聊天內容 */
function _updateAuthHead(head){
  /* 更新資料 */
  (function(){
    let authUpdate = {};
    authUpdate[`auth/${auth_user.uid}/head`] = head;
    update(ref(db), authUpdate);
  }());
  /* 更新介面 */
  (function(){
    auth_user.head = head;
    "auth-head"._().src = `./image/Userpics/SVG/Square/${head}`;
  }());
};
/* 聊天框按鈕 */
function initChat(isBlock, isExist, isHide){
  isBlock ? "btn-chatbox-user"._().parentElement.classList.add('block') : "btn-chatbox-user"._().parentElement.classList.remove('block')
  if ("btn-chatbox-user"._()) "btn-chatbox-user"._().onclick = function(){
    
  };
  if ("btn-chatbox-block"._()) {
    isBlock ? "btn-chatbox-block"._().classList.add('selected') : "btn-chatbox-block"._().classList.remove('selected');
    "btn-chatbox-block"._().onclick = function(){
      if (!confirm(`${!isBlock ? "" : "解除"}封鎖${!isBlock ? "用戶" : ""}，確認？`)) return;
      let now           = Math.floor(Date.now() / 1000);
      let chatboxUpdate = {}
      let chatUpdate    = {}
      chatboxUpdate[`chatbox/${auth_user.uid}/${chatbox_user.uid}/uid`]     = chatbox_user.uid;
      chatboxUpdate[`chatbox/${auth_user.uid}/${chatbox_user.uid}/name`]    = chatbox_user.name;
      chatboxUpdate[`chatbox/${auth_user.uid}/${chatbox_user.uid}/head`]    = chatbox_user.head;
      chatboxUpdate[`chatbox/${auth_user.uid}/${chatbox_user.uid}/block`]   = !isBlock ? 1 : 0;
      chatboxUpdate[`chatbox/${auth_user.uid}/${chatbox_user.uid}/update`]  = now;
      chatUpdate[`chat/${auth_user.uid}/${chatbox_user.uid}/block`] = !isBlock ? 1 : null;
      update(ref(db), chatboxUpdate);
      update(ref(db), chatUpdate);
      !isBlock ? "get-auths-block"._().click() : "get-chatbox"._().click();
    }
  };
  /* 對話 - 刪除對話 */
  if ("btn-chatbox-delete"._()) {
    "btn-chatbox-delete"._().style["display"] = isExist && !isHide && !isBlock  ? "inline-block" : "none";
    "btn-chatbox-delete"._().onclick = function(){
      if (!confirm('刪除對話，確認？')) return;
      /* 個人收件匣紀錄 */
      set(ref(db, `chatbox/${auth_user.uid}/${chatbox_user.uid}`), null);
      /* 個人對話內容紀錄 */
      set(ref(db, `chat/${auth_user.uid}/${chatbox_user.uid}`), null);
      /* 關閉對話 */
      "btn-chatbox-close"._().click();
    };
  }
  /* 對話 - 封存對話 */
  if ("btn-chatbox-hide"._()) {
    "btn-chatbox-hide"._().style["display"] = isExist && isHide ? "inline-block" : "none";
    isHide ? "btn-chatbox-hide"._().classList.add('selected') : "btn-chatbox-hide"._().classList.remove('selected');
    "btn-chatbox-hide"._().onclick = function(){
      /* 個人收件匣紀錄 */
      set(ref(db, `chatbox/${auth_user.uid}/${chatbox_user.uid}/hide`), isHide ? 0 : 1);
      /* 個人對話內容紀錄 */
      set(ref(db, `chat/${auth_user.uid}/${chatbox_user.uid}/hide`), isHide ? null : 1);
    };
  }
  if ("btn-chatbox-close"._()) "btn-chatbox-close"._().onclick = function(){
    closeChatbox()
  };
};

function closeChatbox(){
  if (chatListener) chatListener();
  chatListener = null;
  chatbox_user  = null;
  "main-view"._().setAttribute('uid', '');
  document.getElementById('chatbox-body').innerHTML = null;
  document.getElementById('chatbox-title').parentElement.classList.remove('show');
  document.getElementById('chatbox-title').innerText = null;
};
/* 轉換時間戳 */
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
/* 郵件馬賽克 */
function hideUserEmail(email) {
  let index = email.indexOf('@');
  let str = email[0];
  for (let i = 0; i < index - 2; i++) {
    str += "*";
  };
  str += email[12 - 1];
  return `${str}${email.slice(12, email.length)}`;
};

function _(elm, attrs, children) {
	var dom = document.createElement(elm);
	if (attrs) {
		Object.keys(attrs).forEach(attr => {
			if (attr === "name")        return dom.setAttribute('name', attrs.name);
			if (attr === "value")       return dom.value = attrs.value;
			if (attr === "id")          return dom.id = attrs.id;
			if (attr === "class")       return dom.className = attrs.class;
			if (attr === "innerText")   return dom.innerText = attrs.innerText;
			if (attr === "innerHTML")   return dom.innerHTML = attrs.innerHTML;
			if (attr === "textContent") return dom.textContent = attrs.textContent;
			if (attr === "onscroll")    return dom.onscroll = attrs.onscroll;
			if (attr === "onload")      return dom.onload = attrs.onload;
			if (attr === "onready")     return dom.onreadystatechange = attrs.onready;
			if (attr === "onclick")     return dom.onclick = attrs.onclick;
			if (attr === "onkeyup")     return dom.onkeyup = attrs.onkeyup;
			if (attr === "onchange")    return dom.onchange = attrs.onchange;

			if (attr === "onchange")    return dom.onchange = attrs.onchange;
			if (attr === "ondragenter") return dom.ondragenter = attrs.ondragenter;
			if (attr === "ondragover")  return dom.ondragover = attrs.ondragover;
			if (attr === "ondragleave") return dom.ondragleave = attrs.ondragleave;
			if (attr === "ondrop")      return dom.ondrop = attrs.ondrop;

			if (attr === "onkeydown")   return dom.onkeydown = attrs.onkeydown;
			if (attr === "onkeypress")  return dom.onkeypress = attrs.onkeypress;
			if (attr === "oninput")     return dom.oninput = attrs.oninput;
			if (attr === "onfocus")     return dom.onfocus = attrs.onfocus;
			if (attr === "onblur")      return dom.onblur = attrs.onblur;

			if (attr === "href")        return dom.href = attrs.href;
			if (attr === "alt")         return dom.alt = attrs.alt;
			if (attr === "src")         return dom.src = attrs.src;
			if (attr === "file")        return dom.file = attrs.file;
			if (attr === "placeholder") return dom.placeholder = attrs.placeholder;
			if (attr === "style")       return Object.keys(attrs.style).forEach($1 => dom.style[$1] = attrs.style[$1]);
			if (attr === "bgcolor")     return dom.style["background-color"] = attrs.bgcolor;
			if (attr === "set")         return Object.keys(attrs.set).forEach($1 => dom.setAttribute($1, attrs.set[$1]));
		
			if (attr === "checked")     return dom.checked = attrs.checked;
			if (attr === "selected")    return dom.selected = attrs.selected;
			dom.setAttribute(attr, attrs[attr]);
		})
	};
	if (children != null) {
		if (children.length > 0) children.forEach(child => {
			if (child == null) return;
			if (typeof (child) == "object") return dom.appendChild(child);
			dom.innerHTML += child;
		});
	};
	return dom;
};