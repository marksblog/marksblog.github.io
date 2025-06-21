export function renderSplitLayout(mainContent, asideContent) {
  const layout = document.createElement('div');
  layout.className = 'split-layout';
  layout.innerHTML = `
    <div class="split-main">${mainContent}</div>
    <aside class="split-aside">${asideContent}</aside>
  `;
  return layout;
}
