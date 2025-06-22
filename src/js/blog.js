const library = window.libraryContext;
fetch(`${library.path}articles/index.xml`)
  .then(response => response.text())
  .then(xmlString => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const articles = Array.from(xmlDoc.getElementsByTagName('article'));
    const app = document.getElementById('blog-app');
    app.innerHTML = `<h1>${library.name.replace(/-/g, ' ').toUpperCase()} Library</h1>
      <div class="article-list"></div>`;
    const list = app.querySelector('.article-list');
    articles.forEach(article => {
      const slug = article.querySelector('slug').textContent;
      const title = article.querySelector('title').textContent;
      const preview = article.querySelector('preview').textContent;
      const card = document.createElement('div');
      card.className = 'article-card';
      card.innerHTML = `
        <h2>${title}</h2>
        <p>${preview}</p>
        <button>Read</button>
      `;
      card.onclick = () => {
        window.location.href = `article.html?library=${library.name}&article=${slug}`;
      };
      list.appendChild(card);
    });
  });
