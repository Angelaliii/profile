/**
 * 預加載器腳本
 * 控制網站載入時的預加載動畫
 */

document.addEventListener('DOMContentLoaded', () => {
  // 獲取預加載器元素
  const preloader = document.getElementById('preloader');

  if (!preloader) return;

  // 設置最短顯示時間 (毫秒)
  const minDisplayTime = 800;
  const startTime = Date.now();

  // 隱藏預加載器函數
  function hidePreloader() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(minDisplayTime - elapsedTime, 0);

    // 確保預加載器至少顯示最短時間
    setTimeout(() => {
      preloader.classList.add('hidden');

      // 完全移除預加載器
      setTimeout(() => {
        preloader.remove();
      }, 600); // 與 CSS 過渡時間相匹配
    }, remainingTime);
  }

  // 頁面載入完成時
  window.addEventListener('load', hidePreloader);

  // 如果頁面載入太久，也要隱藏預加載器
  setTimeout(() => {
    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      // 如果頁面仍在載入，等待完成
      window.addEventListener('load', hidePreloader);
    }
  }, 5000); // 最多等待 5 秒
});
