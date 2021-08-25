import Taro from '@tarojs/taro'

export default function request(params) {
  // const baseURL = 'https://music.qier222.com/api'
  const baseURL = 'https://www.pingmusic.ltd'
  params.data = { timestamp: new Date().getTime(), ...params.data }
  return new Promise((resolve, reject) => {
    Taro.request({
      url: baseURL + params.url,
      method: params.method || 'get',
      data: params.data || {},
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        Taro.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 1000
        })
        reject(err)
      }
    })
  })
}
