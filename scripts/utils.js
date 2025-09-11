/**
 * utils.js
 * 網站通用工具函數
 */

/**
 * 防抖函數 - 限制函數在短時間內的重複觸發
 * @param {Function} func - 要執行的函數
 * @param {number} wait - 等待時間（毫秒）
 */
function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * 節流函數 - 限制函數在一定時間內只能執行一次
 * @param {Function} func - 要執行的函數
 * @param {number} limit - 時間限制（毫秒）
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 獲取當前瀏覽器語言
 * @returns {string} 語言代碼（例如 'zh-TW' 或 'en'）
 */
function getBrowserLanguage() {
  return navigator.language || navigator.userLanguage || 'zh-TW';
}

/**
 * 檢測設備類型
 * @returns {string} 'mobile', 'tablet' 或 'desktop'
 */
function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * 檢測是否為觸控設備
 * @returns {boolean} 是否為觸控設備
 */
function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * 獲取頁面滾動百分比
 * @returns {number} 滾動百分比 (0-100)
 */
function getScrollPercentage() {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  return (scrollTop / scrollHeight) * 100;
}

/**
 * 平滑滾動到指定元素
 * @param {string|Element} target - 目標元素或選擇器
 * @param {number} offset - 頂部偏移量（像素）
 */
function scrollToElement(target, offset = 0) {
  const element =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!element) return;

  const targetPosition =
    element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
}

/**
 * 處理外部連結，添加安全屬性
 */
function setupExternalLinks() {
  const externalLinks = document.querySelectorAll(
    'a[href^="http"]:not([href*="' + window.location.hostname + '"])'
  );

  externalLinks.forEach((link) => {
    if (!link.hasAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }

    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
    }

    // 視覺提示外部連結
    if (
      !link.classList.contains('no-external-icon') &&
      !link.querySelector('.external-icon')
    ) {
      const icon = document.createElement('span');
      icon.classList.add('external-icon');
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="M6 1h5v5h-1V2.707L4.354 8.354l-.708-.708L9.293 2H6V1zm-5 1h4v1H2v7h7V7h1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2z"/></svg>';
      link.appendChild(icon);
    }
  });
}

/**
 * 載入腳本
 * @param {string} src - 腳本來源
 * @param {boolean} async - 是否異步載入
 * @returns {Promise} 腳本載入 Promise
 */
function loadScript(src, async = true) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

/**
 * 生成隨機 ID
 * @param {string} prefix - ID 前綴
 * @returns {string} 隨機 ID
 */
function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 初始化圖片延遲載入
 */
function initLazyLoading() {
  // 檢查瀏覽器是否支援原生延遲載入
  if ('loading' in HTMLImageElement.prototype) {
    // 使用原生延遲載入
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
    });
  } else {
    // 回退到 Intersection Observer
    const lazyImages = document.querySelectorAll('img.lazy, [data-src]');
    if (!lazyImages.length) return;

    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;

          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            delete lazyImage.dataset.src;
          }

          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  }
}

// 在 DOMContentLoaded 時初始化通用函數
document.addEventListener('DOMContentLoaded', () => {
  setupExternalLinks();
  initLazyLoading();
});
