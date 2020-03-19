const baseInfoMap = [
  'name',
  'code',
  'todayOpen',
  'lastClose',
  'nowPrice',
  'todayHigh',
  'todayLow',
  'buyOne',
  'saleOne',
  'totalCount',
  'totalMoney',
  'percent',
  'money',
  'date',
  'time'
]
const computePercentAndCount = (nowPrice, lastClose) => {
  const count = parseInt(nowPrice) - parseInt(lastClose)
  const percent = (count / parseInt(lastClose)) * 100
  return [percent.toFixed(2), count.toFixed(2)]
}
const toFixed2 = str => {
  return Number(str).toFixed(2)
}
const toFixedCount = str => {
  const len = str.length
  str = parseInt(str)
  if (len >= 9) {
    let text = '亿'
    str = toFixed2(str / 100000000) + text
  } else if (len >= 5) {
    let text = '万'
    str = toFixed2(str / 10000) + text
  }
  return str
}
const equityPreNameMap = ['gb_', 'hk']
// 美股股票代码前加gb_,港股加hk
module.exports = {
  computePercentAndCount,
  toFixed2,
  toFixedCount,
  key2val: (obj, key) => {
    let result = key.map(item => {
      return obj[item.toLowerCase()]
    })
    return result
  },
  formatEquityBaseInfoHK: (data, name, list) => {
    let info = data.split(/[\n]/)

    info = info.slice(0, info.length - 1)
    let result = []
    info.forEach((item, index) => {
      item = item.split(',')
      let info = []
      info[0] = name[index]
      info[1] = list[index]
      info[2] = toFixed2(item[2])
      info[3] = toFixed2(item[3])
      info[4] = toFixed2(item[6])
      info[5] = toFixed2(item[4])
      info[6] = toFixed2(item[5])
      info[7] = toFixed2(item[9])
      info[8] = toFixed2(item[10])
      info[9] = item[11]
      info[10] = item[12]
      info[11] = item[17]
      info[12] = item[18]
      let objRes = {}
      info.forEach((val, key) => {
        objRes[baseInfoMap[key]] = val
      })
      result.push(objRes)
    })
    return result
  },
  formatEquityBaseInfoUS: (data, name, list) => {
    let info = data.split(/[\n]/)
    info = info.slice(0, info.length - 1)
    let result = []
    info.forEach((item, index) => {
      //
      item = item.split(',')
      let info = []
      // temp[22]------0.00------ 盘前价格
      // temp[23]------0.00------ 盘前涨跌幅
      // temp[24]------------     盘前涨跌额
      const pre_count = computePercentAndCount(item[1], item[26])
      console.log(item[1])
      info[0] = name[index]
      info[1] = list[index]
      info[2] = toFixed2(item[5])
      info[3] = toFixed2(item[26])
      info[4] = toFixed2(item[1])
      info[5] = toFixed2(item[6])
      info[6] = toFixed2(item[7])
      info[7] = info[8] = 0
      info[9] = toFixedCount(item[10])
      info[10] = 0
      info[11] = pre_count[0]
      info[12] = pre_count[1]
      info[13] = item[3].split(' ')[0]
      info[14] = item[3].split(' ')[1]
      let objRes = {}

      info.forEach((val, key) => {
        objRes[baseInfoMap[key]] = val
      })
      result.push(objRes)
    })
    return result
  },
  formatEquityBaseInfoCN: (data, name, list) => {
    // params = sina list返回的元数据
    // list相关的数据只需要前9个后后两个+push一个缩写
    // return 组装好的数据 Array
    let result = []
    let info = data.split(/[\n]/)
    info = info.slice(0, info.length - 1)
    info.forEach((item, index) => {
      item = item.split(',').slice(0, 32)
      const info = []
      const pre_count = computePercentAndCount(item[3], item[2])
      info[0] = name[index]
      info[1] = list[index]
      info[2] = toFixed2(item[1])
      info[3] = toFixed2(item[2])
      info[4] = toFixed2(item[3])
      info[5] = toFixed2(item[4])
      info[6] = toFixed2(item[5])
      info[7] = toFixed2(item[6])
      info[8] = toFixed2(item[7])
      info[9] = toFixedCount(item[8])
      info[10] = toFixedCount(item[9])
      info[11] = pre_count[0]
      info[12] = pre_count[1]
      info[13] = item[item.length - 2]
      info[14] = item[item.length - 1]
      let objRes = {}
      info.forEach((val, key) => {
        objRes[baseInfoMap[key]] = val
      })
      result.push(objRes)
    })
    return result
  },
  mapEquityData: str => {
    let data = {}
    str = str.flat()
    str.forEach(item => {
      let arr = item.split(',')
      if (arr[1]) {
        data[arr[1].toLowerCase()] = arr[2].toLowerCase()
      }
    })
    return data
  },
  mapEquityDataFromSina: array => {
    let data = {}
  },
  isPassTime: (time1, time2, timespan) => {
    //? params begintime endtime span
    return new Date(time1).getTime() - new Date(time2).getTime() > timespan
  }
}
