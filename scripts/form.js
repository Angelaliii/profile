/**
 * 表單相關功能
 * 包含表單驗證、提交處理和回饋
 */

document.addEventListener('DOMContentLoaded', () => {
  // 初始化所有表單
  initForms();

  function initForms() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // 實時表單驗證
    enableLiveValidation(contactForm);

    // 防止表單濫用
    setupSpamProtection(contactForm);

    // 表單提交事件
    handleFormSubmission(contactForm);
  }

  /**
   * 實時表單驗證
   * 在使用者離開輸入欄位後驗證
   */
  function enableLiveValidation(form) {
    // 獲取所有必填輸入欄位
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    // 為每個欄位添加驗證
    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        // 移除之前的錯誤訊息
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
          existingError.remove();
        }

        // 檢查欄位是否有效
        if (!input.validity.valid) {
          // 顯示適當的錯誤訊息
          const errorMsg = getErrorMessage(input);
          const errorElement = document.createElement('span');
          errorElement.className = 'field-error';
          errorElement.textContent = errorMsg;
          input.parentNode.appendChild(errorElement);

          // 標記為無效
          input.classList.add('invalid');
          input.setAttribute('aria-invalid', 'true');
        } else {
          // 標記為有效
          input.classList.remove('invalid');
          input.removeAttribute('aria-invalid');
        }
      });

      // 當使用者開始輸入時，移除錯誤狀態
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');

        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
          existingError.remove();
        }
      });
    });
  }

  /**
   * 根據驗證問題獲取錯誤訊息
   */
  function getErrorMessage(input) {
    const validity = input.validity;

    if (validity.valueMissing) {
      return '此欄位為必填';
    } else if (validity.typeMismatch) {
      if (input.type === 'email') {
        return '請輸入有效的電子郵件地址';
      }
      return '請輸入正確格式的資料';
    } else if (validity.tooShort) {
      return `請至少輸入 ${input.minLength} 個字`;
    } else if (validity.tooLong) {
      return `請不要超過 ${input.maxLength} 個字`;
    } else if (validity.patternMismatch) {
      return '請符合所需的格式';
    }

    return '此欄位無效';
  }

  /**
   * 設置防止垃圾訊息提交的措施
   */
  function setupSpamProtection(form) {
    // 添加表單時間戳欄位
    const timeField = document.createElement('input');
    timeField.type = 'hidden';
    timeField.id = 'form-time';
    timeField.name = 'form_time';
    timeField.value = Date.now();
    form.appendChild(timeField);

    // 添加蜜罐欄位 (機器人陷阱)
    const honeyPotContainer = document.createElement('div');
    honeyPotContainer.className = 'honey-pot';
    honeyPotContainer.style.cssText =
      'opacity: 0; position: absolute; top: 0; left: 0; height: 0; width: 0; z-index: -1;';

    const honeyPotInput = document.createElement('input');
    honeyPotInput.type = 'text';
    honeyPotInput.name = 'website';
    honeyPotInput.autocomplete = 'off';
    honeyPotInput.tabIndex = -1;
    honeyPotInput.setAttribute('aria-hidden', 'true');

    honeyPotContainer.appendChild(honeyPotInput);
    form.appendChild(honeyPotContainer);
  }

  /**
   * 處理表單提交
   */
  function handleFormSubmission(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 確認所有欄位有效
      if (!form.checkValidity()) {
        // 觸發瀏覽器內置驗證
        form.reportValidity();
        return false;
      }

      const formFeedback = form.querySelector('.form-feedback');

      // 檢查蜜罐欄位
      const honeypot = form.querySelector('.honey-pot input');
      if (honeypot && honeypot.value) {
        // 靜默拒絕，不顯示錯誤
        formFeedback.innerHTML = '訊息已發送，謝謝！';
        formFeedback.className = 'form-feedback success';
        return false;
      }

      // 檢查提交時間（防止快速自動提交）
      const submitTime = Date.now();
      const timeField = document.getElementById('form-time');
      const startTime = parseInt(timeField.value, 10);
      if (submitTime - startTime < 3000) {
        // 少於3秒
        formFeedback.innerHTML = '請花點時間填寫表單。';
        formFeedback.className = 'form-feedback error';
        return false;
      }

      // 收集表單數據
      const formData = new FormData(form);

      // 顯示發送中狀態
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = '發送中...';
      submitButton.disabled = true;

      try {
        // 在此處理表單提交邏輯
        // 在實際專案中，這裡會發送到伺服器或API端點

        // 模擬 API 延遲
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 模擬成功回應
        const success = true; // 在實際專案中，這將基於API響應

        if (success) {
          // 成功回饋
          formFeedback.innerHTML = '訊息已成功發送！我會盡快回覆您。';
          formFeedback.className = 'form-feedback success';

          // 重置表單
          form.reset();

          // 滾動到回饋訊息
          formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('提交失敗');
        }
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
        timeField.value = Date.now();
      }
    });
  }
});
