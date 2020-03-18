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
  'date',
  'time'
]
const equityPreNameMap = ['gb_', 'hk']
// 美股股票代码前加gb_,港股加hk
module.exports = {
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
    console.log(info)
    info.forEach((item, index) => {
      item = item.split(',')
      let info = []
      info[0] = name[index]
      info[1] = list[index]
      info[2] = item[2]
      info[3] = item[3]
      info[4] = item[6]
      info[5] = item[4]
      info[6] = item[5]
      info[7] = item[9]
      info[8] = item[10]
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
      item = item.split(',')
      let info = []
      info[0] = name[index]
      info[1] = list[index]
      info[2] = item[5]
      info[3] = item[26]
      info[4] = item[1]
      info[5] = item[6]
      info[6] = item[7]
      info[7] = info[8] = info[9] = info[10] = 0
      info[11] = item[3].split(' ')[0]
      info[12] = item[3].split(' ')[1]
      let objRes = {}
      console.log(info)
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
      item.splice(0, 1, name[index])
      item.splice(1, 0, list[index])
      item.splice(11, item.length - 13)
      let objRes = {}
      item.forEach((val, key) => {
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
