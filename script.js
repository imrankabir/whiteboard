const canvas = document.querySelector("#whiteboard");
const context = canvas.getContext("2d");
const sizeBtn = document.querySelector("#size-btn");
const undoBtn = document.querySelector("#undo-btn");
const redoBtn = document.querySelector("#redo-btn");
const colorBtn = document.querySelector("#color-btn");
const shapeBtn = document.querySelector("#shape-btn");

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.85;

let painting = false;

let data = [];
let singleData = [];
let removedData = [];

function startPosition(e) {
  painting = true;
  draw(e);
  e.preventDefault();
}

function endPosition(e) {
  painting = false;
  context.beginPath();
  data.push(singleData);
  singleData = [];
  if (data.length == 0) {
    undoBtn.classList.add("disable");
    undoBtn.classList.remove("enable");
  } else {
    undoBtn.classList.add("enable");
    undoBtn.classList.remove("disable");
  }
  e.preventDefault();
}

function undo() {
  if (data.length == 0) {
    console.warn("No undo available");
    return false;
  }
  removedData.push(data.pop());
  drawAll();
}

function redo() {
  if (removedData.length == 0) {
    console.warn("No redo available");
    return false;
  }
  data.push(removedData.pop());
  drawAll();
}

function drawAll() {
  clear(false);
  if (data.length == 0) {
    undoBtn.classList.add("disable");
    undoBtn.classList.remove("enable");
  } else {
    undoBtn.classList.add("enable");
    undoBtn.classList.remove("disable");
  }
  if (removedData.length == 0) {
    redoBtn.classList.add("disable");
    redoBtn.classList.remove("enable");
  } else {
    redoBtn.classList.add("enable");
    redoBtn.classList.remove("disable");
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

function draw(e) {
  if (!painting) return;

  let x, y;

  if (e.type.includes("touch")) {
    x = e.touches[0].clientX - canvas.offsetLeft;
    y = e.touches[0].clientY - canvas.offsetTop;
  } else {
    x = e.clientX - canvas.offsetLeft;
    y = e.clientY - canvas.offsetTop;
  }

  context.lineWidth = size = sizeBtn.value;
  context.strokeStyle = color = colorBtn.value;
  context.lineCap = shape = shapeBtn.checked ? "square" : "round";

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
  singleData.push({ x, y, shape, size, color });
  e.preventDefault();
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", draw);

const clear = (clearData = true) => {
  undoBtn.classList.add("disable");
  undoBtn.classList.remove("enable");
  redoBtn.classList.add("disable");
  redoBtn.classList.remove("enable");
  if (clearData) {
    data = [];
    removedData = [];
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const download = () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = new Date().getTime();
  a.click();
};

document.getElementById("clear-btn").addEventListener("click", clear);
document.getElementById("download-btn").addEventListener("click", download);
document.getElementById("undo-btn").addEventListener("click", undo);
document.getElementById("redo-btn").addEventListener("click", redo);

document.addEventListener("keydown", (e) => {
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
