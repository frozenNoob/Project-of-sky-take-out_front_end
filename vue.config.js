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
    // host和port是指定能够监听的IP地址和端口，必须包括public,不然会无法访问！！!!!!!!
    // '0.0.0.0'表示将devServer监听所有可用的网络接口，即可以通过所有网络接口进行访问，
    // 而不仅限于localhost或127.0.0.1或10.253.1.216
    // host: '0.0.0.0',//表示监听10.253.1.216，这样才能通过这个IP来交流
    port: 8888,// port是空闲端口，不配置时默认为8080
    // // // public是指定我的本地IP
    // public: '10.253.1.216:8888', //本地的ip:端口号，外部可以访问的IP地址，这里是私网IP，在
    open: true,//打开默认浏览器
    // HTTP请求中，可以通过Host header来指定请求的IP地址或域名
    // 当设置为true时，webpack-dev-server将不再检查访问它的主机的host header，并允许任何host（主机）访问。
    disableHostCheck: true,
    //设置为true时，当代码发生变化时，webpack-dev-server会在不刷新整个页面的情况下，实时地将变化的模块替换到已经运行的应用中，实现实时预览效果，提高开发效率。
    hot: true,
    // 是否被覆盖
    overlay: {
      warnings: false,
      errors: true
    },
    // 设置代理，由此隐藏后端接口，也能借此处理跨域问题（在前端和后端中选择其一处理即可）。
    // 来解决前后端跨域问题，如果后端已经设置了，那么前端就不用设置！
    proxy: {
      '/api': {
        // 这里VUE_APP_URL = 'http://localhost:8080/admin'
        target: process.env.VUE_APP_URL, //在根目录的.env.development（开发环境）文件下设置后端服务地址
        ws: false,
        secure: false,//非https
        changeOrigin: true,//设置此就能该改变后端的localhost为后端的私网/公网IP地址，而非环回地址localhost。
        // '^/api'表示匹配到以/api开头的请求路径
        // 表示请求接口时去掉原先的路径
        pathRewrite: {
          '^/api': ''
        }
      },
      //
      '/ws': {
        target: process.env.VUE_APP_SOCKET_URL,
        ws: true,
        secure: false,//非https
        pathRewrite: { '^/ws': '' }//把以/ws开头的字符串去掉开头的/ws
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
