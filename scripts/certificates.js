document.addEventListener('DOMContentLoaded', () => {
  const certCards = document.querySelectorAll('.cert-card');

  certCards.forEach((card) => {
    const handleCardClick = (e) => {
      const certId = card.dataset.certId;
      const modalId = `modal-${certId}`;

      if (window.openModal) {
        window.openModal(modalId);
      }

      e.stopPropagation();
    };

    const viewMoreBtn = card.querySelector('.cert-view-more');
    if (viewMoreBtn) {
      viewMoreBtn.addEventListener('click', handleCardClick);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal.active');
      activeModals.forEach((modal) => {
        if (modal.id && window.closeModal) {
          window.closeModal(modal.id);
        }
      });
    }
  });
});
