// Get article from URL
const params = new URLSearchParams(window.location.search);
const articleSlug = params.get('article');

// List of articles for navigation
const articles = ['giggle-monster', 'dancing-shoes'];
const currentIndex = articles.indexOf(articleSlug);
const prevSlug = articles[(currentIndex - 1 + articles.length) % articles.length];
const nextSlug = articles[(currentIndex + 1) % articles.length];

// Load article content
fetch(`content/articles/${articleSlug}/${articleSlug}.json`)
  .then(response => response.json())
  .then(article => {
    const app = document.getElementById('article-app');
    const isPortrait = window.innerHeight > window.innerWidth;
    const layoutClass = isPortrait ? 'split-vertical' : 'split-horizontal';
    const textSideColor = Math.random() > 0.5 ? 'light' : 'dark';
    const imageSideColor = textSideColor === 'light' ? 'dark' : 'light';

    app.innerHTML = `
      <div class="split-container ${layoutClass}">
        <div class="text-side ${textSideColor}">
          <h1>${article.title}</h1>
          <p>${article.body}</p>
        </div>
        <div class="image-side ${imageSideColor}">
          <img src="content/articles/${articleSlug}/${article.images[0]}" alt="${article.title}">
        </div>
      </div>
      <div class="nav-arrows">
        <button class="nav-arrow prev" title="Previous story">
          <svg class="nav-arrow-svg" viewBox="0 0 60 60">
            <polyline points="40,10 20,30 40,50" stroke="#111" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-arrow next" title="Next story">
          <svg class="nav-arrow-svg" viewBox="0 0 60 60">
            <polyline points="20,10 40,30 20,50" stroke="#111" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="ad-placeholder">
        <a href="https://freebitco.in/?r=12403380" target="_blank" style="text-decoration:none;color:#222;">
          <strong>💰 Free Bitcoin!<br>Click here to win crypto every hour.<br><span style="font-size:14px;color:#0070f3;">Try your luck &gt;</span></strong>
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

    // Show/hide arrows on hover
    const navArrows = document.querySelector('.nav-arrows');
    navArrows.addEventListener('mouseenter', () => {
      navArrows.classList.add('hovered');
    });
    navArrows.addEventListener('mouseleave', () => {
      navArrows.classList.remove('hovered');
    });
  });
