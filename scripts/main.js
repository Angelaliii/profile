/**
 * main.js
 * 網站主要功能腳本
 * 包含: 導航交互、滾動動畫、表單處理、返回頂部按鈕
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 初始化函數 ---
  initHeader();
  initScrollAnimations();
  initContactForm();
  initBackToTop();

  // --- 2. 元素參考 ---
  function getElements() {
    return {
      header: document.querySelector('.site-header'),
      sections: document.querySelectorAll('section[id]'),
      navLinks: document.querySelectorAll('.main-nav a'),
      revealElements: document.querySelectorAll('.reveal-on-scroll'),
      backToTopBtn: document.getElementById('back-to-top'),
      mobileMenuToggle: document.querySelector('.menu-toggle'),
      mobileNav: document.querySelector('.main-nav'),
    };
  }

  // --- 3. 頁面頭部和導航邏輯 ---
  function initHeader() {
    const { header, navLinks, mobileMenuToggle, mobileNav } = getElements();

    // 監聽滾動，添加/移除滾動狀態類
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // 平滑滾動導航
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        // 如果是錨點連結
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
            // 平滑滾動到目標區塊
            window.scrollTo({
              top: targetSection.offsetTop - 80, // 減去頂部空間
              behavior: 'smooth',
            });

            // 如果移動裝置選單開啟，關閉它
            if (mobileNav && mobileNav.classList.contains('active')) {
              toggleMobileMenu();
            }
          }
        }
      });
    });

    // 移動裝置選單切換
    if (mobileMenuToggle && mobileNav) {
      mobileMenuToggle.addEventListener('click', toggleMobileMenu);

      function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');

        // 切換 aria-expanded 屬性
        const isExpanded = mobileMenuToggle.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
      }
    }
  }

  // --- 4. 滾動相關邏輯 ---
  function initScrollAnimations() {
    const { sections, navLinks, revealElements } = getElements();

    // IntersectionObserver 用於監測元素是否進入視窗
    const observerOptions = {
      root: null, // 視窗
      rootMargin: '-20% 0px -60% 0px', // 上方20%進入視窗、下方60%進入視窗時觸發
      threshold: 0.1, // 10%可見時觸發
    };

    // 為活動區塊添加活動狀態的觀察器
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 取得當前活動區塊ID
          const activeId = entry.target.getAttribute('id');

          // 更新導航活動狀態
          updateNavigation(activeId);
        }
      });
    }, observerOptions);

    // 監聽所有區塊
    if (sections.length) {
      sections.forEach((section) => {
        sectionObserver.observe(section);
      });
    }

    // 為要顯示的元素添加觀察器
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 當元素進入視窗
          if (entry.isIntersecting) {
            // 獲取延遲值 (如果有)
            const delay = entry.target.getAttribute('data-delay') || 0;

            // 延遲應用可見類
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);

            // 僅觸發一次
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // 15%可見時觸發
        rootMargin: '0px 0px -100px 0px', // 底部偏移，提早觸發
      }
    );

    // 監聽所有要顯示的元素
    if (revealElements.length) {
      revealElements.forEach((el) => {
        revealObserver.observe(el);
      });
    }

    // 更新導航活動狀態
    function updateNavigation(activeId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
          link.classList.add('active');

          // 設置 aria-current
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }
  }

  // --- 5. 聯繫表單邏輯 ---
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // 設置表單提交時間戳
    const formTimeField = document.getElementById('form-time');
    if (formTimeField) {
      formTimeField.value = Date.now();
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formFeedback = document.querySelector('.form-feedback');

      // 檢查蜜罐欄位 (防止機器人)
      const honeypot = document.querySelector('.honey-pot input');
      if (honeypot && honeypot.value) {
        return false; // 蜜罐被填寫，可能是機器人
      }

      // 檢查提交時間 (防止快速提交)
      const submitTime = Date.now();
      const startTime = parseInt(formTimeField.value, 10);
      if (submitTime - startTime < 3000) {
        // 少於3秒
        formFeedback.innerHTML = '請花點時間填寫表單。';
        formFeedback.className = 'form-feedback error';
        return false;
      }

      // 表單數據
      const formData = new FormData(contactForm);

      // 顯示發送中狀態
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = '發送中...';
      submitButton.disabled = true;

      try {
        // 在這裡處理表單提交邏輯
        // 由於示例不使用外部服務，這裡模擬提交成功

        // 模擬 API 延遲
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 成功回饋
        formFeedback.innerHTML = '訊息已成功發送！我會盡快回覆您。';
        formFeedback.className = 'form-feedback success';

        // 重置表單
        contactForm.reset();
      } catch (error) {
        // 失敗回饋
        formFeedback.innerHTML = '發送失敗，請稍後再試或使用其他聯繫方式。';
        formFeedback.className = 'form-feedback error';
        console.error('Form submission error:', error);
      } finally {
        // 恢復按鈕狀態
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // 更新表單時間戳
        formTimeField.value = Date.now();
      }
    });
  }

  // --- 6. 返回頂部按鈕邏輯 ---
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    // 監聽滾動
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    // 點擊返回頂部
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
});
