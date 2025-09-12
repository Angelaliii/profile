// 實現Portal模式來解決模態框堆疊上下文問題
(function () {
  function createPortalContainer() {
    const portalContainer = document.getElementById('modal-portal');

    if (!portalContainer) {
      const newPortalContainer = document.createElement('div');
      newPortalContainer.id = 'modal-portal';
      newPortalContainer.style.position = 'fixed';
      newPortalContainer.style.zIndex = '9999';
      newPortalContainer.style.top = '0';
      newPortalContainer.style.left = '0';
      newPortalContainer.style.width = '0';
      newPortalContainer.style.height = '0';
      newPortalContainer.style.overflow = 'visible';
      document.body.appendChild(newPortalContainer);
      return newPortalContainer;
    }

    return portalContainer;
  }

  document.addEventListener('DOMContentLoaded', () => {
    createPortalContainer();
  });

  window.Portal = {
    getContainer: createPortalContainer,

    append: function (element) {
      const container = createPortalContainer();
      container.appendChild(element);
      return element;
    },

    remove: function (element) {
      if (element?.parentNode?.id === 'modal-portal') {
        element.parentNode.removeChild(element);
      }
      return element;
    },

    isInPortal: function (element) {
      return element?.parentNode?.id === 'modal-portal';
    },
  };
})();
