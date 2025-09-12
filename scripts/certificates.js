document.addEventListener('DOMContentLoaded', () => {
  // 獲取所有證書卡片和彈出視窗元素
  const certCards = document.querySelectorAll('.cert-card');
  const certOverlay = document.querySelector('.cert-overlay');
  const certModals = document.querySelectorAll('.cert-modal');

  // 關閉所有彈出視窗的函數
  const closeAllModals = () => {
    certModals.forEach((modal) => {
      modal.classList.remove('active');
    });
    certOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // 為每個證書卡片添加點擊事件
  certCards.forEach((card) => {
    // 卡片整體點擊或查看詳細按鈕點擊都可以觸發彈出視窗
    const handleCardClick = (e) => {
      const certId = card.dataset.certId;
      const modal = document.getElementById(`cert-modal-${certId}`);

      if (!modal) return;

      // 打開對應的彈出視窗
      modal.classList.add('active');
      certOverlay.classList.add('active');

      // 防止頁面滾動
      document.body.style.overflow = 'hidden';

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

  // 關閉按鈕事件
  document.querySelectorAll('.cert-modal-close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', closeAllModals);
  });

  // 點擊遮罩背景也可以關閉彈出視窗
  certOverlay.addEventListener('click', closeAllModals);

  // 點擊 ESC 鍵關閉彈出視窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // 防止點擊彈出視窗內容時關閉視窗
  certModals.forEach((modal) => {
    modal
      .querySelector('.cert-modal-content')
      .addEventListener('click', (e) => {
        e.stopPropagation();
      });
  });
});
