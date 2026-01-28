/* global document, window */
// import MobileDetect from "mobile-detect"
import Shake from "@zouloux/shake"
import clamp from "clamp"
import { saveFile } from "./FileSaver"

// const mobileDetect = new MobileDetect(window.navigator.userAgent)

const canvas = document.querySelector(".screen")
const ctx = canvas.getContext("2d")

// Canvas specifically used for saving images
const saveCanvas = document.createElement("canvas")

saveCanvas.width = canvas.width
saveCanvas.height = canvas.height

const saveCtx = saveCanvas.getContext("2d")

saveCtx.fillStyle = "white"
saveCtx.fillRect(0, 0, canvas.width, canvas.height)

// Save DOM element handles
const leftDialTeeth = document.querySelector(".left.dial .teeth")
const rightDialTeeth = document.querySelector(".right.dial .teeth")
// const leftDial = document.querySelector(".left.dial")
// const rightDial = document.querySelector(".right.dial")
const etchASketch = document.querySelector(".etch-a-sketch-container")

let leftRotation = 0
let rightRotation = 0

// to decide if the mouse is moving on the left knob
let isLeftDragging = false;

// Store where the cursor currently is
let x = 160
let y = 150

const DOT_SIZE = 1.2

const drawDot = () => {
  // Draw ~1 pixel on the canvas
  ctx.fillStyle = `rgba(100, 100, 100, 0.89)`
  ctx.fillRect(x, y, DOT_SIZE, DOT_SIZE)

  // Draw it on the one for saving too
  saveCtx.fillStyle = `rgba(100, 100, 100, 0.89)`
  saveCtx.fillRect(x, y, DOT_SIZE, DOT_SIZE)
}

const erase = () => {
  // Erase the real canvas
  ctx.globalAlpha = 0.9
  ctx.globalCompositeOperation = "copy"
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  )
  ctx.globalAlpha = 1.0
  ctx.globalCompositeOperation = "source-over"

  // Erase the pretend one that was just for saving
  saveCtx.fillStyle = "white"
  saveCtx.fillRect(0, 0, canvas.width, canvas.height)
}

drawDot()

const keysPressed = {}
let dragOffsetX = 0
let dragOffsetY = 0

let verticalSpeed = 0
let horizontalSpeed = 0

window.addEventListener("keyup", e => {
  keysPressed[e.key] = false
})
window.addEventListener("keydown", e => {
  keysPressed[e.key] = true
})

const myShakeEvent = new Shake({
  threshold: 15,
  timeout: 200,
  handler: () => {
    erase()
  }
})

myShakeEvent.start()

const MARGIN = 2

const MIN_SPEED = 0.01
const SPEED_MULTIPLIER = 0.3
const MAX_SPEED = 0.7

const accelerate = (speed, direction) => {
  let _speed = speed

  if (direction > 0 && speed < 0) {
    _speed = 0
  }
  if (direction < 0 && speed > 0) {
    _speed = 0
  }
  return direction > 0
    ? Math.min(MIN_SPEED + _speed * (1 + SPEED_MULTIPLIER), MAX_SPEED)
    : Math.max(-MIN_SPEED + _speed * (1 + SPEED_MULTIPLIER), -MAX_SPEED)
}

const decelerate = speed => {
  if (Math.abs(speed) > MIN_SPEED) {
    return speed > 0
      ? Math.max((1 - SPEED_MULTIPLIER) * speed, 0)
      : Math.min((1 - SPEED_MULTIPLIER) * speed, 0)
  }
  return 0
}

const rotateDials = () => {
  leftDialTeeth.style.transform = `rotate(${leftRotation}deg)`
  rightDialTeeth.style.transform = `rotate(${rightRotation}deg)`
}

