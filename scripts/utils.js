// 網站通用工具函數

// 防抖函數
function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// 獲取滾動條寬度
function getScrollbarWidth() {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}

// 節流函數
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

// 獲取當前瀏覽器語言
function getBrowserLanguage() {
  return navigator.language || navigator.userLanguage || 'zh-TW';
}

// 檢測設備類型
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

// 檢測是否為觸控設備
function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// 獲取頁面滾動百分比
function getScrollPercentage() {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  return (scrollTop / scrollHeight) * 100;
}

// 平滑滾動到指定元素
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

// 處理外部連結，添加安全屬性
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
  });
}

// 載入腳本
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

// 生成隨機 ID
function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

// 初始化圖片延遲載入
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
    });
  } else {
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

document.addEventListener('DOMContentLoaded', () => {
  setupExternalLinks();
  initLazyLoading();
});
