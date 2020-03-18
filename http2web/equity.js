const { app } = require('./index.js')
const { getSingleEquityInfo } = require('../http2service/requestEquity.js')
const equityObj = require('../data/equityData2Code.json')
const {
  formatEquityBaseInfoCN,
  formatEquityBaseInfoUS,
  formatEquityBaseInfoHK,
  key2val
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
      all: [
        'sh000001',
        'sz399001',
        'sz399006',
        'hkHSI',
        'gb_dji',
        'gb_ixic',
        'gb_inx'
      ]
    }
    if (!channel) {
      getSingleEquityInfo(map['all']).then(data => {
        //根据不同地区 写不同的整合函数 写入util
        formatEquityBaseInfoUS(
          data,
          [
            '上证指数',
            '深成指数',
            '创业板指数',
            '恒生指数',
            '道琼斯指数',
            '纳斯达克指数',
            '标普500指数'
          ],
          [
            'sh000001',
            'sz399001',
            'sz399006',
            'hkHSI',
            'gb_dji',
            'gb_ixic',
            'gb_inx'
          ]
        )
        // res.send({ code: 0, result: data })
      })
    }
    channel = channel.toLowerCase()
    if (channel !== 'us' && channel !== 'hk' && channel !== 'cn') {
      res.send({ code: 0, error: 'channel info error' })
      return
    }
    getSingleEquityInfo(map[channel], channel === 'hk' ? false : true).then(
      data => {
        //根据不同地区 写不同的整合函数 写入util
        let name = []
        let list = []
        let result = []
        if (channel === 'us') {
          name = ['道琼斯指数', '纳斯达克指数', '标普500指数']
          list = ['gb_dji', 'gb_ixic', 'gb_inx']
          result = formatEquityBaseInfoUS(data, name, list)
        } else if (channel === 'hk') {
          name = ['恒生指数']
          list = ['hkHSI']
          result = formatEquityBaseInfoHK(data, name, list)
        } else {
          name = ['上证指数', '深成指数', '创业板指数']
          list = ['sh000001', 'sz399001', 'sz399006']
          result = formatEquityBaseInfoCN(data, name, list)
        }
        res.send({ code: 1, result })
      }
    )
  })
  app.get('/equity/getSingleDayInfo', (req, res) => {
    let { list } = req.query
    list = list.split(',')
    const name = key2val(equityObj, list)
    getSingleEquityInfo(list)
      // 写成通用的接口
      .then(data => {
        const result = formatEquityBaseInfoCN(data, name, list)
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

/*

TODO： 美股相关数据 获取不同纬度的数据（日级别，分钟级别，周，月）

个股详情 每日折线图 根据分钟级别的数据绘出 （只显示区间）
不同纬度的 优先展示至可展示最大数量值 通过懒加载的方式进行超纬度加载
获取股票基础信息
（不同股市返回的字段不一样 需要区分处理）
研究新浪股票接口

*/
module.exports = { main }
