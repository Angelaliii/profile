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
          // 使用預覽圖片代替iframe嵌入
          const previewImageName =
            figmaPlaceholder.getAttribute('data-preview-image');

          if (previewImageName) {
            // 創建主容器
            const figmaEmbed = document.createElement('div');
            figmaEmbed.className = 'figma-embed-content';

            // 創建預覽圖像
            const img = document.createElement('img');
            img.src = `./assets/img/${previewImageName}`;
            img.alt = 'Figma設計預覽';
            img.className = 'figma-preview-img';

            // 創建覆蓋層
            const overlay = document.createElement('div');
            overlay.className = 'figma-overlay';

            // 添加Figma圖標
            const figmaIcon = document.createElement('div');
            figmaIcon.innerHTML =
              '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 19C19 17.4087 19.6321 15.8826 20.7574 14.7574C21.8826 13.6321 23.4087 13 25 13C26.5913 13 28.1174 13.6321 29.2426 14.7574C30.3679 15.8826 31 17.4087 31 19C31 20.5913 30.3679 22.1174 29.2426 23.2426C28.1174 24.3679 26.5913 25 25 25C23.4087 25 21.8826 24.3679 20.7574 23.2426C19.6321 22.1174 19 20.5913 19 19Z" fill="white"/><path d="M19 31C19 29.4087 19.6321 27.8826 20.7574 26.7574C21.8826 25.6321 23.4087 25 25 25C26.5913 25 28.1174 25.6321 29.2426 26.7574C30.3679 27.8826 31 29.4087 31 31C31 32.5913 30.3679 34.1174 29.2426 35.2426C28.1174 36.3679 26.5913 37 25 37C23.4087 37 21.8826 36.3679 20.7574 35.2426C19.6321 34.1174 19 32.5913 19 31Z" fill="white"/><path d="M7 19C7 17.4087 7.63214 15.8826 8.75736 14.7574C9.88258 13.6321 11.4087 13 13 13C14.5913 13 16.1174 13.6321 17.2426 14.7574C18.3679 15.8826 19 17.4087 19 19C19 20.5913 18.3679 22.1174 17.2426 23.2426C16.1174 24.3679 14.5913 25 13 25C11.4087 25 9.88258 24.3679 8.75736 23.2426C7.63214 22.1174 7 20.5913 7 19Z" fill="white"/><path d="M7 7C7 5.4087 7.63214 3.88258 8.75736 2.75736C9.88258 1.63214 11.4087 1 13 1C14.5913 1 16.1174 1.63214 17.2426 2.75736C18.3679 3.88258 19 5.4087 19 7C19 8.5913 18.3679 10.1174 17.2426 11.2426C16.1174 12.3679 14.5913 13 13 13C11.4087 13 9.88258 12.3679 8.75736 11.2426C7.63214 10.1174 7 8.5913 7 7Z" fill="white"/><path d="M7 31C7 29.4087 7.63214 27.8826 8.75736 26.7574C9.88258 25.6321 11.4087 25 13 25H19V31C19 32.5913 18.3679 34.1174 17.2426 35.2426C16.1174 36.3679 14.5913 37 13 37C11.4087 37 9.88258 36.3679 8.75736 35.2426C7.63214 34.1174 7 32.5913 7 31Z" fill="white"/></svg>';
            figmaIcon.style.marginBottom = '16px';

            // 添加文本信息
            const text = document.createElement('p');
            text.textContent = '點擊在Figma中查看完整設計';
            text.style.fontSize = '16px';
            text.style.marginBottom = '8px';
            text.style.fontWeight = 'bold';

            const subtext = document.createElement('p');
            subtext.textContent = '互動原型將在Figma官方網站打開';
            subtext.style.fontSize = '14px';
            subtext.style.opacity = '0.8';

            // 添加元素到覆蓋層
            overlay.appendChild(figmaIcon);
            overlay.appendChild(text);
            overlay.appendChild(subtext);

            // 點擊跳轉到Figma
            overlay.addEventListener('click', () => {
              window.open(figmaUrl, '_blank');
            });

            // 添加元素到主容器
            figmaEmbed.appendChild(img);
            figmaEmbed.appendChild(overlay);

            // 替換佔位元素
            figmaPlaceholder.parentNode.replaceChild(
              figmaEmbed,
              figmaPlaceholder
            );
          }
        }
      }
    });
  });
});
