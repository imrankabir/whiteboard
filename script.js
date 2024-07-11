const canvas = document.getElementById("whiteboard");
const context = canvas.getContext("2d");
const clearButton = document.getElementById("clear-button");
const colorPicker = document.getElementById("color-picker");
const sizePicker = document.getElementById("size-picker");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let painting = false;

function startPosition(e) {
  painting = true;
  draw(e);
}

function endPosition() {
  painting = false;
  context.beginPath();
}

function draw(e) {
  if (!painting) return;

  context.lineWidth = sizePicker.value;
  context.lineCap = "round";
  context.strokeStyle = colorPicker.value;

  context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  context.stroke();
  context.beginPath();
  context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
});
