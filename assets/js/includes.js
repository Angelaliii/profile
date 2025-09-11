/**
 * includes.js
 * 用於加載頁面包含檔案（header、footer）並設定活動導航項目
 */

document.addEventListener('DOMContentLoaded', () => {
  // 加載 header
  const headerElement = document.querySelector('#header-include');
  if (headerElement) {
    fetch('./includes/header.html')
      .then((response) => response.text())
      .then((html) => {
        headerElement.innerHTML = html;

        // 設定活動頁面的導航項目
        const path = window.location.pathname;
        const page = path.split('/').pop();

        if (page === 'index.html' || path.endsWith('/')) {
          document.getElementById('nav-home')?.classList.add('active');
        } else if (page === 'about.html') {
          document.getElementById('nav-about')?.classList.add('active');
        } else if (page === 'blog.html') {
          document.getElementById('nav-blog')?.classList.add('active');
        }

        // 語言切換功能已移至 scripts/language.js
      });
  }

  // 加載 footer
  const footerElement = document.querySelector('#footer-include');
  if (footerElement) {
    fetch('./includes/footer.html')
      .then((response) => response.text())
      .then((html) => {
        footerElement.innerHTML = html;

        // 返回頂部按鈕功能已移至 scripts/main.js
      });
  }

  // 處理子頁面的相對路徑
  if (window.location.pathname.includes('/post/')) {
    document
      .querySelectorAll('#header-include a, #footer-include a')
      .forEach((link) => {
        if (link.href.includes('./')) {
          link.href = link.href.replace('./', '../');
        }
      });

    document
      .querySelectorAll('#header-include img, #footer-include img')
      .forEach((img) => {
        if (img.src.includes('./assets/')) {
          img.src = img.src.replace('./assets/', '../assets/');
        }
      });
  }
});

// 語言切換邏輯已移至 scripts/language.js
// 該腳本提供了更完整的多語言支持

// 返回頂部按鈕邏輯 - 移至 scripts/main.js
// 該功能已在 main.js 中實現，這裡不再需要
