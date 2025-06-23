const params = new URLSearchParams(window.location.search);
const libraryName = params.get('library');
const articleSlug = params.get('article');
const library = {
  name: libraryName,
  path: `content/${libraryName}/`
};

// ==========================
// Dynamic Ad Cycling Setup
// ==========================
let adFiles = [];
let currentAdIndex = parseInt(sessionStorage.getItem('adIndex'), 10);
if (isNaN(currentAdIndex)) currentAdIndex = 0;

// Fetch ad files from manifest
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

// ==========================
// Main Logic
// ==========================
fetchAdFiles().then(() => {
  fetch(`${library.path}articles/index.xml`)
    .then(response => response.text())
    .then(indexXml => {
      const parser = new DOMParser();
      const indexDoc = parser.parseFromString(indexXml, "text/xml");
      const articles = Array.from(indexDoc.getElementsByTagName('article')).map(a => a.querySelector('slug').textContent);
      const currentIndex = articles.indexOf(articleSlug);
      const prevSlug = articles[(currentIndex - 1 + articles.length) % articles.length];
      const nextSlug = articles[(currentIndex + 1) % articles.length];

      fetch(`${library.path}articles/${articleSlug}.xml`)
        .then(response => response.text())
        .then(xmlString => {
          const xmlDoc = parser.parseFromString(xmlString, "text/xml");
          const article = {
            title: xmlDoc.querySelector('title').textContent,
            body: xmlDoc.querySelector('body').textContent,
            image: xmlDoc.querySelector('image').textContent
          };
          const app = document.getElementById('article-app');
          const isPortrait = window.innerHeight > window.innerWidth;
          const layoutClass = isPortrait ? 'split-vertical' : 'split-horizontal';
          const textFirst = Math.random() > 0.5;
          const textSideColor = Math.random() > 0.5 ? 'light' : 'dark';
          const imageSideColor = textSideColor === 'light' ? 'dark' : 'light';

          let textDiv = `<div class="text-side ${textSideColor}">
            <h1>${article.title}</h1>
            <p>${article.body}</p>
          </div>`;
          let imageDiv = `<div class="image-side ${imageSideColor}">
            <img src="content/${libraryName}/articles/${article.image}" alt="${article.title}">
          </div>`;

          // Insert main content
          app.innerHTML = `
            <div class="split-container ${layoutClass}">
              ${textFirst ? textDiv + imageDiv : imageDiv + textDiv}
            </div>
          `;

          // Remove any existing nav arrows, home, or ad to avoid duplicates
          document.querySelectorAll('.nav-arrows, .article-home, .ad-placeholder').forEach(el => el.remove());

          document.body.insertAdjacentHTML('beforeend', `
            <div class="nav-arrows">
              <button class="nav-arrow prev" title="Previous story">
                <svg class="nav-arrow-svg" viewBox="0 0 100 100" width="80" height="80">
                  <polyline points="65,15 35,50 65,85" stroke="#111" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="nav-arrow next" title="Next story">
                <svg class="nav-arrow-svg" viewBox="0 0 100 100" width="80" height="80">
                  <polyline points="35,15 65,50 35,85" stroke="#111" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <button class="nav-arrow home article-home" title="Home">
              <svg class="nav-arrow-svg" viewBox="0 0 100 100" width="80" height="80">
                <polygon points="50,20 20,50 30,50 30,80 70,80 70,50 80,50" fill="none" stroke-width="20" stroke="#111" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="ad-placeholder"></div>
          `);

          // DYNAMIC CONTRAST LOGIC FOR ARROWS
          function getArrowBgClass(arrowButton) {
            const rect = arrowButton.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const elem = document.elementFromPoint(x, y);
            let parent = elem;
            while (parent && !(parent.classList && (parent.classList.contains('text-side') || parent.classList.contains('image-side')))) {
              parent = parent.parentNode;
            }
            if (parent && parent.classList.contains('dark')) return 'on-dark';
            return 'on-light';
          }
          function updateArrowContrast() {
            document.querySelectorAll('.nav-arrow').forEach(btn => {
              btn.classList.remove('on-dark', 'on-light');
              btn.classList.add(getArrowBgClass(btn));
            });
          }
          updateArrowContrast();
          window.addEventListener('resize', updateArrowContrast);

          // Navigation handlers with ad cycling
          document.querySelector('.prev').addEventListener('click', (e) => {
            e.preventDefault();
            loadAd(currentAdIndex);
            setTimeout(() => {
              window.location.href = `article.html?library=${libraryName}&article=${prevSlug}`;
            }, 50);
          });
          document.querySelector('.next').addEventListener('click', (e) => {
            e.preventDefault();
            loadAd(currentAdIndex);
            setTimeout(() => {
              window.location.href = `article.html?library=${libraryName}&article=${nextSlug}`;
            }, 50);
          });
          document.querySelector('.home.article-home').addEventListener('click', (e) => {
            e.preventDefault();
            loadAd(currentAdIndex);
            setTimeout(() => {
              window.location.href = `${library.name}.html`;
            }, 50);
          });

          // Load current ad on page load
          loadAd(currentAdIndex);
        });
    });
});
