const fs = require('fs')
const path = require('path')

const target = process.argv[2]
if (!target) {
  console.error('No target file specified')
  process.exit(1)
}

const dir = path.dirname(target)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const content = fs.readFileSync(0, 'utf8')
fs.writeFileSync(target, content, 'utf8')
console.log('Saved: ' + target)
