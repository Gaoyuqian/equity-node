const { getAllEquityInfo } = require('../http2service/requestEquity.js')
const { writeFileData } = require('../fileSystem/index.js')
const { app } = require('../http2web/index.js')
const { main } = require('../http2web/test.js')

function write() {
  //? 每次服务器启动的时候 爬取所有股票code对应name信息（美股港股a股）
  //! 可以优化为记录上一次启动时间 防止多次爬取 3.15
  getAllEquityInfo().then(str => {
    str = str.split('<br/>').slice(1)
    let data = {}
    str.forEach(item => {
      let arr = item.split(',')
      if (arr[1]) {
        data[arr[1].toLowerCase()] = arr[2]
      }
    })
    writeFileData('data/equityData2Code.json', data)
  })
}
main()
app.listen('8080', () => {})
write()
