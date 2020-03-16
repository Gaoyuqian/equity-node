const { rq, iconv } = require('../dependenciesList/index.js')
const { mapEquityData } = require('../util/format.js')

const opt = {
  url: 'http://hq.sinajs.cn/list=sh601006',
  transform: body => iconv.decode(body, 'gb2312')
}
// const url = 'http://hq.sinajs.cn/list=sh601006'
// http://api.jinshuyuan.net/get_stk_dic //获取a股所有股票名称
// http://api.jinshuyuan.net/get_stkhk_dic 获取港股所有股票名称
function getSingleEquityInfoCN(opt) {
  opt = opt.map(item => {
    return item.toLowerCase()
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
function getAllEquityInfoHK(channel) {
  let opt = {
    url: 'http://api.jinshuyuan.net/get_stkhk_dic',
    transform: body => body.split('<br/>').slice(1)
  }
  return rq(opt)
}
function getAllEquityInfo() {
  return Promise.all([getAllEquityInfoCN(), getAllEquityInfoHK()])
}
module.exports = { getSingleEquityInfoCN, getAllEquityInfo, getAllEquityInfoCN }