const renderStep = () => {
  if (keysPressed.q) {
    // up
    verticalSpeed = accelerate(verticalSpeed, -1)
  } else if (keysPressed.w) {
    // down
    verticalSpeed = accelerate(verticalSpeed, 1)
  } else {
    verticalSpeed = decelerate(verticalSpeed)
  }

  if (keysPressed.o) {
    // left
    horizontalSpeed = accelerate(horizontalSpeed, -1)
  } else if (keysPressed.p) {
    // right
    horizontalSpeed = accelerate(horizontalSpeed, 1)
  } else {
    horizontalSpeed = decelerate(horizontalSpeed)
  }

  if (dragOffsetX !== 0) {
    horizontalSpeed = dragOffsetX
  }

  if (dragOffsetY !== 0) {
    verticalSpeed = dragOffsetY
  }

  // if any key is pressed, draw the dot
  if (keysPressed.q || keysPressed.w || keysPressed.o || keysPressed.p) {
    rotateDials()
    drawDot()
  }

  if (dragOffsetX !== 0 || dragOffsetY !== 0) {
    drawDot()
  }
  // reset the dragOffset
  dragOffsetX = 0;
  dragOffsetY = 0;

  if (horizontalSpeed !== 0) {
    console.log('x', x, horizontalSpeed, x + horizontalSpeed, MARGIN, canvas.width - MARGIN);
    x = clamp(x + horizontalSpeed, MARGIN, canvas.width - MARGIN)
    leftRotation += horizontalSpeed
  }

  if (verticalSpeed !== 0) {
    y = clamp(y + verticalSpeed, MARGIN, canvas.height - MARGIN)
    rightRotation += verticalSpeed
  }

  if (keysPressed[" "]) {
    etchASketch.classList.add("shake")
    erase()
  } else {
    etchASketch.classList.remove("shake")
  }

  window.requestAnimationFrame(renderStep)
}

const calcOffset = offset => offset * 2 * 0.5

const translateMirror = (mirror, mirrorCoords) => {
  const xCoord = mirrorCoords.left
  const yCoord = mirrorCoords.top

  mirror.style.transform = `translate(${xCoord}px, ${yCoord}px)`
}

let leftDragRect
let leftContainerRect
let rightDragRect
let rightContainerRect
let initialMousePosition

function angleDelta(current, previous) {
  let delta = current - previous;

  // Normalize to [-180, 180]
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  return delta;
}

const leftKnob = document.querySelector('.left.dial');
let leftPointerId;
let leftLastAngle
leftKnob.addEventListener('pointerdown', (e) => {
  e.preventDefault();

  leftPointerId = e.pointerId;
  leftKnob.setPointerCapture(e.pointerId);
});
leftKnob.addEventListener('pointermove', (e) => {
  if (e.pointerId !== leftPointerId) return;

  const knobCenterX = leftKnob.getBoundingClientRect().x + leftKnob.getBoundingClientRect().width / 2;
  const knobCenterY = leftKnob.getBoundingClientRect().y + leftKnob.getBoundingClientRect().height / 2;

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  let angleInDegrees = Math.atan2(mouseY - knobCenterY, mouseX - knobCenterX) * 180 / Math.PI;

  if (leftLastAngle) {
    const amountToDraw = angleDelta(angleInDegrees, leftLastAngle);
    dragOffsetX += 0.1 * amountToDraw
  }
  leftLastAngle = angleInDegrees;
  leftRotation = angleInDegrees;
  rotateDials()
});
leftKnob.addEventListener('pointerup', releaseLeftPointer);
leftKnob.addEventListener('pointercancel', releaseLeftPointer);

function releaseLeftPointer (e) {
  if (e.pointerId !== leftPointerId) return;

  leftKnob.releasePointerCapture(e.pointerId);
  leftPointerId = null;
  leftLastAngle = null;
}

const rightKnob = document.querySelector('.right.dial');
let rightPointerId;
let rightLastAngle
rightKnob.addEventListener('pointerdown', (e) => {
  e.preventDefault();

  rightPointerId = e.pointerId;
  rightKnob.setPointerCapture(e.pointerId);
});
rightKnob.addEventListener('pointermove', (e) => {
  if (e.pointerId !== rightPointerId) return;

  const knobCenterX = rightKnob.getBoundingClientRect().x + rightKnob.getBoundingClientRect().width / 2;
  const knobCenterY = rightKnob.getBoundingClientRect().y + rightKnob.getBoundingClientRect().height / 2;

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  let angleInDegrees = Math.atan2(mouseY - knobCenterY, mouseX - knobCenterX) * 180 / Math.PI;

  if (rightLastAngle) {
    const amountToDraw = angleDelta(angleInDegrees, rightLastAngle);
    dragOffsetY += 0.1 * amountToDraw
  }
  rightLastAngle = angleInDegrees;
  rightRotation = angleInDegrees;
  rotateDials()
});
rightKnob.addEventListener('pointerup', releaseRightPointer);
rightKnob.addEventListener('pointercancel', releaseRightPointer);

function releaseRightPointer (e) {
  if (e.pointerId !== leftPointerId) return;

  leftKnob.releasePointerCapture(e.pointerId);
  leftPointerId = null;
  leftLastAngle = null;
}

document
  .querySelector(".download-link")
  .addEventListener("click", () => saveFile(saveCanvas))

window.requestAnimationFrame(renderStep)
