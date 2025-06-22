// Get article from URL
const params = new URLSearchParams(window.location.search);
const articleSlug = params.get('article');

// Load article content
fetch(`content/articles/${articleSlug}/${articleSlug}.json`)
  .then(response => response.json())
  .then(article => {
    const app = document.getElementById('article-app');
    
    // Random layout orientation
    const isPortrait = window.innerHeight > window.innerWidth;
    const layoutClass = isPortrait ? 'split-vertical' : 'split-horizontal';
    
    // Random color assignment
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
        <button class="nav-arrow prev">←</button>
        <button class="nav-arrow next">→</button>
      </div>
    `;
    
    // Navigation handlers
    document.querySelector('.prev').addEventListener('click', () => {
      window.location.href = 'article.html?article=dancing-shoes';
    });
    
    document.querySelector('.next').addEventListener('click', () => {
      window.location.href = 'article.html?article=giggle-monster';
    });
  });
