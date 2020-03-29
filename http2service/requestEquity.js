const {
  rq,
  iconv,
  http,
  cheerio,
  tough
} = require('../dependenciesList/index.js')

let cookie = new tough.Cookie({
  key: 'xqat',
  value: '2ee68b782d6ac072e2a24d81406dd950aacaebe3',
  domain: 'stock.xueqiu.com',
  httpOnly: true,
  maxAge: 31536000
})
let jar = rq.jar()
jar.setCookie(cookie.toString(), 'http://stock.xueqiu.com')
const opt = {
  url: 'http://hq.sinajs.cn/list=sh601006',
  transform: body => iconv.decode(body, 'gb2312')
}
// const url = 'http://hq.sinajs.cn/list=sh601006'
// http://api.jinshuyuan.net/get_stk_dic //获取a股所有股票名称
// http://api.jinshuyuan.net/get_stkhk_dic 获取港股所有股票名称

// http://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=BIDU&begin=1585218102683&period=day&type=before&count=-242
function getSingleEquityInfo(opt, format = true) {
  opt = opt.map(item => {
    return format ? item.toLowerCase() : item
  })
  // getSingleEquityInfo

  return rq(`http://hq.sinajs.cn/list=${opt.join(',')}`)
}
function getDayKlineInfo(opt_) {
  // opt.symbol
  const opt = Object.assign(
    {
      begin: new Date().getTime(),
      period: 'day',
      type: 'before',
      count: '-242'
    },
    opt_
  )
  const url = `http://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=${opt.symbol.toUpperCase()}&begin=${
    opt.begin
  }&period=${opt.period}&type=${opt.type}&count=${opt.count}`
  const opt$ = {
    url,
    jar
  }
  return rq(opt$)
}
function getAllEquityInfoCN() {
  let opt = {
    url: 'http://api.jinshuyuan.net/get_stk_dic',
    transform: body => body.split('<br/>').slice(1)
  }
  return rq(opt)
}
function getSomePointEquityInfoUS() {
  // 新浪爬取
  return new Promise((resolve, reject) => {
    http.get(
      'http://vip.stock.finance.sina.com.cn/usstock/ustotal.php',
      res => {
        var length = 0
        var arr = []
        let result = []
        let reg = /^(.*(?=\())\((.+?)\)/
        res.on('data', function(chunk) {
          arr.push(chunk)
          length += chunk.length
        })
        res.on(
          'end',
          () => {
            var data = Buffer.concat(arr, length)
            var change_data = iconv.decode(data, 'gb2312')
            var $ = cheerio.load(change_data.toString())
            $('.col_div a').each(async (index, item) => {
              let ele = $(item)
              if (ele.text()) {
                const title = ele.text()
                const res = title.match(reg)
                result.push(`${index},${res[2]},${res[1]}`)
              }
            })
            result.push(`999,ixic,纳斯达克`)
            result.push(`1000,dji,道琼斯`)
            result.push(`1001,inx,标普500`)
            resolve(result)
          },
          err => {}
        )
      }
    )
  })
}
function getAllEquityInfoHK() {
  let opt = {
    url: 'http://api.jinshuyuan.net/get_stkhk_dic',
    transform: body => body.split('<br/>').slice(1)
  }
  return rq(opt)
}
function getAllEquityInfo() {
  return Promise.all([
    getAllEquityInfoCN(),
    getAllEquityInfoHK(),
    getSomePointEquityInfoUS()
  ])
}
module.exports = {
  getDayKlineInfo,
  getSingleEquityInfo,
  getAllEquityInfo,
  getAllEquityInfoCN
}
