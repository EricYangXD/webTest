import axios from 'axios'
// 用来解析axios传参的数据格式
import qs from 'qs'
// 使用系统签名
import Sign from 'sign.js'

let showAlert = false
let sign = new Sign()

// 后台接口公共前缀.在config中配置url
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 20000

axios.defaults.paramsSerializer = function (params) {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}

export function fetch(url, params, methods, isExport = false) {
  //本地存储的数据
  let localToken = localStorage.getItem('localToken')
  return new Promise((resolve, reject) => {
    var instance = axios.create({
      baseURL: SERVER_TIME_URL,
      timeout: 8000,
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    instance.defaults.responseType = 'json'
    //URL的地址
    instance.get('/ericyangxd/user/server_now_time')
      .then(function (response) {
        resolve(response.data.data)
      })
      .catch(function (error) {
        console.log('error:' + error);
      });

  }).then(function (timestamp) {
    return new Promise((resolve, reject) => {
      const header = sign.signCtx({
        path: url,
        method: methods || 'POST',
        data: params,
        token: localToken,
        timestamp: timestamp,
        config: {
          appkey: APP_KEY,
          secretkey: SECRET_KEY
        }
      })

      //判断是否是导出功能接口
      if (isExport == true) {
        axios.defaults.responseType = 'blob'
      } else {
        axios.defaults.responseType = 'json'
      }

      var config = {
        method: methods || 'POST',
        url: url,
        headers: header
      }

      if (config.method && (config.method == 'post' || config.method == 'POST' || config.method == 'put' || config.method == 'PUT')) {
        config.data = params
      } else if (config.method == 'delete' || config.method == 'DELETE') {
        config.params = params
      } else {
        config.params = params
      }
      axios(config).then(response => {
        if (response.status == 200) {
          if (response.data.status == "FAILED" && response.data.errorMessage == "token错误" && url.indexOf('login') == -1) {
            if (!showAlert) {
              alert('该账号已在其它地方登陆');
              showAlert = true;
            }

            window.location.href = '/#/login'
          } else {
            resolve(response.data)
          }
        } else {
          alert('请求异常：' + response.status)
          return fasle
        }
      }).catch((err) => {
        console.log(err)
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              console.log('请求错误(400)')
              break
            case 401:
              console.log('未授权，请重新登录(401)')
              break
            case 403:
              console.log('拒绝访问(403)')
              break
            case 404:
              console.log('请求出错(404)')
              break
            case 408:
              console.log('请求超时(408)')
              break
            case 500:
              console.log('服务器错误(500)')
              break
            case 501:
              console.log('服务未实现(501)')
              break
            case 502:
              console.log('网络错误(502)')
              break
            case 503:
              console.log('服务不可用(503)')
              break
            case 504:
              console.log('网络超时(504)')
              break
            case 505:
              console.log('HTTP版本不受支持(505)')
              break
            default:
              console.log(`连接出错(${err.response.status})!`)
          }
        } else {
          console.log('连接服务器失败!')
        }
        reject(err)
      })
    })
  })
}


