
// vue.config.js
const vueConfig = {
  devServer: {
    // development server port 8000
    port: 8001,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/': {
        target: 'https://music.linkorg.club/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' // rewrite path
        }
      }
    }
  }
}

module.exports = vueConfig
