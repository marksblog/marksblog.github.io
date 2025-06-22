const params = new URLSearchParams(window.location.search);
const libraryName = params.get('library');
const articleSlug = params.get('article');
const library = {
  name: libraryName,
  path: `content/${libraryName}/`
};

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

        app.innerHTML = `
          <div class="split-container ${layoutClass}">
            ${textFirst ? textDiv + imageDiv : imageDiv + textDiv}
          </div>
          <div class="nav-arrows">
            <button class="nav-arrow prev" title="Previous story">
              <svg class="nav-arrow-svg" viewBox="0 0 100 100">
                <polyline points="65,15 35,50 65,85" stroke="#111" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="nav-arrow next" title="Next story">
              <svg class="nav-arrow-svg" viewBox="0 0 100 100">
                <polyline points="35,15 65,50 35,85" stroke="#111" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="nav-arrow home" title="Home">
              <svg class="nav-arrow-svg" viewBox="0 0 100 100">
                <polygon points="50,20 20,50 30,50 30,80 70,80 70,50 80,50" fill="none" stroke-width="20" stroke="#111" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="ad-placeholder"></div>
        `;

        // Navigation handlers
        document.querySelector('.prev').addEventListener('click', () => {
          window.location.href = `article.html?library=${libraryName}&article=${prevSlug}`;
        });
        document.querySelector('.next').addEventListener('click', () => {
          window.location.href = `article.html?library=${libraryName}&article=${nextSlug}`;
        });
        document.querySelector('.home').addEventListener('click', () => {
          window.location.href = `${library.name}.html`;
        });

        // Load global ad (cycles through all ads)
        fetch('content/ads/01.xml')
          .then(res => res.text())
          .then(adXml => {
            const adDoc = parser.parseFromString(adXml, "text/xml");
            document.querySelector('.ad-placeholder').innerHTML = adDoc.querySelector('html').textContent;
          });
      });
  });
