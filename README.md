# Musou Abyss Hero Database (無雙深淵 英傑資料庫)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now-success?style=for-the-badge)](https://nicklin0104.github.io/MusouAbyss/)

**A visually stunning, lightweight, and responsive hero filtering database designed for the game "Musou Abyss".**  
**一款專為《無雙深淵》打造的網頁版英傑資料庫，具備精美的毛玻璃特效、流暢的過濾體驗與手機排版優化。**

---

## 🌐 Live Demo / 線上預覽
**[https://nicklin0104.github.io/MusouAbyss/](https://nicklin0104.github.io/MusouAbyss/)**

---

## ⚡ Features / 核心功能

### 🇹🇼 中文簡介
* **極致輕量 (Vanilla JS)**：全專案不使用任何框架（如 React/Vue）與打包工具，將 HTML、CSS 與 JS 切分得乾淨俐落，隨載隨用。
* **深色毛玻璃美學 (Dark Glassmorphism)**：現代化 UI 設計，卡片擁有玻璃擬真背景與動態打光特效。
* **智能篩選與多重過濾**：
  * 屬性與特性進行混合「交集 (AND)」篩選。
  * 卡片上的標籤支援「點擊聯動」，點擊卡片標籤可直接反映到全局篩選條件。
  * **無所屬代理機制**：系統自動在背景將「無所屬」依據勢力分為三國、戰國與其他，並依舊相容廣域的「無所屬(所有)」查詢。
* **異化與突破系統**：
  * **突破印記**：達成突破條件獲得的印記，將以金黃色光暈特效高調呈現。並提供專屬開關決定是否依據突破印記進行嚴謹篩選。
  * **異化英雄**：專屬開關一鍵召喚 (異化) 英雄陣容，預設隱藏以確保版面簡潔。

### 🇺🇸 English Overview
* **Lightweight Architecture**: Built purely with Vanilla JavaScript, HTML5, and CSS3. Zero build steps, zero bloated dependencies.
* **Premium Aesthetics**: Features a modern Dark Glassmorphism UI, breathing dynamic background, and satisfying hover animations.
* **Advanced Multi-Filtering**: 
  * Select multiple attributes and traits utilizing exact AND logic.
  * Clickable tiny-tags on hero cards update the global search queries seamlessly.
  * Complex categorization to seamlessly differentiate between "SanGuo" and "Sengoku" unaffiliated proxy queries.
* **Breakthrough & Altered Systems**:
  * Easily toggle the visibility of special "Altered" (異化) alternative heroes via UI switches.
  * Breakthrough traits feature glowing golden borders and a UI switch that dictates validation rigorousness.

---

## 🛠️ How to Run / 如何在本地運行

Because the project utilizes a strict CORS-friendly `data.js` standard, you can technically run this without any servers!  
只需要兩步即可執行：

1. Clone the repository / 下載專案:
   ```bash
   git clone https://github.com/nicklin0104/MusouAbyss.git
   ```
2. Open `index.html` in your browser / 直接雙擊點開 `index.html` 即可。
   - *Optional:* You can also use a local server like `python -m http.server 8000` to serve the files.

---

## 📝 Maintenance & Data Updates / 資料維護方式

Adding a new hero doesn't require compiling code or database knowledge! The entire hero dataset is stored in `data.js`.  
若想新增或編輯英傑，只需要打開 `data.js`：

```javascript
// Example Hero Entry
{
    "英傑": "周瑜",
    "印記(屬性)": "技, 魅",
    "印記(特性)": "吳, 軍師, 江東猛將"
}
// Note: Trait items enclosed in square brackets in the original data (e.g. [大名]) define Breakthrough traits, 
// which are logically parsed and rendered out dynamically. 
```

**Steps to update (更新步驟)：**
1. 打開 `data.js`。
2. 照著格式輸入新的英傑字典物件。
3. 存檔，重新整理網頁，篩選按鈕與分類便會自動算出頻率並重新生成！

---

## 📱 Mobile Responsive / 行動裝置完美適配
The application uses CSS Grids, Flexbox, and Media Queries to map seamlessly to iOS and Android devices, keeping buttons and hero cards highly touch-friendly!
