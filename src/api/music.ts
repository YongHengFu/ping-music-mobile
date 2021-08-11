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

// 根据id获取歌单详情
export function getListById(data:object) {
  return request({
    url: '/playlist/detail',
    method: 'get',
    data
  })
}

// 根据id获取音乐详情
export function getMusicDetail(data:object) {
  return request({
    url: '/song/detail',
    method: 'get',
    data
  })
}
