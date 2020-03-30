const { app } = require('./index.js')
const {
  getSingleEquityInfo,
  getDayKlineInfo,
  getMinuteLineInfo
} = require('../http2service/requestEquity.js')
const equityObj = require('../data/equityData2Code.json')
const {
  formatEquityBaseInfoCN,
  formatEquityBaseInfoUS,
  formatEquityBaseInfoHK,
  key2val,
  spellEquityPre,
  formatXueqiuKlineInfo2KeyValue,
  getXueqiuInfo
} = require('../util/format.js')
function main() {
  // 获取个股信息或多个股票的信息
  app.get('/equity/getBaseInfo', (req, res) => {
    // us：道指 纳指 标普
    // hk：恒指
    // cn：上指 深指 创业板指数
    let { channel } = req.query
    const map = {
      cn: ['sh000001', 'sz399001', 'sz399006'],
      hk: ['hkHSI'],
      us: ['gb_dji', 'gb_ixic', 'gb_inx'],
      all: ['sh000001', 'sz399001', 'sz399006', 'hkHSI', 'gb_dji', 'gb_ixic', 'gb_inx']
    }
    channel = channel ? channel.toLowerCase() : 'all'
    if (channel !== 'us' && channel !== 'hk' && channel !== 'cn') {
      res.send({ code: 0, error: 'channel info error' })
      return
    }
    getSingleEquityInfo(map[channel], channel === 'hk' || channel === 'all' ? false : true).then(
      data => {
        //根据不同地区 写不同的整合函数 写入util
        let name = []
        let list = []
        let result = []
        if (channel === 'us' || channel === 'all') {
          name = ['道琼斯', '纳斯达克', '标普500']
          list = ['gb_dji', 'gb_ixic', 'gb_inx']
          result = formatEquityBaseInfoUS(data, name, list)
        } else if (channel === 'hk' || channel === 'all') {
          name = ['恒生指数']
          list = ['hkHSI']
          result = formatEquityBaseInfoHK(data, name, list)
        } else if (channel === 'cn' || channel === 'all') {
          name = ['上证指数', '深成指数', '创业板']
          list = ['sh000001', 'sz399001', 'sz399006']
          result = formatEquityBaseInfoCN(data, name, list)
        }
        res.send({ code: 1, result, requestDate: new Date().getTime() })
      }
    )
  })
  app.get('/equity/getSingleDayInfo', (req, res) => {
    let { list } = req.query
    list = list.split(',')
    const name = key2val(equityObj, list)
    list = spellEquityPre(list)
    let result = []
    getSingleEquityInfo(list)
      // 写成通用的接口
      .then(
        data => {
          // 需要判断查询的是哪个地区的股票 作区分
          data = data.split(/[\n]/)
          list.forEach((item, index) => {
            if (item.startsWith('gb_')) {
              result.push(...formatEquityBaseInfoUS(data[index], name[index], [item]))
            } else if (item.startsWith('hk')) {
              result.push(...formatEquityBaseInfoHK(data[index], name[index], [item]))
            } else {
              result.push(...formatEquityBaseInfoCN(data[index], name[index], [item]))
            }
          })
          res.send({
            code: 1,
            result,
            requestDate: new Date().getTime()
          })
        },
        error => {
          res.send({
            code: 0,
            error: error
          })
        }
      )
  })
  app.get('/equity/getDayLineInfo', (req, res) => {
    // query { symbol,columnList what you need }
    getDayKlineInfo(req.query).then(data => {
      let { symbol, column } = req.query

      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
      // let _data = formatXueqiuKlineInfo(data, req.query.column || data.data.column)
      // let _data = formatXueqiuKlineInfo2KeyValue(data, req.query.column || data.data.column)
      let _data = formatXueqiuKlineInfo2KeyValue(data, column || data.data.column)
      let __data = getXueqiuInfo(_data)
      res.send({
        code: 1,
        result: __data,
        symbol,
        requestDate: new Date().getTime()
      })
    })
  })
  app.get('/equity/getBaseInfoXueqiu', (req, res) => {
    // formatXueqiuKlineInfo
    getMinuteLineInfo(req.query).then(
      data => {
        let { symbol, column } = req.query
        const _data = getXueqiuInfo(JSON.parse(data).data.items, column)
        res.send({
          code: 1,
          result: _data,
          symbol,
          requestDate: new Date().getTime()
        })
      },
      err => {}
    )
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
