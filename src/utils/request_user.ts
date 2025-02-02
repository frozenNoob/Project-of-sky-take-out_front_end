import axios, { AxiosAdapter } from 'axios'
import { Message, MessageBox } from 'element-ui'

import {
  getRequestKey,
  pending,
  checkPending,
  removePending
} from './requestOptimize'
import router from '@/router'
//这个是用于当进行一次未完成的请求（还没得到响应）时，取消同样的请求，避免多次点击浪费资源。
const CancelToken = axios.CancelToken;

const service = axios.create({
  // 后端的接口，直接暴露在这里而没有设置代理，以此验证后端跨域策略。
  // baseURL: '/api' + '/user', 通过代理技术隐藏后端的真实IP地址！
  baseURL: process.env.VUE_APP_BASE_API + '/user',
  'timeout': 600000
})

// Request interceptors
service.interceptors.request.use(
  (config: any) => {
    // console.log(config, 'config')
    // config.data = config.params
    // Add X-Access-Token header to every request, you can add other custom headers here
    let token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    } else {
      console.log('用户端未找到token');
    }
    // else if (token && config.url != '/') {
    //   window.location.href = '/'
    //   return false
    // }

    // config.headers['Access-Control-Allow-Origin'] = '*'
    // config.headers['Content-Type'] = 'application/json;'
    // get请求映射params参数
    if ((config.method === 'get' || config.method === 'delete') && config.params) {
      let url = config.url + '?';
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + '=';
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
      url = url.slice(0, -1);//去掉最后一个多余的'&'
      config.params = {};
      config.url = url;
    }
    console.log('user中，request的url为：', config.url)
    // 计算当前请求key值
    const key = getRequestKey(config);
    // console.log(pending,key,checkPending(key),'checkPending(key)')
    if (checkPending(key)) {
      // 重复请求则取消当前请求
      const source = CancelToken.source();
      config.cancelToken = source.token;
      source.cancel('这是一次重复请求');
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
    // console.log(response, 'response')
    if (response.data.status === 401) {
      router.push('/')
      // const res = response.data
      // return response
    }
    console.log('此时response.config.url为：', response.config.url)
    //请求响应中的config的url会带上代理的api需要去掉
    response.config.url = response.config.url.replace('/api/user', '')
    console.log('user中，response.config.url为：', response.config.url)
    // 请求完成，删除请求中状态
    const key = getRequestKey(response.config);
    removePending(key);
    if (response.data.code === 0) {
      Message.error(response.data.msg)
      if (response.data.msg === 'NOTLOGIN' || response.data.msg === '未登录') {
        router.push('/')
      }
    } else if (response.data.code === 1) {
      // const res = response.data
      return response
    } else {
      Message.error('响应的自定义码错误');
      // console.info('响应的自定义码错误');
    }
    return response
  },
  (error: any) => {
    // console.log(error.config, pending, 'error')
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/')
          break;
        case 405:
          error.message = '请求错误'
      }
    }
    if (error.config) {
      //请求响应中的config的url会带上代理的api需要去掉
      // /api/user/order/statistics变为/order/statistics以对应上service.interceptors.request中的不包括baseUrl的用法。
      error.config.url = error.config.url.replace('/api/user', '')
      // 请求完成，删除请求中状态
      const key = getRequestKey(error.config);
      removePending(key);
      console.log('出现error后，checkPending(key)为', checkPending(key));
      console.log(error, pending, 'error11')
    }
    Message({
      'message': 'error回调函数中，'+error.message,
      'type': 'error',
      'duration': 5 * 1000
    })
    // router.push('/')

    // 将未处理的异常往外抛，即已拒绝（rejected）的 Promise 对象，拒绝原因为给定的参数。
    return Promise.reject(error)
  }
)

export default service
