// List all XML files in the articles folder (update this array as you add articles)
const articleFiles = [
  'giggle-monster.xml',
  'dancing-shoes.xml',
  'daily-stoic-quote.xml'
];

async function fetchArticles() {
  const articles = [];
  for (const file of articleFiles) {
    const res = await fetch(`content/articles/${file}`);
    const xml = await res.text();
    const doc = new window.DOMParser().parseFromString(xml, "text/xml");
    articles.push({
      slug: doc.querySelector('slug').textContent,
      title: doc.querySelector('title').textContent,
      preview: doc.querySelector('preview').textContent
    });
  }
  return articles;
}

fetchArticles().then(articles => {
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
