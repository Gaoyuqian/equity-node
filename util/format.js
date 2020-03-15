module.exports = {
  key2val: (obj, key) => {
    let result = key.map(item => {
      return obj[item.toLowerCase()]
    })
    return result
  }
}
