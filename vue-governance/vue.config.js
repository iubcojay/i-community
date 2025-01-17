const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  runtimeCompiler: true,
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  devServer: {
    port: "8080",
    host: '0.0.0.0',
    https: false,
    open: false,
    allowedHosts: "all",
    // client: {
    //   webSocketURL: 'ws://0.0.0.0:8081/ws',
    // },
  },

  // 处理web worker
  chainWebpack: config => {
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)            // 文件名必须要xxx.worker.js
      .use('worker')
      .loader('worker-loader')
  }
})
