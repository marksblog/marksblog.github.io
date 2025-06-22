const params = new URLSearchParams(window.location.search);
const articleSlug = params.get('article');

// List all XML article files (update as you add articles)
const articleFiles = [
  'giggle-monster.xml',
  'dancing-shoes.xml',
  'daily-stoic-quote.xml'
];
const articles = articleFiles.map(f => f.replace('.xml',''));
const currentIndex = articles.indexOf(articleSlug);
const prevSlug = articles[(currentIndex - 1 + articles.length) % articles.length];
const nextSlug = articles[(currentIndex + 1) % articles.length];

// Ad XMLs
const adFiles = ['01.xml', '02.xml'];
const adIndex = currentIndex % adFiles.length;

async function fetchArticle(slug) {
  const res = await fetch(`content/articles/${slug}.xml`);
  const xml = await res.text();
  const doc = new window.DOMParser().parseFromString(xml, "text/xml");
  return {
    slug: doc.querySelector('slug').textContent,
    title: doc.querySelector('title').textContent,
    body: doc.querySelector('body').textContent,
    image: doc.querySelector('image').textContent
  };
}

async function fetchAd(index) {
  const res = await fetch(`content/ads/${adFiles[index]}`);
  const xml = await res.text();
  const doc = new window.DOMParser().parseFromString(xml, "text/xml");
  return doc.querySelector('html').textContent;
}

(async function() {
  const article = await fetchArticle(articleSlug);
  const adHtml = await fetchAd(adIndex);

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
    <img src="content/articles/${article.slug}/${article.image}" alt="${article.title}">
  </div>`;

  app.innerHTML = `
    <div class="split-container ${layoutClass}">
      ${textFirst ? textDiv + imageDiv : imageDiv + textDiv}
    </div>
    <div class="nav-arrows">
      <button class="nav-arrow prev" title="Previous story">
        <svg class="nav-arrow-svg" viewBox="0 0 100 100">
          <polyline points="65,15 35,50 65,85" />
        </svg>
      </button>
      <button class="nav-arrow next" title="Next story">
        <svg class="nav-arrow-svg" viewBox="0 0 100 100">
          <polyline points="35,15 65,50 35,85" />
        </svg>
      </button>
      <button class="nav-arrow home" title="Home">
        <svg class="nav-arrow-svg" viewBox="0 0 100 100">
          <polygon points="50,20 20,50 30,50 30,80 70,80 70,50 80,50" fill="none" stroke-width="20" stroke="#111"/>
        </svg>
      </button>
    </div>
    <div class="ad-placeholder">${adHtml}</div>
  `;

  // Navigation handlers
  document.querySelector('.prev').addEventListener('click', () => {
    window.location.href = `article.html?article=${prevSlug}`;
  });
  document.querySelector('.next').addEventListener('click', () => {
    window.location.href = `article.html?article=${nextSlug}`;
  });
  document.querySelector('.home').addEventListener('click', () => {
    window.location.href = `blog.html`;
  });
})();
