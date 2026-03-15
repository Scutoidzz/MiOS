let TopNum = 0;

function TopZ(win) {
  TopNum++;
  win.style.zIndex = TopNum;
}

function createWindow(title, content) {
  const win = document.createElement('div');
  win.classList.add('window');
  win.style.cssText = `
    position: absolute;
    width: 460px;
    height: 320px;
    background: var(--window-bg, white);
    border-radius: 10px;
    overflow: hidden;
    top: ${80 + Math.random() * 200}px;
    left: ${100 + Math.random() * 300}px;
  `;

  win.innerHTML = `
    <div class="titlebar" style="
      background: var(--titlebar-bg, #ccc2c2); color: var(--titlebar-color, white);
      padding: 10px; cursor: grab;
      display: flex; align-items: center; gap: 6px;
      font-family: Arial, Helvetica;
    ">
      <button class="close" style="
        width: 20px; height: 20px; border-radius: 25%;
        border: none; background: #f63b31;
        color: white; cursor: pointer; font-size: 11px;
      ">X</button>
      <span style="flex: 1; text-align: center; font-size: 13px;">${title}</span>
      <button class="minimize" style="
        width: 20px; height: 20px; border-radius: 20%;
        border: none; background: #555;
        color: white; cursor: pointer; font-size: 11px;
      ">_</button>
      <button class="maximize" style="
        width: 20px; height: 20px; border-radius: 20%;
        border: none; background: #555;
        color: white; cursor: pointer; font-size: 11px;
      ">O</button>
    </div>
    <div class="content" style="padding: 15px; height: calc(100% - 40px); box-sizing: border-box; overflow: auto;">${content}</div>
    <div class="resizer resizer-w" style="position:absolute; left:-4px; top:10px; bottom:10px; width:8px; cursor:ew-resize; z-index:5;"></div>
    <div class="resizer resizer-e" style="position:absolute; right:-4px; top:10px; bottom:10px; width:8px; cursor:ew-resize; z-index:5;"></div>
    <div class="resizer resizer-s" style="position:absolute; left:10px; right:10px; bottom:-4px; height:8px; cursor:ns-resize; z-index:5;"></div>
    <div class="resizer resizer-sw" style="position:absolute; left:-4px; bottom:-4px; width:12px; height:12px; cursor:nesw-resize; z-index:6;"></div>
    <div class="resizer resizer-se" style="position:absolute; right:-4px; bottom:-4px; width:12px; height:12px; cursor:nwse-resize; z-index:6;"></div>
  `;

  const contentEl = win.querySelector('.content');
  if (contentEl) {
    contentEl.querySelectorAll('script').forEach((oldScript) => {
      const s = document.createElement('script');
      for (const attr of oldScript.getAttributeNames()) {
        s.setAttribute(attr, oldScript.getAttribute(attr));
      }
      s.text = oldScript.textContent || '';
      oldScript.replaceWith(s);
    });
  }

  const titlebar = win.querySelector('.titlebar');
  let dragging = false, offsetX, offsetY;
  let resizing = false;
  let resizeDir = null;
  let startX = 0, startY = 0, startW = 0, startH = 0, startL = 0;
  const minW = 220;
  const minH = 120;

  // Fix: prevent drag when clicking titlebar buttons
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) return;
    if (resizing) return;
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    titlebar.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (dragging) {
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';
    }
    if (resizing) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (resizeDir === 'e' || resizeDir === 'se') {
        win.style.width = Math.max(minW, startW + dx) + 'px';
      }
      if (resizeDir === 'w' || resizeDir === 'sw') {
        const nextW = Math.max(minW, startW - dx);
        const nextL = startL + (startW - nextW);
        win.style.width = nextW + 'px';
        win.style.left = nextL + 'px';
      }
      if (resizeDir === 's' || resizeDir === 'se' || resizeDir === 'sw') {
        win.style.height = Math.max(minH, startH + dy) + 'px';
      }
    }
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
    resizing = false;
    resizeDir = null;
    titlebar.style.cursor = 'grab';
    document.body.style.userSelect = '';
  });

  win.querySelectorAll('.resizer').forEach((handle) => {
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      TopZ(win);

      resizing = true;
      dragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startW = win.offsetWidth;
      startH = win.offsetHeight;
      startL = win.offsetLeft;
      resizeDir = Array.from(handle.classList).find(c => c.startsWith('resizer-'))?.replace('resizer-', '') ?? null;
      titlebar.style.cursor = 'default';
      document.body.style.userSelect = 'none';
    });
  });

  // Fix: maximize toggle
  let isMaximized = false;
  let savedStyle = {};
  win.querySelector('.maximize').addEventListener('click', () => {
    if (!isMaximized) {
      savedStyle = { width: win.style.width, height: win.style.height, top: win.style.top, left: win.style.left };
      win.style.width = '100vw';
      win.style.height = 'calc(100vh - 48px)';
      win.style.top = '0';
      win.style.left = '0';
      win.style.borderRadius = '0';
    } else {
      win.style.width = savedStyle.width;
      win.style.height = savedStyle.height;
      win.style.top = savedStyle.top;
      win.style.left = savedStyle.left;
      win.style.borderRadius = '10px';
    }
    isMaximized = !isMaximized;
  });

  win.querySelector('.close').addEventListener('click', () => win.remove());
  win.querySelector('.minimize').addEventListener('click', () => {
    const content = win.querySelector('.content');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  });

  win.addEventListener('mousedown', () => TopZ(win));

  document.body.appendChild(win);
  TopZ(win); // bring new window to front immediately
}
