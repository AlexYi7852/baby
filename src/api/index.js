import axios from 'axios'
const qs = require('qs')
const jsMd5 = require('js-md5')
const moment = require('moment')

// const QueryString = require('querystring')

axios.defaults.timeout = 5000
axios.defaults.baseURL = ''

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.data = JSON.stringify(config.data)
    // console.log(config.data, 'config.data')
    config.headers = {
      // 'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;  charset=UTF-8'
    }
    return config
  }, error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // debugger
    return response
  }, error => {
    return Promise.reject(error)
  }
)

/**
 * 封装post请求
 * @param url
 * @param appId 平台分配id
 * @param timestamp 时间戳
 * @param appSecuret 服务器的加密字符串
 * @param key 签名
 * @param data
 * @returns {Promise}
 */

const defaultData = {
  // appId: 'LHWL-BBER-01',
  // appSecuret: 'q1om-2e3e-d9v0-2me9',
  appId: 'LHWL-PGSJ-02',
  appSecuret: 'p0w3-0o5n-8n9v-9u7y',
  key: ''
}

export function post (url, data = {}) {
  if (process.env.NODE_ENV === 'development') {
    url = '/api' + url
  }
  let { appId, appSecuret, key } = { ...defaultData }
  let timestamp = moment().format('YYYY-MM-DD HH:mm:ss').split('-').join('').split(':').join('').replace(/\s*/g, '')
  data = JSON.stringify(data)
  if (data === '{}') {
    data = { appId, timestamp, data, key }
    data.key = jsMd5(appId + '{}' + timestamp + appSecuret)
  } else {
    const jsonData = '{' + handleData(data) + '}'
    data = { appId, timestamp, data, key }
    data.key = jsMd5(appId + jsonData + timestamp + appSecuret)
  }
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data))
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function get (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

function handleData (val) {
  let demo = []
  let newVal = JSON.parse(val)
  for (var i in newVal) {
    demo.push('"' + i + '"' + ':' + '"' + newVal[i] + '"')
  }
  const newDeom = demo.join(',')
  return newDeom
}
