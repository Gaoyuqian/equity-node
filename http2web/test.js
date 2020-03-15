const { app } = require('./index.js')
const { mainRq } = require('../http2service/requestEquity.js')
const equityObj = require('../data/equityData2Code.json')
const util = require('../util/format.js')
function main() {
  app.get('/test/getInfo', (req, res) => {
    let { list } = req.query
    list = [...list]
    const name = util.key2val(equityObj, list)
    mainRq(list, name)
      // 写成通用的接口
      .then(data => {
        let result = data.split(/[\n]/)
        result = result.slice(0, result.length - 1)
        let carry = 0
        result = result.map(item => {
          item = item.split(',').slice(0, 32)
          item[0] = name[carry]
          item.push(list[carry])
          carry++
          return item
        })
        res.send({
          code: 1,
          result
        })
      })
      .catch(error => {
        res.send({
          code: 0,
          error: error
        })
      })
  })
}

module.exports = { main }
