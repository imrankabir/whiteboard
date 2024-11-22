const app = 'Whiteboard';
const BOARD_KEY = 'board';

let painting = false;
const VISITS_KEY = 'whiteboard-visits';
const BOARD_SETTINGS = 'board-settings';
let lastX = 0;
let lastY = 0;

let data = [];
let singleData = [];
let removedData = [];

const canvas = document.querySelector('#whiteboard');
const context = canvas.getContext('2d');
const sizeBtn = document.querySelector('#size-btn');
const undoBtn = document.querySelector('#undo-btn');
const redoBtn = document.querySelector('#redo-btn');
const colorBtn = document.querySelector('#color-btn');
const shapeBtn = document.querySelector('#shape-btn');
const straightBtn = document.querySelector('#straight-btn');

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.85;

const saveData = ({data, removedData}) => localStorage.setItem(BOARD_KEY, JSON.stringify({data, removedData}));
const getData = e => JSON.parse(localStorage.getItem(BOARD_KEY)) ?? {data: [], removedData: []};

const saveSettings = ({straight, shape, color, size}) => localStorage.setItem(BOARD_SETTINGS, JSON.stringify({straight, shape, color, size}));
const getSettings = e => JSON.parse(localStorage.getItem(BOARD_SETTINGS)) ?? {straight: false, shape: false, color: '#000000', size: 10};

const getCurrentSettings = e => {
  const straight = straightBtn.checked;
  const shape = shapeBtn.checked;
  const color = colorBtn.value;
  const size = sizeBtn.value;
  return {straight, shape, color, size};
}

straightBtn.addEventListener('change', e => saveSettings(getCurrentSettings()));
shapeBtn.addEventListener('change', e => saveSettings(getCurrentSettings()));
colorBtn.addEventListener('change', e => saveSettings(getCurrentSettings()));
sizeBtn.addEventListener('keyup', e => saveSettings(getCurrentSettings()));

straightBtn.addEventListener('touchend', e => saveSettings(getCurrentSettings()));
shapeBtn.addEventListener('touchend', e => saveSettings(getCurrentSettings()));
colorBtn.addEventListener('touchend', e => saveSettings(getCurrentSettings()));
sizeBtn.addEventListener('touchend', e => saveSettings(getCurrentSettings()));

window.onload = e => {
  const {straight, shape, color, size} = getSettings();
  straightBtn.checked = straight;
  shapeBtn.checked = shape;
  colorBtn.value = color;
  sizeBtn.value = size;
  const {data: d, removedData: rd} = getData();
  data = d;
  removedData = rd;
  if (d.length !== 0) {
    drawAll();
  }
};

// window.onresize = e => {
//   canvas.width = window.innerWidth * 0.95;
//   canvas.height = window.innerHeight * 0.85;
// };

canvas.addEventListener('touchstart', e => sizeBtn.blur());
canvas.addEventListener('click', e => sizeBtn.blur());

const startPosition = e => {
  painting = true;
  const { x, y } = getCoordinates(e);
  lastX = x;
  lastY = y;
  draw(e);
  e.preventDefault();
}

const endPosition = e => {
  painting = false;
  context.beginPath();
  data.push(singleData);
  saveData({data, removedData});
  singleData = [];
  if (data.length == 0) {
    undoBtn.classList.add('disable');
    undoBtn.classList.remove('enable');
  } else {
    undoBtn.classList.add('enable');
    undoBtn.classList.remove('disable');
  }
  e.preventDefault();
}

const undo = e => {
  if (data.length == 0) {
    console.warn('No undo available');
    return false;
  }
  removedData.push(data.pop());
  saveData({data, removedData});
  drawAll();
}

const redo = e => {
  if (removedData.length == 0) {
    console.warn('No redo available');
    return false;
  }
  data.push(removedData.pop());
  saveData({data, removedData});
  drawAll();
}

const clear = (clearData = true) => {
  undoBtn.classList.add('disable');
  undoBtn.classList.remove('enable');
  redoBtn.classList.add('disable');
  redoBtn.classList.remove('enable');
  if (clearData) {
    data = [];
    removedData = [];
    saveData({data, removedData});
    const straight = false;
    const shape = false;
    const color = '#000000';
    const size = 10;
    // saveSettings({straight, shape, color, size});
    // straightBtn.checked = straight;
    // shapeBtn.checked = shape;
    // colorBtn.value = color;
    // sizeBtn.value = size;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const drawAll = e => {
  clear(false);
  if (data.length == 0) {
    undoBtn.classList.add('disable');
    undoBtn.classList.remove('enable');
  } else {
    undoBtn.classList.add('enable');
    undoBtn.classList.remove('disable');
  }
  if (removedData.length == 0) {
    redoBtn.classList.add('disable');
    redoBtn.classList.remove('enable');
  } else {
    redoBtn.classList.add('enable');
    redoBtn.classList.remove('disable');
  }
  data.forEach((lineData) => {
    let c = 0;
    lineData.forEach((point) => {
      const { x, y, shape, size, color } = point;
      context.lineCap = shape;
      context.lineWidth = size;
      context.strokeStyle = color;
      if (c == 0) {
        context.beginPath();
        context.lineTo(x, y);
        context.stroke();
      } else if (lineData.length == c) {
        context.moveTo(x, y);
        context.stroke();
        context.beginPath();
      } else {
        context.lineTo(x, y);
        context.stroke();
      }
      c++;
    });
    context.beginPath();
  });
}

const getCoordinates = e => {
  let x, y;
  if (e.type.includes('touch')) {
    x = e.touches[0].clientX - canvas.offsetLeft;
    y = e.touches[0].clientY - canvas.offsetTop;
  } else {
    x = e.clientX - canvas.offsetLeft;
    y = e.clientY - canvas.offsetTop;
  }
  return { x, y };
}

const draw = e => {
  if (!painting) return;

  let { x, y } = getCoordinates(e);

  context.lineWidth = size = sizeBtn.value;
  context.strokeStyle = color = colorBtn.value;
  context.lineCap = shape = shapeBtn.checked ? 'square' : 'round';

  if (straightBtn.checked) {
    const dx = x - lastX;
    const dy = y - lastY;
    if (Math.abs(dx) > Math.abs(dy)) {
      y = lastY;
    } else {
      x = lastX;
    }
  }

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
  singleData.push({ x, y, shape, size, color });

  lastX = x;
  lastY = y;

  e.preventDefault();
}

// trackVisitor();

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', draw);

const download = e => {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = new Date().getTime();
  a.click();
};

document.querySelector('#clear-btn').addEventListener('click', clear);
document.querySelector('#download-btn').addEventListener('click', download);
document.querySelector('#undo-btn').addEventListener('click', undo);
document.querySelector('#redo-btn').addEventListener('click', redo);

document.addEventListener('keydown', e => {
  switch (e.which) {
    case 38:
    case 67:
      clear();
      break;
    case 40:
    case 68:
      download();
      break;
    case 37:
      undo();
      break;
    case 39:
      redo();
      break;
  }
});