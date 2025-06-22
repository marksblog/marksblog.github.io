import { renderHeader } from '../../components/Header/Header.js';
import { renderFooter } from '../../components/Footer/Footer.js';

function getArticleSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('article');
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();

  const slug = getArticleSlug();
  fetch(`/content/articles/${slug}/${slug}.json`)
    .then(res => res.json())
    .then(article => {
      const app = document.getElementById('article-app');
      app.innerHTML = `
        <h1>${article.title}</h1>
        <img src="/content/articles/${slug}/${article.images[0]}" alt="" style="max-width:100%;border-radius:8px;">
        <p>${article.body}</p>
      `;
    });

  renderFooter();
});
