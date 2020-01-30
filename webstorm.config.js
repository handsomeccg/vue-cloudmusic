'use strict'
// eslint-disable-next-line no-undef
System.config({
  'paths': {
    '@/*': 'src/*'
  }
})
const webpackConfig = require('@vue/cli-service/webpack.config.js')
module.exports = webpackConfig
// 为了组件可以跳转
