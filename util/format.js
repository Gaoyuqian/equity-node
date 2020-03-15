module.exports = {
  key2val: (obj, key) => {
    key = [...key]
    let result = key.map(item => {
      return obj[item.toLowerCase()]
    })
    return result
  }
}
