const { readFileData } = require('../fileSystem/index.js')
const baseInfoMap = [
  'name', //0
  'code', //1
  'nowPrice', //4 =》2
  'percent', //11=》3
  'money', //12=》4
  'todayOpen', //2=》5
  'lastClose', //3=》6
  // 'nowPrice', //4
  'todayHigh', //5=》7
  'todayLow', //6=》8
  'buyOne', //7=》9
  'saleOne', //8=》10
  'totalCount', //9=》11
  'totalMoney', //10=》12
  'beforePrice', // 13
  'beforePercent', // 14
  'beforeCount', // 15
  // 'percent', //11
  // 'money', //12
  'date', //13=》16
  'time' //14=》17
]
const computePercentAndCount = (nowPrice, lastClose) => {
  const count = parseFloat(nowPrice) - parseFloat(lastClose)
  const percent = (count / parseFloat(lastClose)) * 100
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
  formatXueqiuKlineInfo: data => {},
  formatEquityBaseInfoHK: (data, name, list) => {
    let info = data.split(/[\n]/)

    info = info.length > 2 ? info.slice(0, info.length - 1) : info
    let result = []
    info.forEach((item, index) => {
      item = item.split(',')
      let info = []
      info[0] = !Array.isArray(name) ? name : name[index]
      info[1] = !Array.isArray(list) ? list : list[index]
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
      // 'nowPrice', //4 =》2
      // 'percent', //11=》3
      // 'money', //12=》4
      // 'todayOpen', //2=》5
      // 'lastClose', //3=》6
      // // 'nowPrice', //4
      // 'todayHigh', //5=》7
      // 'todayLow', //6=》8
      // 'buyOne', //7=》9
      // 'saleOne', //8=》10
      // 'totalCount', //9=》11
      // 'totalMoney', //10=》12
      // // 'percent', //11
      // // 'money', //12
      // 'date', //13=》13
      // 'time' //14=》14
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

    info = info.length > 2 ? info.slice(0, info.length - 1) : info
    let result = []
    info.forEach((item, index) => {
      //
      item = item.split(',')
      let info = []
      // temp[22]------0.00------ 盘前价格
      // temp[23]------0.00------ 盘前涨跌幅
      // temp[24]------------     盘前涨跌额

      const pre_count = computePercentAndCount(item[1], item[26])
      info[0] = !Array.isArray(name) ? name : name[index]
      info[1] = !Array.isArray(list) ? list : list[index]
      info[5] = toFixed2(item[5])
      info[6] = toFixed2(item[26])
      info[2] = toFixed2(item[1])
      info[7] = toFixed2(item[6])
      info[8] = toFixed2(item[7])
      info[9] = info[10] = 0
      info[11] = toFixedCount(item[10])
      info[12] = 0
      info[3] = pre_count[0]
      info[4] = pre_count[1]
      info[13] = toFixed2(item[21])
      info[14] = `${toFixed2(item[22])}%`
      info[15] = toFixed2(item[23])
      info[16] = item[3].split(' ')[0]
      info[17] = item[3].split(' ')[1]
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
    info = info.length > 2 ? info.slice(0, info.length - 1) : info
    info.forEach((item, index) => {
      item = item.split(',').slice(0, 32)
      const info = []
      const pre_count = computePercentAndCount(item[3], item[2])
      info[0] = !Array.isArray(name) ? name : name[index]
      info[1] = !Array.isArray(list) ? list : list[index]
      info[5] = toFixed2(item[1])
      info[6] = toFixed2(item[2])
      info[2] = toFixed2(item[3])
      info[7] = toFixed2(item[4])
      info[8] = toFixed2(item[5])
      info[9] = toFixed2(item[6])
      info[10] = toFixed2(item[7])
      info[11] = toFixedCount(item[8])
      info[12] = toFixedCount(item[9])
      info[3] = pre_count[0]
      info[4] = pre_count[1]
      info[13] = info[14] = info[15] = 0
      info[16] = item[item.length - 2]
      info[17] = item[item.length - 1]
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
  spellEquityPre: list => {
    const usNameMap = readFileData('data/equityMapNASD.json')
    const hkNameMap = readFileData('data/equityMapHK.json')
    list = list.map(item => {
      if (usNameMap[item]) {
        return `${equityPreNameMap[0]}${item}`
      } else if (hkNameMap[item]) {
        return `${equityPreNameMap[1]}${item}`
      } else {
        return item
      }
    })
    return list
  },
  isPassTime: (time1, time2, timespan) => {
    //? params begintime endtime span
    return new Date(time1).getTime() - new Date(time2).getTime() > timespan
  }
}
