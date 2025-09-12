/**
 * modal.js
 * 彈出視窗相關功能
 * 包含彈出視窗的開啟、關閉和交互邏輯
 * 使用Portal模式確保彈出視窗正確顯示在堆疊上下文中
 */

document.addEventListener('DOMContentLoaded', () => {
  // 獲取所有彈出視窗元素和遮罩背景
  const modals = document.querySelectorAll('.modal');
  const modalOverlay = document.querySelector('.modal-overlay');

  // 如果頁面中沒有遮罩層，則創建一個
  if (!modalOverlay) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    // 將遮罩層添加到Portal容器而非body
    window.Portal?.getContainer().appendChild(overlay);
  }

  // 為所有關閉按鈕添加事件監聽器
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach((button) => {
    button.addEventListener('click', function () {
      // 找到最近的模態框
      const modal = this.closest('.modal');
      if (modal && modal.id) {
        window.closeModal(modal.id);
      }
    });
  });

  // 點擊遮罩層也關閉模態框
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function () {
      // 關閉所有活動的模態框
      const activeModals = document.querySelectorAll('.modal.active');
      activeModals.forEach((modal) => {
        if (modal.id) {
          window.closeModal(modal.id);
        }
      });
    });
  }

  /**
   * 開啟彈出視窗
   * @param {string} modalId - 要開啟的彈出視窗ID
   */
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.querySelector('.modal-overlay');

    if (!modal || !overlay) return;

    // 保存模態框原始位置，以便稍後恢復
    if (!modal.dataset.originalParent) {
      modal.dataset.originalParent = modal.parentNode
        ? modal.parentNode.id || 'body'
        : 'body';
      modal.dataset.originalPosition = Array.from(
        modal.parentNode?.children || []
      ).indexOf(modal);
    }

    // 紀錄當前滾動位置，便於關閉後恢復
    const scrollPosition = window.pageYOffset;

    // 將模態框移動到Portal容器中
    if (window.Portal && !window.Portal.isInPortal(modal)) {
      window.Portal.append(modal);
    }

    // 確保遮罩層也在Portal容器中
    if (window.Portal && !window.Portal.isInPortal(overlay)) {
      window.Portal.append(overlay);
    }

    // 為了動畫順序，先顯示但不設置 active
    modal.style.display = 'block';
    overlay.style.display = 'block';

    // 強制重繪
    modal.offsetHeight;
    overlay.offsetHeight;

    // 設置模態框樣式
    const windowHeight = window.innerHeight;
    const modalHeight = modal.scrollHeight;

    // 固定模態框定位，確保置中顯示
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%) scale(0.95)';

    // 確保模態框高度合理，可滾動
    if (modalHeight > windowHeight * 0.9) {
      modal.style.maxHeight = windowHeight * 0.9 + 'px';
    }

    // 確保正確的層級關係
    modal.style.zIndex = '1050';
    overlay.style.zIndex = '1000';

    // 然後添加 active 類觸發動畫
    modal.classList.add('active');
    overlay.classList.add('active');

    // 觸發動畫
    modal.style.transform = 'translate(-50%, -50%) scale(1)';
    modal.style.opacity = '1';
    overlay.style.opacity = '1';

    // 防止頁面滾動
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight =
      (typeof getScrollbarWidth === 'function' ? getScrollbarWidth() : 0) +
      'px';

    // 確保模態框內容可滾動，遮罩不可滾動
    modal.style.overflowY = 'auto';
    overlay.style.overflowY = 'hidden';

    // 重置模態框滾動位置
    setTimeout(() => {
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
        // 淡出動畫
        modal.classList.remove('active');
        modal.style.opacity = '0';
        modal.style.transform = 'translate(-50%, -50%) scale(0.95)';

        // 重置彈窗內部滾動位置以便下次打開
        modal.scrollTop = 0;

        // 檢查是否還有其他活動的彈出視窗
        const activeModals = document.querySelectorAll('.modal.active');
        if (activeModals.length === 0 && overlay) {
          overlay.classList.remove('active');
          overlay.style.opacity = '0';

          // 延遲移除顯示，等待淡出動畫完成
          setTimeout(() => {
            // 重置模態框樣式
            modal.style.display = 'none';
            modal.style.maxHeight = '';
            modal.style.transform = '';
            modal.style.position = '';

            // 將模態框移回原始位置
            if (window.Portal && modal.dataset.originalParent) {
              // 從Portal容器中移除
              window.Portal.remove(modal);

              // 如果有原始父元素且不是body，則恢復到原位
              const originalParent =
                modal.dataset.originalParent !== 'body'
                  ? document.getElementById(modal.dataset.originalParent)
                  : document.body;

              if (originalParent) {
                const originalPosition = parseInt(
                  modal.dataset.originalPosition || '0',
                  10
                );

                // 將元素插入到原來的位置
                if (
                  originalPosition >= 0 &&
                  originalPosition < originalParent.children.length
                ) {
                  originalParent.insertBefore(
                    modal,
                    originalParent.children[originalPosition]
                  );
                } else {
                  originalParent.appendChild(modal);
                }
              }
            }

            // 只有當沒有其他模態框開啟時才重置遮罩和頁面滾動
            const currentActiveModals =
              document.querySelectorAll('.modal.active');
            if (currentActiveModals.length === 0) {
              if (overlay) {
                overlay.style.display = 'none';

                // 將遮罩層也移回body
                if (window.Portal) {
                  window.Portal.remove(overlay);
                  document.body.appendChild(overlay);
                }
              }

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

          // 將模態框移回原始位置
          if (window.Portal && modal.dataset.originalParent) {
            // 從Portal容器中移除
            window.Portal.remove(modal);

            // 如果有原始父元素且不是body，則恢復到原位
            const originalParent =
              modal.dataset.originalParent !== 'body'
                ? document.getElementById(modal.dataset.originalParent)
                : document.body;

            if (originalParent) {
              const originalPosition = parseInt(
                modal.dataset.originalPosition || '0',
                10
              );

              // 將元素插入到原來的位置
              if (
                originalPosition >= 0 &&
                originalPosition < originalParent.children.length
              ) {
                originalParent.insertBefore(
                  modal,
                  originalParent.children[originalPosition]
                );
              } else {
                originalParent.appendChild(modal);
              }
            }
          }
        }, 300);
      });

      // 關閉遮罩
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
          overlay.style.display = 'none';

          // 將遮罩層也移回body
          if (window.Portal) {
            window.Portal.remove(overlay);
            document.body.appendChild(overlay);
          }

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
 * 先關閉所有已開啟的模態框，再開啟指定的模態框
 * 這可以避免多個模態框堆疊的問題
 * @param {string} modalId - 要開啟的模態框ID
 */
window.openModalSafely = function (modalId) {
  // 先關閉所有已開啟的模態框
  const activeModals = document.querySelectorAll('.modal.active');
  if (activeModals.length > 0) {
    // 關閉所有活動的模態框
    window.closeModal();

    // 短暫延遲後再開啟新的模態框，讓關閉動畫有時間執行
    setTimeout(() => {
      window.openModal(modalId);
    }, 310); // 略大於關閉動畫時間(300ms)
  } else {
    // 如果沒有已開啟的模態框，直接開啟
    window.openModal(modalId);
  }
};

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

      // 使用安全的開啟函數，確保先關閉其他模態框
      window.openModalSafely(`modal-${certId}`);

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
