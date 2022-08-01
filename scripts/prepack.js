const path = require('path')
const fs = require('fs')
const packagePath = path.resolve('./package.json')
const readmePath = path.resolve('./README.md')
const package = require(packagePath)
const readme = fs.readFileSync(readmePath, 'utf8')
package.readme = readme
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2))