const params = new URLSearchParams(window.location.search);
const articleSlug = params.get('article');

// List of articles for navigation
const articles = ['giggle-monster', 'dancing-shoes'];
const currentIndex = articles.indexOf(articleSlug);
const prevSlug = articles[(currentIndex - 1 + articles.length) % articles.length];
const nextSlug = articles[(currentIndex + 1) % articles.length];

fetch(`content/articles/${articleSlug}/${articleSlug}.json`)
  .then(response => response.json())
  .then(article => {
    const app = document.getElementById('article-app');
    // Randomize which side is text/image and which is light/dark
    const isPortrait = window.innerHeight > window.innerWidth;
    const layoutClass = isPortrait ? 'split-vertical' : 'split-horizontal';
    const textFirst = Math.random() > 0.5;
    const textSideColor = Math.random() > 0.5 ? 'light' : 'dark';
    const imageSideColor = textSideColor === 'light' ? 'dark' : 'light';

    let textDiv = `<div class="text-side ${textSideColor}">
      <h1>${article.title}</h1>
      <p>${article.body}</p>
    </div>`;
    let imageDiv = `<div class="image-side ${imageSideColor}">
      <img src="content/articles/${articleSlug}/${article.images[0]}" alt="${article.title}">
    </div>`;

    app.innerHTML = `
      <div class="split-container ${layoutClass}">
        ${textFirst ? textDiv + imageDiv : imageDiv + textDiv}
      </div>
      <div class="nav-arrows">
        <button class="nav-arrow prev" title="Previous story">
          <svg class="nav-arrow-svg" viewBox="0 0 70 70">
            <polyline points="45,10 25,35 45,60" stroke="#111" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-arrow next" title="Next story">
          <svg class="nav-arrow-svg" viewBox="0 0 70 70">
            <polyline points="25,10 45,35 25,60" stroke="#111" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="ad-placeholder">
        <a href="https://freebitco.in/?r=12403380" target="_blank">
          <strong>💰 Free Bitcoin!<br>Click here to win crypto every hour.<br>
          <span>Try your luck &gt;</span></strong>
        </a>
      </div>
    `;

    // Navigation handlers
    document.querySelector('.prev').addEventListener('click', () => {
      window.location.href = `article.html?article=${prevSlug}`;
    });
    document.querySelector('.next').addEventListener('click', () => {
      window.location.href = `article.html?article=${nextSlug}`;
    });
  });
