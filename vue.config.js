const path = require('path')
const name = 'Vue Typescript Admin'
const IS_PROD = ['production', 'development'].includes(process.env.NODE_ENV)

module.exports = {
  'publicPath': process.env.NODE_ENV === 'production' ? './' : '/', // TODO: Remember to change this to fit your need
  'lintOnSave': process.env.NODE_ENV === 'development',
  'pwa': {
    'name': name
  },
  'pluginOptions': {
    'style-resources-loader': {
      'preProcessor': 'scss',
      'patterns': [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  // 开启代理，映射到后端的接口
  devServer: {
    host: 'localhost',//本地的
    port: 8888,
    // public: '192.168.91.1:8888', //Network的ip:端口号，这里是私网
    open: true,
    disableHostCheck: true,
    hot: true,//自动保存
    overlay: {
      warnings: false,
      errors: true
    },
    // 设置代理，由此隐藏后端接口，也能借此处理跨域问题（在前端和后端中选择其一处理即可）。
    proxy: {
      '/api': {
        target: process.env.VUE_APP_URL, //在根目录的.env.development文件下设置后端服务地址
        ws: false,
        secure: false,//非https
        changeOrigin: true,//设置此来解决前后端跨域问题，如果后端已经设置了，那么前端就不用设置！
        // 表示请求接口时去掉api
        // '^/api'表示匹配到以/api开头的请求路径
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(true) // 修复热更新失效
  },
  configureWebpack: {
    devtool: 'source-map'
  },

  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: IS_PROD,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
  },
};
