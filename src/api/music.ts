import request from '@/utils/request'

/** 获取 Banner **/
export function getBanner() {
  return request({
    url: '/banner?type=2',
    method: 'get'
  })
}

/** 推荐歌单  **/
export function getRcmdPlayList() {
  return request({
    url: '/personalized?limit=16',
    method: 'get'
  })
}
