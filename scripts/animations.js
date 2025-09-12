// 網站動畫效果控制
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();

  function initAnimations() {
    setupEntranceAnimations();
    setupScrollAnimations();
    setupInteractions();
    checkReducedMotion();
  }

  function setupEntranceAnimations() {
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

    timeline.forEach((item) => {
      if (!item.elements.length) return;

      setTimeout(() => {
        item.elements.forEach((el) => {
          el.classList.add('is-visible');
        });
      }, item.delay);
    });
  }

  // 使用 Intersection Observer API 檢測元素進入視窗
  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-in, .scale-in'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;

            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    if (animatedElements.length) {
      animatedElements.forEach((el) => {
        observer.observe(el);
      });
    }

    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length) {
      skillCards.forEach((card, index) => {
        card.setAttribute('data-delay', 100 * index);
        observer.observe(card);
      });
    }

    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length) {
      timelineItems.forEach((item, index) => {
        item.setAttribute('data-delay', 150 * index);
        observer.observe(item);
      });
    }

    const certCards = document.querySelectorAll('.cert-card');
    if (certCards.length) {
      certCards.forEach((card, index) => {
        card.setAttribute('data-delay', 120 * index);
        observer.observe(card);
      });
    }
  }

  function setupInteractions() {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const buttons = document.querySelectorAll('.btn, .nav-link');
    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        btn.classList.add('hover');
      });

      btn.addEventListener('mouseleave', () => {
        btn.classList.remove('hover');
      });
    });

    const cards = document.querySelectorAll('.skill-card, .cert-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
    });

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
          const x = (offsetX / clientWidth - 0.5) * 30;
          const y = (offsetY / clientHeight - 0.5) * 30;
          target.style.transform = `translate(${x}px, ${y}px)`;
        });

        link.addEventListener('mouseleave', (e) => {
          e.target.style.transform = 'translate(0, 0)';
        });
      });
    }
  }

  // 遵循 prefers-reduced-motion 設置
  function checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduced-motion');

      const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in, .scale-in'
      );
      animatedElements.forEach((el) => {
        el.classList.add('is-visible');
      });

      const scrollAnimations = document.querySelectorAll('[data-delay]');
      scrollAnimations.forEach((el) => {
        el.removeAttribute('data-delay');
        el.classList.add('is-visible');
      });
    }
  }
});
