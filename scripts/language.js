// 多語言切換功能
document.addEventListener('DOMContentLoaded', () => {
  const LANGUAGES = {
    zh: {
      name: '中文',
      code: 'zh-TW',
    },
    en: {
      name: 'English',
      code: 'en',
    },
  };

  const DEFAULT_LANGUAGE = 'zh';

  let currentLang = localStorage.getItem('language') || DEFAULT_LANGUAGE;

  initLanguageSystem();

  function initLanguageSystem() {
    loadTranslationFile(currentLang).then(() => {
      setLanguage(currentLang);

      const langSwitcher = document.getElementById('lang-switcher');
      const langToggle = document.getElementById('lang-toggle');

      if (langSwitcher || langToggle) {
        updateSwitcherText();

        if (langSwitcher) {
          langSwitcher.addEventListener('click', switchLanguage);
        }

        if (langToggle) {
          langToggle.addEventListener('click', switchLanguage);
        }
      }

      // 初始加載內容
      loadLanguageContent();
    });
  }

  function switchLanguage() {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';

    loadTranslationFile(newLang).then(() => {
      setLanguage(newLang);
      currentLang = newLang;

      localStorage.setItem('language', currentLang);
      updateSwitcherText();
      loadLanguageContent();
    });
  }

  function setLanguage(lang) {
    document.documentElement.lang = LANGUAGES[lang].code;
    document.documentElement.setAttribute('data-language', lang);
  }

  function updateSwitcherText() {
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
      const targetLang = currentLang === 'zh' ? 'en' : 'zh';
      langSwitcher.textContent = LANGUAGES[targetLang].name;

      langSwitcher.setAttribute(
        'aria-label',
        `切換到${LANGUAGES[targetLang].name}`
      );
      langSwitcher.setAttribute('title', `切換到${LANGUAGES[targetLang].name}`);
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      document.querySelectorAll('.lang-toggle-text').forEach((el) => {
        if (el.dataset.lang === currentLang) {
          el.style.display = 'none';
        } else {
          el.style.display = 'inline';
        }
      });
    }
  }

  function loadLanguageContent() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      updateElementContent(el, key);
    });
  }

  function updateElementContent(element, key) {
    if (!key) return;

    const keyParts = key.split('.');
    let value = translations;

    for (const part of keyParts) {
      if (!value || typeof value !== 'object') {
        console.warn(`Translation missing for key: ${key}`);
        return;
      }
      value = value[part];
    }

    if (value) {
      if (element.tagName === 'INPUT' && element.type === 'placeholder') {
        element.placeholder = value;
      } else if (element.tagName === 'META') {
        element.setAttribute('content', value);
      } else if (element.tagName === 'IMG') {
        element.setAttribute('alt', value);
      } else {
        if (value.includes('<') && value.includes('>')) {
          element.innerHTML = value;
        } else {
          element.textContent = value;
        }
      }
    } else {
      console.warn(`Translation missing for key: ${key}`);
    }
  }

  let translations = {};

  async function loadTranslationFile(lang) {
    try {
      const isSubpage = window.location.pathname.includes('/post/');
      const langPath = isSubpage
        ? `../assets/js/lang/${lang}.json`
        : `./assets/js/lang/${lang}.json`;

      const response = await fetch(langPath);

      if (!response.ok) {
        throw new Error(`無法加載語言文件: ${langPath}`);
      }

      translations = await response.json();
      return translations;
    } catch (error) {
      console.error('載入語言文件失敗:', error);
      translations = {};
      return {};
    }
  }
});
