import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public/icons')
const publicDir = join(root, 'public')
mkdirSync(outDir, { recursive: true })

const svgRound = readFileSync(join(outDir, 'app-icon.svg'), 'utf8')
const svgMask = readFileSync(join(outDir, 'app-icon-maskable.svg'), 'utf8')

function render(svg, size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  })
  return resvg.render().asPng()
}

const rounded = {
  'icon-192.png': 192,
  'icon-512.png': 512,
  'apple-touch-icon.png': 180,
  'icon-source.png': 432,
}

for (const [name, size] of Object.entries(rounded)) {
  writeFileSync(join(outDir, name), render(svgRound, size))
  console.log('wrote', name, size, '(rounded)')
}

writeFileSync(join(outDir, 'icon-maskable-512.png'), render(svgMask, 512))
console.log('wrote icon-maskable-512.png (full)')

writeFileSync(join(publicDir, 'favicon.png'), render(svgRound, 32))
writeFileSync(join(publicDir, 'favicon.svg'), svgRound)
console.log('wrote favicon.png / favicon.svg (rounded)')
