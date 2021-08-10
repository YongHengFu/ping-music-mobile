import Taro from '@tarojs/taro'
import Store from '@/store'

const next = () => {
  return () => {
  }
}
const prev = () => {
  return () => {
  }
}

const player = {
  audio: Taro.createInnerAudioContext(),
  next: next(),
  prev: prev()
}
// player.audio.autoplay = true
player.audio.src = 'https://music.163.com/song/media/outer/url?id=1353301300.mp3'
player.audio.onTimeUpdate(() => {
  Store.commit('setCurrTime', player.audio.currentTime)
})

setTimeout(() => {
  // player.next()
}, 10000)
export default player
