const { app } = require('../dependenciesList/index.js')

app.use('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'text/html; charset=GB2312')
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

// 写拦截器

// 集合所有接口

module.exports = { app }
