let TopNum = 1;

function TopZ(win) {
  TopNum++;
  win.style.zIndex = TopNum;
}

function createWindow(title, content) {
  const win = document.createElement('div');
  win.style.cssText = `
    position: absolute;
    width: 400px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    top: ${80 + Math.random() * 200}px;
    left: ${100 + Math.random() * 300}px;
  `;

  win.innerHTML = `
    <div class="titlebar" style="
      background: #333; color: white;
      padding: 10px; cursor: grab;
      display: flex; align-items: center; gap: 6px;
      font-family: Arial, Helvetica;s
    ">
      <button class="close" style="
        width: 20px; height: 20px; border-radius: 25%;
        border: none; background: #f63b31;
        color: white; cursor: pointer; font-size: 11px;
      ">✕</button>
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
      ">○</button>
    </div>
    <div class="content" style="padding: 15px;">${content}</div>
  `;

  const titlebar = win.querySelector('.titlebar');
  let dragging = false, offsetX, offsetY;

  titlebar.addEventListener('mousedown', (e) => {
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (dragging) {
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', () => dragging = false);

  win.querySelector('.close').addEventListener('click', () => win.remove());
  win.querySelector('.minimize').addEventListener('click', () => {
    const content = win.querySelector('.content');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  });

  win.addEventListener('mousedown', () => TopZ(win));

  document.body.appendChild(win);
}