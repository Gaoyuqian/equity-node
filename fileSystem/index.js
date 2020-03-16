const { fs } = require('../dependenciesList/index.js')

function writeFileData(fileName, data) {
  data = JSON.stringify(data)
  fs.writeFile(fileName, data, function(err) {
    if (err) {
      console.error(err)
      console.log('----------拉取列表失败-------------')
    }
  })
}

function readFileData(fileName) {
  if (!isExists(fileName)) {
    return new Error('读取文件失败,找不到要读取的文件')
  }
  try {
    return JSON.parse(fs.readFileSync(fileName, 'utf-8'))
  } catch (e) {
    return fs.readFileSync(fileName, 'utf-8')
  }
}

function isExists(file) {
  return fs.existsSync(file)
}
module.exports = { writeFileData, readFileData }
