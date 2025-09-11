/**
 * language.js
 * 多語言切換功能
 * 支援中文和英文界面切換
 */

document.addEventListener('DOMContentLoaded', () => {
  // 語言設定
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

  // 默認語言
  const DEFAULT_LANGUAGE = 'zh';

  // 獲取當前語言或使用默認語言
  let currentLang = localStorage.getItem('language') || DEFAULT_LANGUAGE;

  // 初始化語言切換系統
  initLanguageSystem();

  function initLanguageSystem() {
    // 加載語言文件
    loadTranslationFile(currentLang).then(() => {
      // 設置初始語言
      setLanguage(currentLang);

      // 獲取語言切換按鈕
      const langSwitcher = document.getElementById('lang-switcher');
      const langToggle = document.getElementById('lang-toggle');

      // 如果存在任何一個語言切換按鈕
      if (langSwitcher || langToggle) {
        // 更新語言切換按鈕文字
        updateSwitcherText();

        // 語言切換事件 - langSwitcher
        if (langSwitcher) {
          langSwitcher.addEventListener('click', switchLanguage);
        }

        // 語言切換事件 - langToggle
        if (langToggle) {
          langToggle.addEventListener('click', switchLanguage);
        }
      }

      // 初始加載內容
      loadLanguageContent();
    });
  }

  // 切換語言
  function switchLanguage() {
    // 切換到另一種語言
    const newLang = currentLang === 'zh' ? 'en' : 'zh';

    // 加載新語言文件
    loadTranslationFile(newLang).then(() => {
      setLanguage(newLang);
      currentLang = newLang;

      // 保存語言偏好到 localStorage
      localStorage.setItem('language', currentLang);

      // 更新切換按鈕文字
      updateSwitcherText();

      // 更新頁面內容
      loadLanguageContent();
    });
  }

  // 設置文檔語言
  function setLanguage(lang) {
    document.documentElement.lang = LANGUAGES[lang].code;
    document.documentElement.setAttribute('data-language', lang);
  }

  // 更新語言切換按鈕文字
  function updateSwitcherText() {
    // 處理 langSwitcher
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
      // 顯示切換到的語言名稱 (當前顯示中文，切換按鈕顯示 English)
      const targetLang = currentLang === 'zh' ? 'en' : 'zh';
      langSwitcher.textContent = LANGUAGES[targetLang].name;

      // 設置輔助技術屬性
      langSwitcher.setAttribute(
        'aria-label',
        `切換到${LANGUAGES[targetLang].name}`
      );
      langSwitcher.setAttribute('title', `切換到${LANGUAGES[targetLang].name}`);
    }

    // 處理 langToggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      // 更新語言切換按鈕顯示
      document.querySelectorAll('.lang-toggle-text').forEach((el) => {
        if (el.dataset.lang === currentLang) {
          el.style.display = 'none';
        } else {
          el.style.display = 'inline';
        }
      });
    }
  }

  // 載入語言內容
  function loadLanguageContent() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      updateElementContent(el, key);
    });
  }

  // 更新元素內容
  function updateElementContent(element, key) {
    if (!key) return;

    // 處理多層次的鍵值
    const keyParts = key.split('.');
    let value = translations;

    // 遍歷鍵值層次
    for (const part of keyParts) {
      if (!value || typeof value !== 'object') {
        console.warn(`Translation missing for key: ${key}`);
        return;
      }
      value = value[part];
    }

    if (value) {
      // 判斷是否為HTML內容或純文本
      if (element.tagName === 'INPUT' && element.type === 'placeholder') {
        element.placeholder = value;
      } else if (element.tagName === 'META') {
        element.setAttribute('content', value);
      } else if (element.tagName === 'IMG') {
        element.setAttribute('alt', value);
      } else {
        // 檢查是否需要更新HTML或文本內容
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

  // 翻譯數據存儲
  let translations = {};

  /**
   * 載入語言文件
   * @param {string} lang - 語言代碼
   * @returns {Promise} - 加載完成的 Promise
   */
  async function loadTranslationFile(lang) {
    try {
      // 確定語言文件路徑，處理子頁面情況
      const isSubpage = window.location.pathname.includes('/post/');
      const langPath = isSubpage
        ? `../assets/js/lang/${lang}.json`
        : `./assets/js/lang/${lang}.json`;

      // 載入語言文件
      const response = await fetch(langPath);

      if (!response.ok) {
        throw new Error(`無法加載語言文件: ${langPath}`);
      }

      translations = await response.json();
      return translations;
    } catch (error) {
      console.error('載入語言文件失敗:', error);
      // 回退到空對象，避免錯誤
      translations = {};
      return {};
    }
  }
});
