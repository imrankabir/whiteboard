const colorPicker = document.getElementById("color-picker");
const sizePicker = document.getElementById("size-picker");
const canvas = document.getElementById("whiteboard");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.85;

let painting = false;

function startPosition(e) {
  painting = true;
  draw(e);
  e.preventDefault();
}

function endPosition(e) {
  painting = false;
  context.beginPath();
  e.preventDefault();
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

  context.lineWidth = sizePicker.value;
  context.lineCap = "round";
  context.strokeStyle = colorPicker.value;

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
  e.preventDefault();
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", draw);

const clear = () => context.clearRect(0, 0, canvas.width, canvas.height);

const download = () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = new Date().getTime();
  a.click();
};

document.getElementById("clear-btn").addEventListener("click", clear);

document.getElementById("download-btn").addEventListener("click", download);

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
  }
});
