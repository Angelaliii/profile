# 個人品牌部落格 - 純前端實作

這是一個基於純 HTML, CSS, 和原生 JavaScript 打造的現代化個人部落格。它完全為靜態部署而設計，特別是針對 GitHub Pages，無需任何後端或建置流程。

## 特色

- **純靜態**: 無需伺服器，可部署在任何靜態主機上。
- **響應式設計**: 在桌面、平板和手機上都有良好的閱讀體驗。
- **暗黑/亮色模式**: 根據使用者系統偏好自動切換，並提供手動切換按鈕。
- **高效能**: 優化的資源載入，以達成優異的 Lighthouse 分數。
- **無障礙 (A11Y)**: 遵循 WCAG 標準，提供語義化標籤與鍵盤導覽支持。
- **SEO 友好**: 為每頁提供完整的 Meta 標籤、JSON-LD 結構化資料與 `sitemap.xml`。
- **客製化**: 使用 CSS 變數，輕鬆修改品牌色彩與字體。
- **零依賴**: 未使用任何外部框架或函式庫。

## 部署步驟 (GitHub Pages)

1.  **建立新的 GitHub Repository**:

    - 在 GitHub 上建立一個新的公開儲存庫，建議命名為 `your-username.github.io` 以作為您的使用者網站，或者使用任何您喜歡的名稱。

2.  **上傳檔案**:

    - 將此專案的所有檔案和資料夾推送到您剛建立的儲存庫中。
    - 在推送前，請務必將程式碼中所有的 `your-username` 替換為您的 GitHub 使用者名稱，將 `your-email@example.com` 替換為您的電子郵件地址。

3.  **啟用 GitHub Pages**:

    - 進入儲存庫的 `Settings` > `Pages` 頁面。
    - 在 "Build and deployment" 下，將 `Source` 設置為 `Deploy from a branch`。
    - 在 "Branch" 下，選擇 `main` (或您的主要分支) 以及 `/ (root)` 資料夾。
    - 點擊 `Save`。

4.  **等待部署**:

    - GitHub Actions 將會開始部署您的網站。幾分鐘後，您的部落格應該就可以在 `https://your-username.github.io/` 或 `https://your-username.github.io/your-repo-name/` 上訪問了。

5.  **(選填) 自訂網域**:
    - 如果您有自己的網域，可以在 `Settings` > `Pages` 的 "Custom domain" 欄位中輸入您的網域名稱。
    - 您需要在您的網域提供商處設定 CNAME 或 A 記錄，指向 `your-username.github.io`。
    - 如果您使用自訂網域，可以建立一個名為 `CNAME` 的檔案，內容為您的網域名稱（例如 `blog.yourdomain.com`），並將其放在儲存庫的根目錄。

## 維護與客製化指南

這套部落格的設計旨在讓內容更新與風格客製化盡可能簡單。首先，要新增一篇文章，您只需在 `/posts/` 資料夾中建立一個新的 HTML 檔案，複製現有文章的結構，並替換其中的標題、日期、內容與元資料。接著，打開 `/assets/js/app.js` 檔案，在 `postsIndex` 陣列中加入對應新文章的物件，包含其 URL、標題、日期、標籤和摘要，這樣文章列表頁面就能自動索引到您的新作。若要調整網站的視覺風格，例如更換品牌色或字體，請編輯 `/assets/css/styles.css` 檔案。在檔案頂部的 `:root` 選擇器中，您可以找到 `--color-brand` 等 CSS 變數，直接修改這些變數的值，就能全站套用新的色彩配置。同樣地，修改 `--font-family-base` 變數即可更換網站的預設字體，前提是您已在 HTML 的 `<head>` 中引入了對應的 Google Fonts 連結。擴充標籤系統也相當直觀，在 `postsIndex` 中為文章指定新的標籤名稱後，文章列表頁的篩選器便會自動出現該標籤
