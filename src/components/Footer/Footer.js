export function renderFooter() {
  fetch('src/components/Footer/Footer.html')
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
    });
}
