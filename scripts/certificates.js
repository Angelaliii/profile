document.addEventListener('DOMContentLoaded', () => {
  // 獲取所有證書卡片
  const certCards = document.querySelectorAll('.cert-card');

  // 為每個證書卡片添加點擊事件
  certCards.forEach((card) => {
    const viewMoreBtn = card.querySelector('.cert-view-more');
    if (!viewMoreBtn) return;

    viewMoreBtn.addEventListener('click', () => {
      // 檢查卡片是否已經展開
      const isExpanded = card.classList.contains('expanded');

      // 如果需要，先關閉所有展開的卡片
      document
        .querySelectorAll('.cert-card.expanded')
        .forEach((expandedCard) => {
          if (expandedCard !== card) {
            expandedCard.classList.remove('expanded');
            const icon = expandedCard.querySelector('.cert-view-more-icon');
            if (icon) icon.textContent = '▼';
          }
        });

      // 切換當前卡片的展開狀態
      card.classList.toggle('expanded');

      // 更新查看更多按鈕的圖示
      const icon = card.querySelector('.cert-view-more-icon');
      if (icon) {
        icon.textContent = isExpanded ? '▼' : '▲';
      }

      // 滾動到展開的卡片
      if (!isExpanded) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300); // 等待動畫完成後滾動
      }
    });
  });
});
