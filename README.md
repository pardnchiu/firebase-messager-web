# Firebase Messager

透過 **Firebase** 在 **靜態網頁 (Static Web)** 上打造 **即時訊息 (Realtime Messaging)** 功能

<br>

### 介紹

- 名稱: [Firebase Messager (Web ver.)](https://pardnchiu.github.io/firebase-messager-web/)
- 開發: [Pardn Chiu](https://facebook.com/chiuchingwei) / [信箱](mailto:chiuchingwei@icloud.com)
- 授權: [MIT License](./LICENSE)

<br>

### 引用

- 存儲: [Firebase JS 9.8.1](https://firebase.google.com/docs/web/setup)
- 圖示: [Font Awesome 5.1](https://fontawesome.com)
- 頭像: [Free Userpics Pack](https://userpics.craftwork.design)
- 圖片: [Unsplash]()

<br>

### 預覽

| 註冊／登入 |
| --- |
| ![login](./preview/login.png)

| 收件匣 |
| --- |
| ![page-inbox](./preview/page-inbox.png)

| 已封鎖 |
| --- |
| ![page-block](./preview/page-block.png)

| 更換頭像 |
| --- |
| ![head-change](./preview/head-change.png)

<br>

### 附註

本機測試 CORS 問題

- Safari 
  ```
  停用本機檔案讀取限制
  ```
- Chrome (Mac)
  ```
  open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
  ```
- Chrome (Windows)
  ```
  "[PATH_TO_CHROME]\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp
  ```
- Chrome (Linux)
  ```
  google-chrome --disable-web-security
  ```

<br>

### Firebase 導入教學

| 進入專案頁面 |
| --- |
| ![project-index](./preview/project-index.png) |

| 拷貝專案資訊 |
| --- |
| ![project-index](./preview/copy-data.png) |

| 貼上專案資訊 |
| --- |
| ![project-index](./preview/paste-data.png) |

<br>

Copyright (c) 2022 [Pardn Ltd 帕登國際有限公司](mailto:mail@pardn.ltd)