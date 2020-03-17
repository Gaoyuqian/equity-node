const { app } = require('./index.js')
const { getSingleEquityInfoCN } = require('../http2service/requestEquity.js')
const equityObj = require('../data/equityData2Code.json')
const util = require('../util/format.js')
function main() {
  // 获取个股信息或多个股票的信息
  app.get('/equity/getSingleDayInfo', (req, res) => {
    let { list } = req.query
    list = list.split(',')
    const name = util.key2val(equityObj, list)
    getSingleEquityInfoCN(list, name)
      // 写成通用的接口
      .then(data => {
        let carry = 0
        let info = data.split(/[\n]/)
        if (data.length < 4) {
          res.send({
            code: 0,
            error: '母接口查询错误'
          })
          return
        }
        info = info.slice(0, info.length - 1)
        info = info.map(item => {
          // 组装返回给web端的数据
          // params: info ===== 组装成功的数据 也可以写入数据库
          item = item.split(',').slice(0, 32)
          item[0] = name[carry]
          item.push(list[carry])
          carry++
          return item
        })
        res.send({
          code: 1,
          result: { info }
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

/*

TODO： 美股相关数据 获取不同纬度的数据（日级别，分钟级别，周，月）

个股详情 每日折线图 根据分钟级别的数据绘出 （只显示区间）
不同纬度的 优先展示至可展示最大数量值 通过懒加载的方式进行超纬度加载
获取股票基础信息
（不同股市返回的字段不一样 需要区分处理）
研究新浪股票接口

*/
module.exports = { main }
