// Typewriter effect
const lines = [
  "You are here.",
  "",
  "Welcome"
];
const pre = document.getElementById('typewriter');
let line = 0, char = 0;
function typeLine() {
  if (line < lines.length) {
    if (char <= lines[line].length) {
      pre.textContent = lines.slice(0, line).join('\n') + (line > 0 ? '\n' : '') + lines[line].slice(0, char) + (char % 2 === 0 ? '|' : '');
      char++;
      setTimeout(typeLine, 60);
    } else {
      pre.textContent = lines.slice(0, line+1).join('\n');
      line++; char = 0;
      setTimeout(typeLine, 400);
    }
  }
}
typeLine();

// Floating objects
fetch('content/floating-objects/manifest.xml')
  .then(response => response.text())
  .then(xmlString => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const objects = xmlDoc.getElementsByTagName('object');
    const container = document.getElementById('floating-objects');
    for (let obj of objects) {
      const name = obj.querySelector('name').textContent;
      const icon = obj.querySelector('icon').textContent;
      const link = obj.querySelector('link').textContent;
      const position = obj.querySelector('position').textContent;
      const floatObj = document.createElement('a');
      floatObj.className = 'floating-object';
      floatObj.href = link;
      floatObj.style.cssText = position;
      floatObj.innerHTML = `
        <img src="${icon}" alt="${name}">
        <span class="object-tooltip">${name}</span>
      `;
      container.appendChild(floatObj);
    }
  });
