/**
 * main.js
 * 網站主要功能腳本
 * 包含: 導航交互、滾動動畫、返回頂部按鈕
 */

document.addEventListener('DOMContentLoaded', () => {
  // 初始化函數
  initHeader();
  initScrollAnimations();
  initBackToTop();

  // 元素參考
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

  // 頁面頭部和導航邏輯
  function initHeader() {
    const { header, navLinks, mobileMenuToggle, mobileNav } = getElements();

    // 監聽滾動添加/移除滾動狀態類
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
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
            // 平滑滾動到目標區塊
            window.scrollTo({
              top: targetSection.offsetTop - 80,
              behavior: 'smooth',
            });

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

        const isExpanded = mobileMenuToggle.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
      }
    }
  }

  // 滾動相關邏輯
  function initScrollAnimations() {
    const { sections, navLinks, revealElements } = getElements();

    // IntersectionObserver 用於監測元素是否進入視窗
    const observerOptions = {
      root: null, // 視窗
      rootMargin: '-20% 0px -60% 0px',
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
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px',
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

          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }
  }

  //  返回頂部按鈕邏輯
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
