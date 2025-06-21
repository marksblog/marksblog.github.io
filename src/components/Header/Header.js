export function renderHeader() {
  fetch('src/components/Header/Header.html')
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML('afterbegin', html);
    });
}
