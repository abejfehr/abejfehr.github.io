import saveAs from "save-as"
import pickRandom from "pick-random"
import clamp from "clamp"
import Shake from "@zouloux/shake"
import { Draggable } from "@shopify/draggable"
import MobileDetect from "mobile-detect"

const mobileDetect = new MobileDetect(window.navigator.userAgent)

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
const leftDial = document.querySelector(".left.dial")
const rightDial = document.querySelector(".right.dial")
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
let dragOffsetX = 0
let dragOffsetY = 0
let eraseStarted = 0

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

  if (horizontalSpeed !== 0) {
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

/////////////////////////

function calcOffset(offset) {
  return offset * 2 * 0.5
}

function translateMirror(mirror, mirrorCoords, containerRect) {
  const x = mirrorCoords.left
  const y = mirrorCoords.top

  mirror.style.transform = `translate(${x}px, ${y}px)`
}

let leftDragRect
let leftContainerRect
let rightDragRect
let rightContainerRect
let initialMousePosition

const leftDraggable = new Draggable(
  document.querySelector(".left-dial-container"),
  {
    draggable: ".left.dial"
  }
)

leftDraggable.on("drag:start", evt => {
  initialMousePosition = {
    x: evt.sensorEvent.clientX,
    y: evt.sensorEvent.clientY
  }
})

leftDraggable.on("drag:stop", evt => {
  dragOffsetX = 0
})

leftDraggable.on("mirror:created", evt => {
  leftContainerRect = evt.sourceContainer.getBoundingClientRect()
  leftDragRect = evt.source.getBoundingClientRect()
})

leftDraggable.on("mirror:move", evt => {
  // Required to help restrict the draggable element to the container
  evt.cancel()

  const offsetX = calcOffset(evt.sensorEvent.clientX - initialMousePosition.x)
  const mirrorCoords = {
    top: leftDragRect.top,
    left: leftDragRect.left + clamp(offsetX, -9, 9)
  }

  dragOffsetX = (clamp(offsetX, -9, 9) / 9) * 0.7

  translateMirror(evt.mirror, mirrorCoords, leftContainerRect)
})

const rightDraggable = new Draggable(
  document.querySelector(".right-dial-container"),
  {
    draggable: ".right.dial"
  }
)

rightDraggable.on("drag:start", evt => {
  initialMousePosition = {
    x: evt.sensorEvent.clientX,
    y: evt.sensorEvent.clientY
  }
})

rightDraggable.on("drag:stop", evt => {
  dragOffsetY = 0
})

rightDraggable.on("mirror:created", evt => {
  rightContainerRect = evt.sourceContainer.getBoundingClientRect()
  rightDragRect = evt.source.getBoundingClientRect()
})

rightDraggable.on("mirror:move", evt => {
  // Required to help restrict the draggable element to the container
  evt.cancel()

  const offsetY = calcOffset(initialMousePosition.y - evt.sensorEvent.clientY)
  const mirrorCoords = {
    top: rightDragRect.top - clamp(offsetY, -9, 9),
    left: rightDragRect.left
  }

  dragOffsetY = -(clamp(offsetY, -9, 9) / 9) * 0.7

  translateMirror(evt.mirror, mirrorCoords, rightContainerRect)
})

/////////////////////////

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
    const filename = `${pickRandom(adjectives)[0]}-${
      pickRandom(artwords)[0]
    }.jpg`
    saveAs(image, filename)
  }, "image/jpeg")
})

window.requestAnimationFrame(renderStep)
