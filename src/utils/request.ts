import axios, { AxiosAdapter } from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user' //这里是管理员的模块
import {
  getRequestKey,
  pending,
  checkPending,
  removePending
} from './requestOptimize'
import router from '@/router'
const CancelToken = axios.CancelToken;

const service = axios.create({
  // baseURL: '/api' + '/admin', 通过代理技术隐藏后端的真实IP地址！
  baseURL: process.env.VUE_APP_BASE_API + '/admin',
  'timeout': 600000
})

// Request interceptors
service.interceptors.request.use(
  (config: any) => {
    // console.log(config, 'config')
    // config.data = config.params
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['token'] = UserModule.token
    }
    // else if (UserModule.token && config.url != '/') {
    //   window.location.href = '/'
    //   return false
    // }

    // config.headers['Access-Control-Allow-Origin'] = '*'
    // config.headers['Content-Type'] = 'application/json;'
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      var url = config.url + '?';
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + '=';//如果值为空的话就后面不会拼接到url里面！
        if (value !== null && typeof (value) !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              let params = propName + '[' + key + ']';
              var subPart = encodeURIComponent(params) + '=';
              url += subPart + encodeURIComponent(value[key]) + '&';
            }
          } else {
            url += part + encodeURIComponent(value) + '&';
          }
        }
      }
      url = url.slice(0, -1);//去掉最后一个多余的&
      config.params = {};
      config.url = url;
    }
    console.log('此时请求的url为,', config.url);//这个url是不包括baseUrl的，比如/api/admin/order/statistics去掉前面的/api/admin
    // 计算当前请求key值
    const key = getRequestKey(config);
    // console.log(pending,key,checkPending(key),'checkPending(key)')
    if (checkPending(key)) {
      // 重复请求则取消当前请求
      const source = CancelToken.source();
      config.cancelToken = source.token;
      // 此时直接作出取消操作,并给出一个几秒后自带的自动消失的消息提示框。
      // 然后直接进入service.interceptors.response的error回调函数。
      source.cancel('重复请求');
    } else {
      // 加入请求字典
      pending[key] = true;
    }
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response: any) => {
    // // 在2xx范围内的任何状态代码都会触发此函数，这里主要用于处理响应数据
    // console.log(response, 'response')
    if (response.data.status === 401) {
      router.push('/')
      // const res = response.data
      // return response
    }
    console.log('此时response.config.url为：', response.config.url)
    //请求响应中的config的url会带上代理的api需要去掉
    response.config.url = response.config.url.replace('/api/admin', '')
    // 请求完成，删除请求中状态
    const key = getRequestKey(response.config);
    removePending(key);
    console.log('response后，checkPending(key)为', checkPending(key));
    console.log('response后，自定义的状态码response.data.code为：', response.data.code);
    if (response.data.code === 0) {
      Message.error(response.data.msg)
      // if(response.data.msg === 'NOTLOGIN' || response.data.msg === '未登录'){
      //   router.push('/login')
      // }
      // return window.location.href = '/login'
      // window.location.href = '/login'
      // return false
    } else if (response.data.code === 1) {
      // const res = response.data
      return response
    }
    return response
  },
  // 任何超出2xx范围的状态码都会触发此函数，这里主要用于处理响应错误
  (error: any) => {
    console.log('从本次响应中可以看出，此时的错误为：', error);
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/')
          break;
        case 405:
          error.message = '请求错误'
      }
    }
    // 直接访问对象为undefined的，是不会error的。
    console.log('error.config如下：', error.config);
    // 如果访问对象为undefined的属性，那么就会直接出现error，直接中断该函数的进行！！
    // 并且会改变执行source.cancel('重复请求')后的弹窗中的报错信息！！
    // console.log(' error.config.url如下：', error.config.url);
    if (error.config) {
      //请求响应中的config的url会带上代理的api需要去掉
      // /api/admin/order/statistics变为/order/statistics以对应上service.interceptors.request中的不包括baseUrl的用法。
      error.config.url = error.config.url.replace('/api/admin', '')
      // 请求完成，删除请求中状态
      const key = getRequestKey(error.config);
      removePending(key);
      console.log('出现error后，checkPending(key)为', checkPending(key));
      console.log(error, pending, 'error11')
    }
    // 加上这个消息提示框，实际上一个重复请求会出现2个显示几乎一样的信息的消息提示框（一个是固定的，一个是自定义的）
    Message({
      'message': 'error回调函数中，错误信息为：' + error.message,
      'type': 'error',
      'duration': 5 * 1000
    })
    console.log('error处理已经结束');
    // router.push('/')

    // 将未处理的异常往外抛，即已拒绝（rejected）的 Promise 对象，拒绝原因为给定的参数。
    return Promise.reject(error)
  }
)

export default service
