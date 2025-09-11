/**
 * figma-showcase.js
 * 控制Figma設計作品的點擊顯示邏輯
 */

document.addEventListener('DOMContentLoaded', function () {
  // 獲取所有APP設計預覽元素
  const designPreviews = document.querySelectorAll('.app-design-preview');
  // 獲取所有Figma嵌入包裝元素
  const figmaWrappers = document.querySelectorAll('.figma-embed-wrapper');
  // 獲取初始提示元素
  const selectPrompt = document.getElementById('select-design-prompt');

  // 為每個設計預覽添加點擊事件
  designPreviews.forEach((preview) => {
    preview.addEventListener('click', function () {
      // 獲取目標ID
      const targetId = this.getAttribute('data-target');

      // 移除所有預覽的活躍狀態
      designPreviews.forEach((p) => p.classList.remove('active'));
      // 添加當前預覽的活躍狀態
      this.classList.add('active');

      // 隱藏所有Figma嵌入
      figmaWrappers.forEach((wrapper) => {
        wrapper.classList.remove('active');
      });

      // 顯示對應的Figma嵌入
      const targetWrapper = document.getElementById(targetId);
      if (targetWrapper) {
        // 隱藏選擇提示
        selectPrompt.classList.add('hidden');

        // 顯示目標Figma嵌入
        targetWrapper.classList.add('active');

        // 檢查是否需要載入Figma內容
        const figmaPlaceholder =
          targetWrapper.querySelector('.figma-placeholder');
        if (figmaPlaceholder) {
          const figmaUrl = figmaPlaceholder.getAttribute('data-figma-url');
          // 創建iframe替換佔位元素
          const iframe = document.createElement('iframe');
          iframe.setAttribute('title', 'Figma Prototype');
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('allowfullscreen', true);
          iframe.setAttribute('src', figmaUrl);
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.style.borderRadius = '8px';

          // 替換佔位元素為iframe
          figmaPlaceholder.parentNode.replaceChild(iframe, figmaPlaceholder);
        }
      }
    });
  });
});
