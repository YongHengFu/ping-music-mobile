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
    url: '/personalized?limit=12',
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

// 根据id获取歌词
export function getLyricById(data:object) {
  return request({
    url: '/lyric',
    method: 'get',
    data
  })
}

/** 获取歌手信息
 @param id:歌手id
 **/
export function getArtistInfo(data:object) {
  return request({
    url: '/artist/detail',
    method: 'get',
    data
  })
}

/** 获取相似歌单
 @param id:歌曲id
 **/
export function getSimiMusic(data:object) {
  return request({
    url: '/simi/song',
    method: 'get',
    data
  })
}

/** 获取相似歌曲
 @param id:歌曲id
 **/
export function getSimiPlayList(data:object) {
  return request({
    url: '/simi/playlist',
    method: 'get',
    data
  })
}
