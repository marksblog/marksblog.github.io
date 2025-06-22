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
