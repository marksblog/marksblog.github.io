// src/js/library.js

const library = window.libraryContext;

// List your libraries in the order you want navigation to cycle
const libraries = [
  {name: 'virtues', label: 'Virtues', file: 'virtues.html'},
  {name: 'noble', label: 'Noble Realm', file: 'noble.html'},
  {name: 'wicked', label: 'Wicked Domain', file: 'wicked.html'},
  {name: 'anti-virtues', label: 'Anti-Virtues', file: 'anti-virtues.html'}
];
const currentIndex = libraries.findIndex(lib => lib.name === library.name);
const prevLibrary = libraries[(currentIndex - 1 + libraries.length) % libraries.length];
const nextLibrary = libraries[(currentIndex + 1) % libraries.length];

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
    <h1>${library.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
    <div class="article-list"></div>
  `;
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
      <button>Enter</button>
    `;
    card.onclick = () => {
      window.location.href = `article.html?library=${library.name}&article=${slug}`;
    };
    list.appendChild(card);
  });
  // Add navigation and ad
  document.body.insertAdjacentHTML('beforeend', `
    <div class="nav-arrows">
      <button class="nav-arrow prev" title="Previous library" onclick="window.location.href='${prevLibrary.file}'">
        <svg class="nav-arrow-svg" viewBox="0 0 100 100" width="80" height="80">
          <polyline points="65,15 35,50 65,85" stroke="#111" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="nav-arrow next" title="Next library" onclick="window.location.href='${nextLibrary.file}'">
        <svg class="nav-arrow-svg" viewBox="0 0 100 100" width="80" height="80">
          <polyline points="35,15 65,50 35,85" stroke="#111" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="ad-placeholder"></div>
  `);
  loadAd(currentAdIndex);
}

// --- Fetch and Render ---
function fetchAndRender() {
  fetchAdFiles().then(() => {
    fetch(`${library.path}articles/index.xml`)
      .then(response => response.text())
      .then(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const articles = Array.from(xmlDoc.getElementsByTagName('article'));
        renderArticles(articles);
      });
  });
}

fetchAndRender();
