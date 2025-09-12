document.addEventListener('DOMContentLoaded', () => {
  // 獲取所有證書卡片
  const certCards = document.querySelectorAll('.cert-card');

  // 為每個證書卡片添加點擊事件
  certCards.forEach((card) => {
    // 卡片整體點擊或查看詳細按鈕點擊都可以觸發彈出視窗
    const handleCardClick = (e) => {
      const certId = card.dataset.certId;
      const modalId = `modal-${certId}`;

      // 使用全局openModal函數打開模態框
      if (window.openModal) {
        window.openModal(modalId);
      }

      // 阻止事件冒泡
      e.stopPropagation();
    };

    // 查看詳細按鈕特別處理
    const viewMoreBtn = card.querySelector('.cert-view-more');
    if (viewMoreBtn) {
      viewMoreBtn.addEventListener('click', handleCardClick);
    }
  });

  // 點擊 ESC 鍵關閉彈出視窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // 獲取所有活動的模態框
      const activeModals = document.querySelectorAll('.modal.active');
      activeModals.forEach((modal) => {
        if (modal.id && window.closeModal) {
          window.closeModal(modal.id);
        }
      });
    }
  });
});
