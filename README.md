# Noteshelf｜我的學習筆記

一個不需要 API Key 的靜態筆記整理網站。支援分類、即時搜尋、筆記內頁與複習問題，能部署在 GitHub Pages。

## 檔案

- `index.html`：頁面外框
- `style.css`：共用設計與響應式排版
- `notes.js`：筆記內容資料
- `app.js`：分類、搜尋與頁面切換功能
- `AGENTS.md`：規定 AI 如何持續新增筆記、維護網站

## 本機預覽

可直接用瀏覽器打開 `index.html`。也可在本機資料夾執行 `python -m http.server 8000`，然後開啟 `http://localhost:8000`。

## 部署到 GitHub Pages

1. 登入 GitHub，建立公開的 Repository（例如 `study-notes-site`）。
2. 上傳本資料夾所有檔案到 Repository 根目錄。
3. 進入 **Settings → Pages**，在 **Build and deployment** 選擇 **Deploy from a branch**。
4. 選擇 `main` 分支、`/(root)`，按 **Save**。
5. 成功部署後，網站網址通常會是 `https://你的帳號.github.io/study-notes-site/`；以 GitHub Pages 實際顯示的網址為準。
6. 如需在頁面右上角顯示自己的專案連結，請把 `index.html` 中的 `https://github.com/` 改成實際 Repository URL。

## 如何新增筆記

先閱讀 `AGENTS.md`，再按照規定把新的物件加到 `notes.js` 的 `window.NOTES` 陣列。頁面、分類和搜尋會自動更新。

## 提醒

目前網站有七篇筆記（包含課堂講義整理與示範內容），來源欄也標明為示範；正式發表自己課堂的筆記時，請核對內容並附上實際參考資料。

## 互動式複習測驗

每篇文章附有 2～3 題單選題，按下「確認答案」後顯示正誤與詳細解析。測驗僅在瀏覽器當下運作，不儲存個資或成績。新增題目請參考 `AGENTS.md` 的 `quiz` 格式。
