// 控制網站載入時的預加載動畫
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');

  if (!preloader) return;

  const minDisplayTime = 800;
  const startTime = Date.now();

  function hidePreloader() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(minDisplayTime - elapsedTime, 0);

    setTimeout(() => {
      preloader.classList.add('hidden');

      setTimeout(() => {
        preloader.remove();
      }, 600);
    }, remainingTime);
  }

  window.addEventListener('load', hidePreloader);

  setTimeout(() => {
    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
    }
  }, 5000);
});
