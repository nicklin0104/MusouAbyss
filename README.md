# Musou Abyss Hero Data Web App (無雙深淵 英傑印記一覽)

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Site-00d2ff?style=for-the-badge&logo=github)](https://nicklin0104.github.io/MusouAbyss/)

🌐 **線上觀看 (Live Demo):** [https://nicklin0104.github.io/MusouAbyss/](https://nicklin0104.github.io/MusouAbyss/)

---

## 🇹🇼 中文說明 (Traditional Chinese)

這是一個為《無雙深淵》打造的高質感專屬英傑印記（Hero Marks）篩選與查詢網頁。
採用零框架 (Zero-framework) 開發，無需伺服器或繁瑣的環境設定，雙擊即可在本機或 GitHub Pages 上完美運行。

### ✨ 核心亮點
* **深色毛玻璃質感設計 (Dark Glassmorphism)**：現代化的 UI 體驗，帶有動態背景光暈與直覺的懸停微動畫。
* **行動裝置優先 (Mobile-First)**：以英雄卡片取代傳統表格，特別為 iPhone 等手機版面呈現最佳化，單手滑動也一目瞭然。
* **動態交集篩選 (Dynamic AND Filter)**：「印記(屬性)」與「印記(特性)」會**全自動**從資料庫抓取並依照自訂分類產生，點選多項標籤能精準呈現符合**所有**條件的英傑。
* **點擊卡片標籤即可篩選**：直接點擊英雄卡片上的迷你標籤，系統便會自動將其加入上方的篩選條件並立即過濾！

### 🚀 如何新增或修改英雄資料？
若您希望新增英雄或修改有錯字的特性，請**不需**修改網頁程式碼。
您只需用任意文字編輯器打開 `data.js`，按照以下格式在該檔案最底下加上新的英雄資料即可：
```javascript
{
    "英傑": "新英雄的名稱",
    "印記(屬性)": "力, 火",
    "印記(特性)": "魏, 猛將, 戰場之花"
}
```
*(注意：與上一位英雄之間必須加上一個逗號 `,`)*
您新增完畢儲存後，刷新網頁，所有新出現的屬性標籤都會自動生成在上方提供篩選！

---

## 🇬🇧 English Description

This is a premium, highly responsive character and mark (traits/attributes) filtering web application specifically built for the "Musou Abyss" game data. 
Built with zero external frameworks, it requires no compilation and runs seamlessly on local environments or GitHub Pages.

### ✨ Key Features
* **Dark Glassmorphism Design**: Experience a modern graphical interface with floating ambient glows, smooth micro-animations, and satisfying hover state feedback.
* **Mobile-First Layout**: Utilizing a card-based grid layout instead of traditional wide tables ensures that navigating details across devices—especially mobile phones—is effortless and beautiful.
* **Dynamic "AND" Tag Filtering**: System automatically scans the database to generate categories. Selecting multiple trait or attribute tags strictly filters the results to heroes possessing **all** selected conditions. 
* **Interactive Hero Cards**: Clicking on any tiny tag integrated directly on the hero cards acts automatically as a filter selection, allowing for ultra-fast data pivoting.

### 🚀 How to Add or Modify Hero Data
To expand your roster or correct typos, **no HTML/JS coding** is necessary.
Simply open `data.js` via any text editor and append your new character using the JSON-like object format at the end:
```javascript
{
    "英傑": "Hero Name",
    "印記(屬性)": "Attribute1, Attribute2",
    "印記(特性)": "Trait1, Trait2"
}
```
*(Note: Remember to separate objects with a comma `,`)*
Once saved, re-open the browser and the web app will auto-parse, inject the cards, and generate corresponding filter tags dynamically.

---

### 💻 Technologies Used
* **HTML5** & **CSS3** (CSS Variables, Flexbox, Grid, Animations)
* **Vanilla JavaScript** (ES6+, DOM Manipulation, Array API)
* Completely static—no Node.js, Webpack, or Vite required!
