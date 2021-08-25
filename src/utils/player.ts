import Taro from '@tarojs/taro'
import Store from '@/store'

const next = () => {
  return () => {
    const musicList = Taro.getStorageSync('musicList')
    if (musicList) {
      let index = Store.state.currIndex
      if (player.mode !== 3) {
        if (index < musicList.length - 1) {
          index++
          Store.commit('setCurrIndex', index)
        } else {
          index = 0
          Store.commit('setCurrIndex', index)
        }
      }
      if (musicList[index].canPlay.able) {
        player.audio.stop()
        let singer = ''
        for (const item of musicList[index].artist) {
          singer += item.name
        }
        player.audio.title = musicList[index].name
        player.audio.epname = musicList[index].album.name
        player.audio.singer = singer
        player.audio.coverImgUrl = musicList[index].album.picUrl + '?param=300y300'
        player.audio.src = `https://music.163.com/song/media/outer/url?id=${musicList[index].id}.mp3`
        player.audio.play()
      } else {
        next()
      }
    }
  }
}
const prev = () => {
  return () => {
    const musicList = Taro.getStorageSync('musicList')
    if (musicList) {
      let index = Store.state.currIndex
      if (player.mode !== 3) {
        if (index > 0) {
          index--
          Store.commit('setCurrIndex', index)
        } else {
          index = musicList.length - 1
          Store.commit('setCurrIndex', index)
        }
      }
      if (musicList[index].canPlay.able) {
        player.audio.stop()
        let singer = ''
        for (const item of musicList[index].artist) {
          singer += item.name
        }
        player.audio.title = musicList[index].name
        player.audio.epname = musicList[index].album.name
        player.audio.singer = singer
        player.audio.coverImgUrl = musicList[index].album.picUrl + '?param=300y300'
        player.audio.src = `https://music.163.com/song/media/outer/url?id=${musicList[index].id}.mp3`
        player.audio.play()
      } else {
        prev()
      }
    }
  }
}

const switchMode = () => {
  return () => {
    if (player.mode === 3) {
      player.mode = 0
    } else {
      player.mode += 1
    }
  }
}

const playByIndex = () => {
  return (index:number) => {
    const musicList = Taro.getStorageSync('musicList')
    if (musicList) {
      if (musicList[index].canPlay.able) {
        player.audio.src = `https://music.163.com/song/media/outer/url?id=${musicList[index].id}.mp3`
        Store.commit('setCurrIndex', index)
      } else {
        Taro.showToast({
          title: musicList[index].canPlay.msg
        })
      }
    }
  }
}

const player = {
  audio: Taro.getBackgroundAudioManager(),
  mode: 0,
  randList: [],
  next: next(),
  prev: prev(), // 0:列表循环 1：顺序播放 2：随机播放 3：单曲循环
  switchMode: switchMode(),
  playByIndex: playByIndex()
}
player.audio.title = 'PingMusic'
player.audio.onPrev(() => {
  player.prev()
})
player.audio.onNext(() => {
  player.next()
})
player.audio.onEnded(() => {
  player.next()
})

export default player
