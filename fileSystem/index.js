const { fs } = require('../dependenciesList/index.js')

function writeFileData(fileName, data) {
  data = JSON.stringify(data)
  console.log('----------开始拉取列表-------------')

  fs.writeFile(fileName, data, function(err) {
    if (err) {
      console.error(err)
    }
    console.log('----------拉取列表成功-------------')
  })
}

function isExists(file) {
  return fs.existsSync(file)
}
module.exports = { writeFileData }
