import saveAs from "save-as"
import pickRandom from "pick-random"
import clamp from "clamp"

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
const leftDial = document.querySelector(".left.dial .teeth")
const rightDial = document.querySelector(".right.dial .teeth")
const etchASketch = document.querySelector(".etch-a-sketch-container")

let leftRotation = 0
let rightRotation = 0

// Store where we currently are
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
let eraseStarted = 0

let verticalSpeed = 0
let horizontalSpeed = 0

window.addEventListener("keyup", e => {
  keysPressed[e.key] = false
})
window.addEventListener("keydown", e => {
  keysPressed[e.key] = true
})

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
  leftDial.style.transform = `rotate(${leftRotation}deg)`
  rightDial.style.transform = `rotate(${rightRotation}deg)`
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

  // if any key is pressed, draw the dot
  if (keysPressed.q || keysPressed.w || keysPressed.o || keysPressed.p) {
    rotateDials()
    drawDot()
  }

  if (horizontalSpeed !== 0) {
    x = clamp(x + horizontalSpeed, MARGIN, canvas.width - MARGIN)
    rightRotation += horizontalSpeed
  }

  if (verticalSpeed !== 0) {
    y = clamp(y + verticalSpeed, MARGIN, canvas.height - MARGIN)
    leftRotation += verticalSpeed
  }

  if (keysPressed[" "]) {
    etchASketch.classList.add("shake")
    erase()
  } else {
    etchASketch.classList.remove("shake")
  }

  window.requestAnimationFrame(renderStep)
}

const adjectives = [
  "amazing",
  "beautiful",
  "exquisite",
  "gorgeous",
  "lovely",
  "magnificent",
  "pretty",
  "splendid",
  "stunning",
  "wonderful"
]

const artwords = [
  "artwork",
  "composition",
  "depiction",
  "design",
  "doodle",
  "drawing",
  "illustration",
  "image",
  "masterpiece",
  "piece-of-art",
  "sketch"
]

document.querySelector(".download-link").addEventListener("click", () => {
  saveCanvas.toBlob(image => {
    console.log(image)
    const filename = `${pickRandom(adjectives)[0]}-${
      pickRandom(artwords)[0]
    }.jpg`
    saveAs(image, filename)
  }, "image/jpeg")
})

window.requestAnimationFrame(renderStep)
