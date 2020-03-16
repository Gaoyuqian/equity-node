module.exports = {
  key2val: (obj, key) => {
    let result = key.map(item => {
      return obj[item.toLowerCase()]
    })
    return result
  },
  mapEquityData: str => {
    let data = {}
    str = str.flat()
    str.forEach(item => {
      let arr = item.split(',')
      if (arr[1]) {
        data[arr[1].toLowerCase()] = arr[2]
      }
    })
    return data
  },
  isPassTime: (time1, time2, timespan) => {
    //? params begintime endtime span
    console.log(time1, time2, timespan)
    return new Date(time1).getTime() - new Date(time2).getTime() > timespan
  }
}
