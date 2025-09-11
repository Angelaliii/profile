/**
 * animations.js
 * 網站動畫效果控制
 * 提供優雅的進場動畫、滾動效果和互動元素
 */

document.addEventListener('DOMContentLoaded', () => {
  // 初始化所有動畫
  initAnimations();

  function initAnimations() {
    // 設置進場動畫
    setupEntranceAnimations();

    // 設置滾動觸發動畫
    setupScrollAnimations();

    // 設置互動效果
    setupInteractions();

    // 檢查減少動畫偏好設置
    checkReducedMotion();
  }

  /**
   * 設置頁面載入時的進場動畫
   */
  function setupEntranceAnimations() {
    // 頁面載入時的動畫序列
    const timeline = [
      { elements: document.querySelectorAll('.site-header'), delay: 0 },
      { elements: document.querySelectorAll('.hero-content h1'), delay: 300 },
      { elements: document.querySelectorAll('.hero-content h2'), delay: 500 },
      { elements: document.querySelectorAll('.hero-content p'), delay: 700 },
      {
        elements: document.querySelectorAll('.hero-content .cta-btn'),
        delay: 900,
      },
    ];

    // 逐一應用動畫
    timeline.forEach((item) => {
      if (!item.elements.length) return;

      setTimeout(() => {
        item.elements.forEach((el) => {
          el.classList.add('is-visible');
        });
      }, item.delay);
    });
  }

  /**
   * 設置滾動觸發的動畫
   * 使用 Intersection Observer API 檢測元素進入視窗
   */
  function setupScrollAnimations() {
    // 獲取所有帶有滾動動畫類的元素
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-in, .scale-in'
    );

    // 創建觀察者
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 當元素進入視窗
          if (entry.isIntersecting) {
            // 獲取延遲值 (如果有)
            const delay = entry.target.getAttribute('data-delay') || 0;

            // 應用動畫類
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);

            // 只觸發一次
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // 15% 可見時觸發
        rootMargin: '0px 0px -10% 0px', // 底部偏移 10%，提前觸發
      }
    );

    // 監聽所有動畫元素
    if (animatedElements.length) {
      animatedElements.forEach((el) => {
        observer.observe(el);
      });
    }

    // 對技能卡片應用延遲序列
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length) {
      skillCards.forEach((card, index) => {
        // 每張卡片延遲 100ms * 索引
        card.setAttribute('data-delay', 100 * index);
        observer.observe(card);
      });
    }

    // 對時間軸項目應用延遲序列
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length) {
      timelineItems.forEach((item, index) => {
        // 每個項目延遲 150ms * 索引
        item.setAttribute('data-delay', 150 * index);
        observer.observe(item);
      });
    }

    // 對證書卡片應用延遲序列
    const certCards = document.querySelectorAll('.cert-card');
    if (certCards.length) {
      certCards.forEach((card, index) => {
        // 每張卡片延遲 120ms * 索引
        card.setAttribute('data-delay', 120 * index);
        observer.observe(card);
      });
    }
  }

  /**
   * 設置互動元素的動畫效果
   */
  function setupInteractions() {
    // 檢查是否偏好減少動畫
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // 按鈕懸停效果
    const buttons = document.querySelectorAll('.btn, .nav-link');
    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        btn.classList.add('hover');
      });

      btn.addEventListener('mouseleave', () => {
        btn.classList.remove('hover');
      });
    });

    // 卡片懸停效果
    const cards = document.querySelectorAll('.skill-card, .cert-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
    });

    // 為技能圖標添加動畫
    const skillIcons = document.querySelectorAll('.skill-icon');
    skillIcons.forEach((icon) => {
      icon.addEventListener('mouseenter', () => {
        icon.classList.add('pulse');
      });

      icon.addEventListener('mouseleave', () => {
        icon.classList.remove('pulse');
      });
    });

    // 磁性按鈕效果
    if (!reduceMotion) {
      const magneticLinks = document.querySelectorAll('.magnetic-link');

      magneticLinks.forEach((link) => {
        link.addEventListener('mousemove', (e) => {
          const { offsetX, offsetY, target } = e;
          const { clientWidth, clientHeight } = target;
          const x = (offsetX / clientWidth - 0.5) * 30; // 30是移動強度
          const y = (offsetY / clientHeight - 0.5) * 30;
          target.style.transform = `translate(${x}px, ${y}px)`;
        });

        link.addEventListener('mouseleave', (e) => {
          e.target.style.transform = 'translate(0, 0)';
        });
      });
    }
  }

  /**
   * 檢查使用者是否偏好減少動畫
   * 遵循 prefers-reduced-motion 設置
   */
  function checkReducedMotion() {
    // 檢查是否偏好減少動畫
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // 如果使用者偏好減少動畫，停用所有動畫
      document.documentElement.classList.add('reduced-motion');

      // 移除所有等待動畫的類
      const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in, .scale-in'
      );
      animatedElements.forEach((el) => {
        el.classList.add('is-visible');
      });

      // 關閉滾動動畫
      const scrollAnimations = document.querySelectorAll('[data-delay]');
      scrollAnimations.forEach((el) => {
        el.removeAttribute('data-delay');
        el.classList.add('is-visible');
      });
    }
  }
});
