// src/js/library.js

// --- Config ---
const library = window.libraryContext;
const indexPath = `${library.path}articles/index.xml`;

// --- Ad Cycling Setup ---
let adFiles = [];
let currentAdIndex = parseInt(sessionStorage.getItem('adIndex'), 10);
if (isNaN(currentAdIndex)) currentAdIndex = 0;

function fetchAdFiles() {
  return fetch('content/ads/index.xml')
    .then(res => res.text())
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      adFiles = Array.from(xmlDoc.getElementsByTagName('file')).map(f => 'content/ads/' + f.textContent);
    });
}

function loadAd(index) {
  if (!adFiles.length) return;
  const adIndex = index % adFiles.length;
  fetch(adFiles[adIndex])
    .then(res => res.text())
    .then(adXml => {
      const parser = new DOMParser();
      const adDoc = parser.parseFromString(adXml, "text/xml");
      const adHtml = adDoc.querySelector('html').textContent;
      const adPlaceholder = document.querySelector('.ad-placeholder');
      if (adPlaceholder) adPlaceholder.innerHTML = adHtml;
      sessionStorage.setItem('adIndex', (adIndex + 1) % adFiles.length);
    });
}

// --- Render Article List ---
function renderArticles(articles) {
  const app = document.getElementById('library-app');
  app.innerHTML = `
    <ul class="article-list">
      ${articles.map(article => `
        <li>
          <a href="article.html?library=${library.name}&article=${article.slug}">
            <strong>${article.title}</strong>
            <span class="article-preview">${article.preview}</span>
          </a>
        </li>
      `).join('')}
    </ul>
    <div class="ad-placeholder"></div>
  `;
  loadAd(currentAdIndex);
}

// --- Fetch and Parse Index ---
function fetchAndRender() {
  fetchAdFiles().then(() => {
    fetch(indexPath)
      .then(res => res.text())
      .then(xmlText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const articles = Array.from(xmlDoc.getElementsByTagName('article')).map(a => ({
          slug: a.querySelector('slug').textContent,
          title: a.querySelector('title').textContent,
          preview: a.querySelector('preview')?.textContent || ''
        }));
        renderArticles(articles);
      });
  });
}

// --- Run ---
fetchAndRender();
