/**
 * portal.js
 * 實現Portal模式來解決模態框堆疊上下文問題
 * 將模態框和遮罩層移到body直接子元素，避免受父元素transform、opacity等屬性影響
 */

(function () {
  // 創建Portal容器
  function createPortalContainer() {
    const portalContainer = document.getElementById('modal-portal');

    if (!portalContainer) {
      const newPortalContainer = document.createElement('div');
      newPortalContainer.id = 'modal-portal';
      // 確保Portal容器始終在頁面頂層
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

  // 確保Portal容器存在
  document.addEventListener('DOMContentLoaded', () => {
    createPortalContainer();
  });

  // 公開API
  window.Portal = {
    // 獲取或創建Portal容器
    getContainer: createPortalContainer,

    // 將元素移動到Portal容器
    append: function (element) {
      const container = createPortalContainer();
      container.appendChild(element);
      return element;
    },

    // 從Portal容器移除元素
    remove: function (element) {
      if (
        element &&
        element.parentNode &&
        element.parentNode.id === 'modal-portal'
      ) {
        element.parentNode.removeChild(element);
      }
      return element;
    },

    // 檢查元素是否在Portal容器中
    isInPortal: function (element) {
      return (
        element &&
        element.parentNode &&
        element.parentNode.id === 'modal-portal'
      );
    },
  };
})();
