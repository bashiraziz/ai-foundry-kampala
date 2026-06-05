const sharp = require('sharp')
const path = require('path')

const exports_list = [
  { input: 'public/brand/favicon.svg',           output: 'public/brand/icon-16.png',   size: 16  },
  { input: 'public/brand/favicon.svg',           output: 'public/brand/icon-32.png',   size: 32  },
  { input: 'public/brand/favicon.svg',           output: 'public/brand/icon-48.png',   size: 48  },
  { input: 'public/brand/favicon.svg',           output: 'public/brand/icon-144.png',  size: 144 },
  { input: 'public/brand/favicon.svg',           output: 'public/brand/icon-512.png',  size: 512 },
  { input: 'public/brand/hero-mark.svg',         output: 'public/brand/hero-mark.png', size: 800 },
  { input: 'public/brand/lockup-horizontal.svg', output: 'public/brand/lockup.png',    width: 960, height: 160 },
]

async function run() {
  for (const e of exports_list) {
    const opts = e.size
      ? { width: e.size, height: e.size }
      : { width: e.width, height: e.height }
    await sharp(e.input).resize(opts).png().toFile(e.output)
    console.log(`✓ ${e.output}`)
  }
}

run().catch(console.error)
