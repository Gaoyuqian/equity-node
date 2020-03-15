const { rq, iconv } = require('../dependenciesList/index.js')

const opt = {
  url: 'http://hq.sinajs.cn/list=sh601006',
  transform: body => iconv.decode(body, 'gb2312')
}
// const url = 'http://hq.sinajs.cn/list=sh601006'
// http://api.jinshuyuan.net/get_stk_dic //获取a股所有股票名称
function mainRq(opt) {
  opt = opt.map(item => {
    return item.toLowerCase()
  })
  return rq(`http://hq.sinajs.cn/list=${opt.join(',')}`)
}
function getAllEquityInfo(channel) {
  return rq('http://api.jinshuyuan.net/get_stk_dic')
}
module.exports = { mainRq, getAllEquityInfo }
