import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    console.log(error) //
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      const errMsg = res.msg || '请求失败'
      Message({
        message: errMsg,
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
         // 如果 token 失效，则弹出确认对话框，用户点击后，清空 token 并返回登录页面
        MessageBox.confirm('',{
          message: 'Token已经失效，是否重新登录', 
          title: '确认登出', 
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(errMsg))
    } else {
      console.log(res)
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    const {msg} = error.response.data
    Message({
      message: msg || '请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
