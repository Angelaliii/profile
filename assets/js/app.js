/**
 * app.js
 * 包含網站所有互動功能：
 * 1. 滾動動畫 (IntersectionObserver)
 * 2. 磁性按鈕效果
 * 3. 文章列表渲染、搜尋與篩選
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 文章索引 (用於 blog.html) ---
  // 在真實專案中，這可能會由 CMS 或建置工具生成
  const postsIndex = [
    {
      url: './posts/the-art-of-storytelling.html',
      title: '故事的藝術：如何讓你的產品會說話',
      date: '2025-09-08',
      tags: ['設計思考'],
      excerpt:
        '在功能趨同的時代，一個好的故事能讓你的產品脫穎而出。本文探討如何將敘事結構融入使用者體驗設計中...',
    },
    {
      url: './posts/deep-dive-into-css-variables.html',
      title: '深入 CSS 變數：打造可維護的設計系統',
      date: '2025-08-22',
      tags: ['前端開發'],
      excerpt:
        'CSS 自訂屬性（變數）不僅僅是變數。本文將深入探討其動態能力、範疇與在主題切換、元件化中的高級應用...',
    },
    {
      url: './posts/productivity-hacks-for-creators.html',
      title: '創作者的生產力心法：專注、系統與休息',
      date: '2025-07-15',
      tags: ['數位生活'],
      excerpt:
        '本文分享了三種針對數位創作者的生產力提升策略：批次處理、建立個人系統，以及策略性休息...',
    },
  ];

  /**
   * 1. 滾動動畫 - 這部分功能已移至 scripts/animations.js
   * 該腳本提供了更完整的動畫控制功能
   */

  /**
   * 2. 磁性按鈕效果 - 移至 scripts/animations.js
   * 使用統一的動畫控制系統來處理互動效果
   */

  /**
   * 3. 文章列表渲染、搜尋與篩選 (僅在 blog.html 執行)
   */
  if (document.getElementById('posts-list')) {
    const postsListContainer = document.getElementById('posts-list');
    const searchInput = document.getElementById('search-input');
    const tagsContainer = document.getElementById('tags-container');
    const postTemplate = document.getElementById('post-template');
    const noResultsMessage = document.getElementById('no-results');

    let allTags = [...new Set(postsIndex.flatMap((p) => p.tags))];
    let currentFilter = {
      searchTerm: '',
      activeTag: null,
    };

    // 渲染標籤按鈕
    function renderTags() {
      tagsContainer.innerHTML =
        '<button class="tag-btn active" data-tag="all">全部</button>';
      allTags.forEach((tag) => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.dataset.tag = tag;
        btn.textContent = tag;
        tagsContainer.appendChild(btn);
      });
    }

    // 渲染文章列表
    function renderPosts() {
      postsListContainer.innerHTML = '';
      const filteredPosts = postsIndex.filter((post) => {
        const searchMatch =
          post.title.toLowerCase().includes(currentFilter.searchTerm) ||
          post.excerpt.toLowerCase().includes(currentFilter.searchTerm);
        const tagMatch =
          !currentFilter.activeTag ||
          post.tags.includes(currentFilter.activeTag);
        return searchMatch && tagMatch;
      });

      if (filteredPosts.length === 0) {
        noResultsMessage.style.display = 'block';
      } else {
        noResultsMessage.style.display = 'none';
      }

      filteredPosts.forEach((post) => {
        const postElement = postTemplate.content.cloneNode(true);
        const article = postElement.querySelector('article');
        article.querySelector('.post-title a').href = post.url;
        article.querySelector('.post-title a').textContent = post.title;
        article.querySelector('time').textContent = post.date;
        article.querySelector('time').setAttribute('datetime', post.date);
        article.querySelector('.post-excerpt').textContent = post.excerpt;

        const tagsSpan = article.querySelector('.tags');
        post.tags.forEach((tag) => {
          const tagButton = document.createElement('button');
          tagButton.textContent = `#${tag}`;
          tagButton.dataset.tag = tag;
          tagButton.onclick = () => handleTagClick(tag);
          tagsSpan.appendChild(tagButton);
        });

        postsListContainer.appendChild(postElement);
      });
    }

    // 處理搜尋輸入
    searchInput.addEventListener('input', (e) => {
      currentFilter.searchTerm = e.target.value.toLowerCase();
      renderPosts();
    });

    // 處理標籤點擊
    function handleTagClick(tag) {
      if (tag === 'all') {
        currentFilter.activeTag = null;
      } else {
        currentFilter.activeTag = tag;
      }

      document.querySelectorAll('.tag-btn').forEach((btn) => {
        btn.classList.toggle(
          'active',
          btn.dataset.tag === tag ||
            (tag === 'all' && btn.dataset.tag === 'all')
        );
      });
      renderPosts();
    }

    tagsContainer.addEventListener('click', (e) => {
      if (e.target.matches('.tag-btn')) {
        const tag = e.target.dataset.tag;
        handleTagClick(tag);
      }
    });

    // 初始渲染
    renderTags();
    renderPosts();
  }
});
