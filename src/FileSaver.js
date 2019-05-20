import pickRandom from "pick-random"
import saveAs from "save-as"

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

export const saveFile = canvas => {
  canvas.toBlob(image => {
    const filename = `${pickRandom(adjectives)[0]}-${
      pickRandom(artwords)[0]
    }.jpg`

    saveAs(image, filename)
  }, "image/jpeg")
}
