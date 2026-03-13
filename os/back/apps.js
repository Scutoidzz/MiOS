(async () => {
  const response = await fetch('/apps/appmanager/apps.json');
  const apps = await response.json();
  const dock = document.getElementById("dock");

  apps.forEach(app => {
    const appElement = document.createElement('div');
    appElement.className = 'dock-item';
    appElement.innerHTML = `<img src="${app.icon}" style="width:40px; height:40px; border-radius:8px;">`;    appElement.style.cssText = `
      width: 50px; height: 50px;
      display: flex; align-items: center;
      justify-content: center;
      font-size: 30px; cursor: pointer;
      border-radius: 10px;
    `;

    appElement.onclick = () => {
      fetch(app.path)
        .then(r => r.json())
        .then(appData => {
          fetch(appData.files['index.html'])
            .then(r => r.text())
            .then(html => createWindow(appData.manifest.name, html))
            .catch(() => alert('Failed to load app HTML'));
        })
        .catch(() => alert('Failed to load app manifest'));
    };

    dock.appendChild(appElement);
  });
})();