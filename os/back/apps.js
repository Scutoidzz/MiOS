(async () => {
  // Use relative path from /os/userspace/uspace.html to the root
  const response = await fetch('../../apps/appmanager/apps.json');
  const apps = await response.json();
  const dock = document.getElementById("dock");

  // Only show apps that are not explicitly disabled AND exclude appmanager
  apps
    .filter(app => app.enabled !== false && !app.path.includes('appmanager.json'))
    .forEach(app => {
    const appElement = document.createElement('div');
    appElement.className = 'dock-item';
    
    // Resolve icon relative to the root (two levels up from uspace.html)
    appElement.innerHTML = `<img src="../../${app.icon}" style="width:40px; height:40px; border-radius:8px;">`;    appElement.style.cssText = `
      width: 50px; height: 50px;
      display: flex; align-items: center;
      justify-content: center;
      font-size: 30px; cursor: pointer;
      border-radius: 10px;
    `;

    appElement.onclick = () => {
      // Resolve app manifest relative to root
      fetch('../../' + app.path)
        .then(r => r.json())
        .then(appData => {
          // Resolve relative to repo root
          const indexPath = '../../' + appData.files['index.html'];
          fetch(indexPath)
            .then(r => r.text())
            .then(html => createWindow(appData.manifest.name, html))
            .catch(() => alert('Failed to load app HTML'));
        })
        .catch(() => alert('Failed to load app manifest'));
    };

    dock.appendChild(appElement);
  });
})();
