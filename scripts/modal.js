/**
 * modal.js
 * 彈出視窗相關功能
 * 包含彈出視窗的開啟、關閉和交互邏輯
 */

document.addEventListener('DOMContentLoaded', () => {
  // 獲取所有彈出視窗元素和遮罩背景
  const modals = document.querySelectorAll('.modal');
  const modalOverlay = document.querySelector('.modal-overlay');

  // 如果頁面中沒有遮罩層，則創建一個
  if (!modalOverlay) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  /**
   * 開啟彈出視窗
   * @param {string} modalId - 要開啟的彈出視窗ID
   */
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.querySelector('.modal-overlay');

    if (!modal || !overlay) return;

    // 儲存目前滾動位置，避免彈出視窗後滾動位置丟失
    const scrollPosition = window.pageYOffset;

    // 為了動畫順序，先顯示但不設置 active
    modal.style.display = 'block';
    overlay.style.display = 'block';

    // 強制重繪
    modal.offsetHeight;

    // 設置modal高度相關樣式
    // 如果模態框內容超過視窗高度，設置滾動
    const windowHeight = window.innerHeight;
    const modalHeight = modal.offsetHeight;

    if (modalHeight > windowHeight * 0.9) {
      modal.style.height = windowHeight * 0.9 + 'px';
      modal.style.overflowY = 'auto';
    } else {
      modal.style.height = 'auto';
      modal.style.overflowY = 'visible';
    }

    // 然後添加 active 類觸發動畫
    modal.classList.add('active');
    overlay.classList.add('active');

    // 防止頁面滾動
    document.body.style.overflow = 'hidden';
    // 為了防止位移，添加右側內邊距替代滾動條寬度
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
    // 確保彈窗內容可滾動
    modal.style.overflowY = 'auto';

    // 確保模態框置頂並置中
    setTimeout(() => {
      // 重置modal的滾動位置到頂部
      modal.scrollTop = 0;
    }, 10);
  };

  /**
   * 關閉彈出視窗
   * @param {string} modalId - 要關閉的彈出視窗ID，如果不提供則關閉所有
   */
  window.closeModal = function (modalId) {
    const overlay = document.querySelector('.modal-overlay');

    if (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');

        // 重置彈窗內部滾動位置以便下次打開
        modal.scrollTop = 0;

        // 重置modal樣式
        modal.style.height = '';

        // 檢查是否還有其他活動的彈出視窗
        const activeModals = document.querySelectorAll('.modal.active');
        if (activeModals.length === 0 && overlay) {
          overlay.classList.remove('active');

          // 延遲移除顯示，等待淡出動畫完成
          setTimeout(() => {
            modal.style.display = 'none';
            if (activeModals.length === 0) {
              overlay.style.display = 'none';
              // 恢復頁面滾動
              document.body.style.overflow = '';
              document.body.style.paddingRight = '0';
            }
          }, 300); // 與 CSS 過渡時間相匹配
        }
      }
    } else {
      // 關閉所有彈出視窗
      const activeModals = document.querySelectorAll('.modal.active');
      activeModals.forEach((modal) => {
        modal.classList.remove('active');

        // 延遲移除顯示
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      });

      // 關閉遮罩
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
          overlay.style.display = 'none';
          // 恢復頁面滾動
          document.body.style.overflow = '';
          document.body.style.paddingRight = '0';
        }, 300);
      }
    }
  };

  /**
   * 獲取滾動條寬度
   * @returns {number} 滾動條寬度
   */
  function getScrollbarWidth() {
    // 創建一個帶滾動條的 div
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    // 創建內部 div
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // 計算滾動條寬度
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // 清理
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  // 點擊 ESC 鍵關閉彈出視窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // 點擊遮罩背景關閉彈出視窗
  document.querySelector('.modal-overlay')?.addEventListener('click', () => {
    closeModal();
  });

  // 為所有關閉按鈕添加事件
  document.querySelectorAll('.modal-close').forEach((closeBtn) => {
    const modal = closeBtn.closest('.modal');
    if (modal) {
      closeBtn.addEventListener('click', () => {
        closeModal(modal.id);
      });
    }
  });

  // 防止點擊彈出視窗內容時關閉視窗
  document.querySelectorAll('.modal-content').forEach((content) => {
    content.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // 添加modal內滾動功能，防止滾動事件傳播到body
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('wheel', (e) => {
      // 如果modal內容高度大於modal高度，阻止事件傳播
      if (modal.scrollHeight > modal.clientHeight) {
        e.stopPropagation();
      }
    });
  });
});

/**
 * 證照卡片特定的初始化
 */
document.addEventListener('DOMContentLoaded', () => {
  // 獲取所有證書卡片
  const certCards = document.querySelectorAll('.cert-card');

  // 為每個證書卡片添加點擊事件
  certCards.forEach((card) => {
    // 卡片整體點擊或查看詳細按鈕點擊都可以觸發彈出視窗
    const handleCardClick = (e) => {
      const certId = card.dataset.certId;
      if (!certId) return;

      // 打開對應的彈出視窗
      window.openModal(`modal-${certId}`);

      // 獲取對應modal元素並確保其可見
      const modal = document.getElementById(`modal-${certId}`);
      if (modal) {
        // 確保modal完全顯示在視窗中，即使內容很長
        setTimeout(() => {
          // 重置modal的滾動位置到頂部
          modal.scrollTop = 0;

          // 如果modal內容超出視窗高度，確保可滾動
          if (modal.scrollHeight > modal.clientHeight) {
            modal.style.overflowY = 'auto';
          }
        }, 50);
      }

      // 阻止事件冒泡
      e.stopPropagation();
    };

    // 整張卡片可點擊
    card.addEventListener('click', handleCardClick);

    // 查看詳細按鈕特別處理
    const viewMoreBtn = card.querySelector('.cert-view-more');
    if (viewMoreBtn) {
      viewMoreBtn.addEventListener('click', handleCardClick);
    }
  });
});
