const { getAllEquityInfo } = require('../http2service/requestEquity.js')
const { writeFileData, readFileData } = require('../fileSystem/index.js')
const { app } = require('../http2web/index.js')
const { main } = require('../http2web/equity.js')
const { mapEquityData, isPassTime } = require('../util/format.js')

function write() {
  //? 每次服务器启动的时候 爬取所有股票code对应name信息（美股港股a股）
  //? 已优化为记录上一次启动时间 防止多次爬取 3.15？ 3.16/17.18
  const lastUpdateTime = readFileData('data/lastUpdateEquityInfo.json')
  const nowDate = new Date()
  const oneDay = 86400000
  if (isPassTime(nowDate, lastUpdateTime, oneDay)) {
    getAllEquityInfo().then(str => {
      console.log('----------开始拉取列表-------------')
      writeFileData('data/equityData2Code.json', mapEquityData(str))
      writeFileData('data/equityMapCN.json', mapEquityData(str[0]))
      writeFileData('data/equityMapHK.json', mapEquityData(str[1]))
      writeFileData('data/equityMapNASD.json', mapEquityData(str[1]))
      writeFileData('data/lastUpdateEquityInfo.json', nowDate)
      console.log('----------拉取列表成功-------------')
    })
  } else {
    console.log('距离上次更新时间不足一天，暂不更新')
  }
}
main()
app.listen('8080', () => {})
write()
