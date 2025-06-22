fetch('content/articles/index.json')
  .then(res => res.json())
  .then(articles => {
    const app = document.getElementById('blog-app');
    app.innerHTML = `<h1>Mark's Blog</h1>
      <div class="article-list"></div>`;
    const list = app.querySelector('.article-list');
    articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'article-card';
      card.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.preview}</p>
        <button>Open Story</button>
      `;
      card.onclick = () => {
        window.location.href = `article.html?article=${article.slug}`;
      };
      list.appendChild(card);
    });
  });
