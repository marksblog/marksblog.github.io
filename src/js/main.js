// Load articles on homepage
fetch('content/articles/index.json')
  .then(response => response.json())
  .then(articles => {
    const container = document.querySelector('.article-list');
    articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'article-card';
      card.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.preview}</p>
        <a href="article.html?article=${article.slug}">Read Story</a>
      `;
      container.appendChild(card);
    });
  });
