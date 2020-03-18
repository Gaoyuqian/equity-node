const { rq, iconv, http, cheerio } = require('../dependenciesList/index.js')

const opt = {
  url: 'http://hq.sinajs.cn/list=sh601006',
  transform: body => iconv.decode(body, 'gb2312')
}
// const url = 'http://hq.sinajs.cn/list=sh601006'
// http://api.jinshuyuan.net/get_stk_dic //获取a股所有股票名称
// http://api.jinshuyuan.net/get_stkhk_dic 获取港股所有股票名称
function getSingleEquityInfo(opt, format = true) {
  opt = opt.map(item => {
    return format ? item.toLowerCase() : item
  })
  return rq(`http://hq.sinajs.cn/list=${opt.join(',')}`)
}
function getAllEquityInfoCN(channel) {
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
            resolve(result)
          },
          err => {
            console.log('error', err)
          }
        )
      }
    )
  })
}
function getAllEquityInfoHK(channel) {
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
module.exports = { getSingleEquityInfo, getAllEquityInfo, getAllEquityInfoCN }
