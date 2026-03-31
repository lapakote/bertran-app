/**
 * Генерирует PNG-иконки для PWA без внешних зависимостей.
 * Использует только встроенный Node.js модуль zlib.
 * Иконка: индиго фон (#4f46e5) + белая буква «Р» из пикселей.
 */
import zlib from 'zlib'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../public/icons')
fs.mkdirSync(OUT_DIR, { recursive: true })

// ── CRC32 (нужен для формата PNG) ────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, data) {
  const tb = Buffer.from(type, 'ascii')
  const crc = crc32(Buffer.concat([tb, data]))
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length)
  const cb  = Buffer.allocUnsafe(4); cb.writeUInt32BE(crc)
  return Buffer.concat([len, tb, data, cb])
}

// ── Отрисовка буквы «Р» в пиксельной сетке 7×9 ──────────────────────────────
// 1 = белый пиксель, 0 = фон
const LETTER_R = [
  [1,1,1,1,1,0,0],
  [1,0,0,0,0,1,0],
  [1,0,0,0,0,1,0],
  [1,1,1,1,1,0,0],
  [1,0,1,0,0,0,0],
  [1,0,0,1,0,0,0],
  [1,0,0,0,1,0,0],
  [1,0,0,0,0,1,0],
  [1,0,0,0,0,0,1],
]

function makePNG(size) {
  const BG  = [79, 70, 229]   // indigo-600
  const FG  = [255, 255, 255] // white

  // Масштаб буквы: ~40% от размера иконки
  const scale = Math.floor(size * 0.04)
  const lw = LETTER_R[0].length * scale
  const lh = LETTER_R.length    * scale
  const ox = Math.floor((size - lw) / 2)  // отступ X
  const oy = Math.floor((size - lh) / 2)  // отступ Y

  // Строим пиксельную карту
  const pixels = new Uint8Array(size * size * 3).fill(0)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 3
      const lx = Math.floor((x - ox) / scale)
      const ly = Math.floor((y - oy) / scale)
      const onLetter =
        ly >= 0 && ly < LETTER_R.length &&
        lx >= 0 && lx < LETTER_R[0].length &&
        LETTER_R[ly][lx] === 1

      const [r, g, b] = onLetter ? FG : BG
      pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b
    }
  }

  // PNG raw data: 1 байт фильтра + RGB пиксели на строку
  const rowLen = 1 + size * 3
  const raw = Buffer.allocUnsafe(size * rowLen)
  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0  // filter: None
    for (let x = 0; x < size; x++) {
      const pi = (y * size + x) * 3
      const ri = y * rowLen + 1 + x * 3
      raw[ri] = pixels[pi]; raw[ri+1] = pixels[pi+1]; raw[ri+2] = pixels[pi+2]
    }
  }

  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),  // PNG signature
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Генерируем все нужные размеры ────────────────────────────────────────────
const SIZES = [
  { size: 192,  name: 'icon-192.png' },
  { size: 512,  name: 'icon-512.png' },
  { size: 180,  name: 'apple-touch-icon.png' },  // iOS «Добавить на экран»
]

for (const { size, name } of SIZES) {
  const filePath = path.join(OUT_DIR, name)
  fs.writeFileSync(filePath, makePNG(size))
  console.log(`✅ ${name} (${size}×${size}) → public/icons/${name}`)
}

console.log('\n🎉 Иконки сгенерированы в public/icons/')
