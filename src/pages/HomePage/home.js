import { renderHeader } from '../../components/Header/Header.js';
import { renderFooter } from '../../components/Footer/Footer.js';
import { createArticleCard } from '../../components/ArticleCard/ArticleCard.js';

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();

  fetch('/content/articles/index.json')
    .then(res => res.json())
    .then(articles => {
      const app = document.getElementById('homepage-app');
      articles.forEach(article => {
        const card = createArticleCard(article);
        app.appendChild(card);
      });
    });

  renderFooter();
});
