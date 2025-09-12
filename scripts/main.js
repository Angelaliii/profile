// 網站主要功能腳本
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initScrollAnimations();
  initBackToTop();

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

  function initHeader() {
    const { header, navLinks, mobileMenuToggle, mobileNav } = getElements();

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
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

  function initScrollAnimations() {
    const { sections, navLinks, revealElements } = getElements();

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          updateNavigation(activeId);
        }
      });
    }, observerOptions);

    if (sections.length) {
      sections.forEach((section) => {
        sectionObserver.observe(section);
      });
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;

            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (revealElements.length) {
      revealElements.forEach((el) => {
        revealObserver.observe(el);
      });
    }

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

  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
});
