const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');
const xDisp = document.getElementById('x');
const yDisp = document.getElementById('y');
let image = new Image();
image.src = 'assets/pmap.png';

let isDragging = false;
let offsetX, offsetY;
let imgX = 0, imgY = 0;
let zoomLevel = 1;

function resizeCanvas() {
  canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  zoomReset();
}

image.onload = function() {
  resizeCanvas();
  const scaleFactor = Math.min(canvas.width / image.width, canvas.height / image.height);
  const scaledWidth = image.width * scaleFactor;
  const scaledHeight = image.height * scaleFactor;
  const centerX = (canvas.width - scaledWidth) / 2;
  const centerY = (canvas.height - scaledHeight) / 2;
  imgX = centerX, imgY = centerY;
  ctx.drawImage(image, centerX, centerY, scaledWidth, scaledHeight);
};


function drawImage(x, y) {
  const clearRectLeft = Math.max(0, x - (image.width * zoomLevel));
  const clearRectTop = Math.max(0, y - (image.height * zoomLevel));
  const clearRectRight = Math.min(canvas.width, x + (image.width * zoomLevel));
  const clearRectBottom = Math.min(canvas.height, y + (image.height * zoomLevel));
  ctx.clearRect(clearRectLeft, clearRectTop, clearRectRight - clearRectLeft, clearRectBottom - clearRectTop);
  ctx.setTransform(zoomLevel, 0, 0, zoomLevel, x, y);
  const scaleFactor = Math.min(canvas.width / image.width, canvas.height / image.height);
  const scaledWidth = image.width * scaleFactor;
  const scaledHeight = image.height * scaleFactor;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
}


canvas.addEventListener('mousedown', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (!isDragging && x > imgX && x < imgX + image.width && y > imgY && y < imgY + image.height) {
    isDragging = true;
    offsetX = x - imgX;
    offsetY = y - imgY;
  }
});

canvas.addEventListener('mousemove', function(e) {
  if (!isDragging) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  imgX = x - offsetX;
  imgY = y - offsetY;

  drawImage(imgX, imgY);
});

canvas.addEventListener('mouseup', function() {
  isDragging = false;
  drawImage(imgX, imgY);
});

canvas.addEventListener('mouseleave', function() {
  isDragging = false;
});

window.addEventListener('resize', resizeCanvas);

function zoomIn() {
  zoomLevel += 0.1;
  if (zoomLevel > 4) zoomLevel = 4;
  drawImage(imgX, imgY);
}

function zoomOut() {
  zoomLevel -= 0.1;
  if (zoomLevel < 0.1) zoomLevel = 0.1;
  drawImage(imgX, imgY);
}

function zoomReset() {
  zoomLevel = 1;
  posReset();
}

function posReset() {
  const scaleFactor = Math.min(canvas.width / image.width, canvas.height / image.height);
  const scaledWidth = image.width * scaleFactor;
  const scaledHeight = image.height * scaleFactor;
  const centerX = (canvas.width - scaledWidth) / 2;
  const centerY = (canvas.height - scaledHeight) / 2;
  imgX = centerX, imgY = centerY;
  drawImage(imgX, imgY);
}

setInterval(() => {
  xDisp.innerText = Math.floor(imgX);
  yDisp.innerText = Math.floor(imgY);
});

function menu() {
  const menu = document.getElementById("menu");
  if(menu) {
    menu.style.opacity = 0;
    setTimeout(() => {
      menu.remove();
    }, 100);
    const icons = document.querySelectorAll(".icons");
    icons.forEach(icon => {
      icon.style.opacity = 1;
    });
  } else {
    const nMenu = document.createElement("div");
    nMenu.id = "menu";
    nMenu.classList.add("panel");
    nMenu.style.opacity = 0;
    nMenu.innerHTML = `<h3>Menu</h3><img src="assets/icons/hbb.svg" alt="Close" onclick="menu()" class="m-icon">`;
    document.body.appendChild(nMenu);
    setTimeout(() => {
      nMenu.style.opacity = 1;
      setTimeout(() => {
        const icons = document.querySelectorAll(".icons");
        icons.forEach(icon => {
          icon.style.opacity = 0;
        }, 50);
      })
    }, 100);
  }
}

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

function getTouchPos(touchEvent) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

function handleTouchStart(e) {
  var touchPos = getTouchPos(e);
  const x = touchPos.x;
  const y = touchPos.y;
  if (!isDragging && x > imgX && x < imgX + image.width && y > imgY && y < imgY + image.height) {
    isDragging = true;
    offsetX = x - imgX;
    offsetY = y - imgY;
  }
}

function handleTouchMove(e) {
  if (!isDragging) return;

  e.preventDefault();

  var touchPos = getTouchPos(e);
  const x = touchPos.x;
  const y = touchPos.y;

  imgX = x - offsetX;
  imgY = y - offsetY;

  drawImage(imgX, imgY);
}

function handleTouchEnd() {
  isDragging = false;
  drawImage(imgX, imgY);
}
