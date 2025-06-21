export function createArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'article-card';
  card.innerHTML = `
    <img src="${article.images[0] || 'assets/images/placeholder.jpg'}" alt="Article image" class="article-card-img">
    <div class="article-card-content">
      <h2 class="article-card-title">${article.title}</h2>
      <p class="article-card-desc">${article.preview}</p>
      <a href="src/pages/ArticlePage/index.html?article=${article.slug}" class="article-card-link">Read More</a>
    </div>
  `;
  return card;
}
