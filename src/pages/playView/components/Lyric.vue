<template>
  <div :class="$style['page-lyric']">
    <div :class="$style.info">
      <span :class="$style.name">{{ musicInfo?.name }}</span>
      <div :class="$style.artists">
        <span v-for="(item,index) of musicInfo?.artist" :key="item.id">
          {{ item.name }}{{ index!==musicInfo?.artist.length-1?'/':'' }}
        </span>
      </div>
    </div>
    <scroll-view :scroll-y="true" :scroll-into-view="'lyric'+(currLyricIndex-1)" :scroll-with-animation="true" :style="scrollViewStyle" :class="$style['lyric-wrapper']">
      <span v-for="(item,index) of lyricList" :id="'lyric'+index" :key="item.time" :class="$style['lyric']">
        <span :style="index===currLyricIndex?currStyle:prevStyle" :class="$style.text">{{ item.lyric }}</span>
      </span>
      <div :class="$style.placeholder" />
    </scroll-view>
    <img :src="state?IconPause:IconPlay" :class="$style.botton" @click="state?pause():play()">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import player from '@/utils/player'
import { getLyricById } from '@/api/music'
import { throttle } from '@/utils/frequency'
import Taro from '@tarojs/taro'
import { navigationBarHeight } from '@/utils/navigationBarInfo'
import IconPlay from '@/assets/icons/play.png'
import IconPause from '@/assets/icons/pause.png'

export default defineComponent({
  name: 'Lyric',
  props: {
    musicInfo: Object,
    state: {
      type: Boolean,
      required: true
    },
    currTime: {
      type: Number,
      required: true
    },
    totalTime: {
      type: Number,
      required: true
    },
    jumpTime: {
      type: Number,
      required: true
    }
  },
  setup(props, ctx) {
    let musicId = ''
    let playState = false
    const lyricList = ref([] as any)
    const currLyricIndex = ref(0)
    const scrollViewStyle = {
      'height': `${(Taro.getSystemInfoSync().screenHeight - navigationBarHeight - 120)}px`
    }
    const prevStyle = {
      // 'transition': 'font-size 0.3s'
    }
    const currStyle = ref({
      // 'transition': '',
      // 'font-size': '20px',
      // 'background-size': '0 100%'
    })
    let isJump = false
    let jumpTime = 0

    watch(props, () => {
      if (props.musicInfo?.id !== musicId) {
        musicId = props.musicInfo?.id
        getLyricStr(musicId)
      }
      if (props.state !== playState) {
        playState = props.state
        if (playState) {
          scrollContinue(props.currTime)
        } else {
          scrollSuspend(props.currTime)
        }
      }
      if (props.jumpTime !== jumpTime) {
        jumpTime = props.jumpTime
        jumpScroll(jumpTime)
      }
      if (!isJump) {
        throttle(autoScroll(props.currTime), 100)
      }
    })

    watch(currLyricIndex, () => {
      if (currLyricIndex.value > -1 || currLyricIndex.value < lyricList.value.length) {
        ctx.emit('currLyric', lyricList.value[currLyricIndex.value].lyric)
      } else {
        ctx.emit('currLyric', '')
      }
    })

    const play = () => {
      player.audio.play()
    }

    const pause = () => {
      player.audio.pause()
    }

    const scrollSuspend = (currTime:number) => {
      currStyle.value.transition = `background-size 0s`
      let percent = 0
      if (currLyricIndex.value < lyricList.value.length - 1) {
        percent = (currTime - lyricList.value[currLyricIndex.value].time) / (lyricList.value[currLyricIndex.value + 1].time - lyricList.value[currLyricIndex.value].time) * 100
      } else {
        percent = (currTime - lyricList.value[currLyricIndex.value].time) / (props.totalTime - lyricList.value[currLyricIndex.value].time) * 100
      }
      currStyle.value['background-size'] = `${percent}% 100%`
    }

    const scrollContinue = (currTime:number) => {
      let time = 0
      if (currLyricIndex.value < lyricList.value.length - 1) {
        time = lyricList.value[currLyricIndex.value + 1].time - currTime
      } else {
        time = props.totalTime - currTime
      }
      currStyle.value.transition = `background-size ${time}s linear`
      currStyle.value['background-size'] = `100% 100%`
    }

    const getLyricStr = (id:string) => {
      getLyricById({ id: id }).then((res:any) => {
        if (res.code === 200) {
          const lyricStr = res?.lrc?.lyric ?? ''
          if (lyricStr !== '') {
            analyzeLyric(lyricStr)
          }
        }
      })
    }

    const formatLyricTime = (time:string) => {
      const regMin = /.*:/
      const regSec = /:.*\./
      const regMs = /\./
      const minMatch = time.match(regMin)
      const secMatch = time.match(regSec)
      const msMatch = time.match(regMs)

      if (minMatch && secMatch && msMatch && msMatch.index) {
        const min = parseInt(minMatch[0].slice(0, 2))
        let sec = parseInt(secMatch[0].slice(1, 3))
        const ms = time.slice(msMatch.index + 1, msMatch.index + 3)
        if (min !== 0) {
          sec += min * 60
        }
        return Number(sec + '.' + ms)
      } else {
        return null
      }
    }

    const analyzeLyric = (lyricStr:string) => {
      lyricList.value = []
      const list = [] as any
      const ricList = lyricStr.split(/\n/)
      const regTime = /\[\d{2}:\d{2}.\d{1,3}\]/g
      for (const item of ricList) {
        const timeStr = item.match(regTime)
        if (timeStr !== null && timeStr.length > 0) {
          const lyric = item.replace(timeStr.join(''), '')
          for (let i = 0; i < timeStr.length; i++) {
            const time = formatLyricTime(timeStr[i].substring(1, timeStr[i].length - 1))
            let ric = ''
            if (lyric.trim() !== '') {
              ric = lyric
            } else {
              ric = '• • •'
            }
            const lyricItem = { time: time, lyric: ric }
            list.push(lyricItem)
          }
        }
      }
      lyricSort(list)
    }

    const lyricSort = (list: any) => {
      for (let i = 0; i < list.length - 1; i++) {
        let flag = true
        for (let j = i; j < list.length - 1; j++) {
          if (list[j].time > list[j + 1].time) {
            flag = false
            const t = list[j]
            list[j] = list[j + 1]
            list[j + 1] = t
          }
        }
        if (flag) {
          break
        }
      }
      lyricList.value = list
      currLyricIndex.value = 0
      initLyric()
    }

    const autoScroll = (currTime:number) => {
      if (!isJump) {
        if (currLyricIndex.value < lyricList.value.length - 1) {
          if (currTime > lyricList.value[currLyricIndex.value + 1].time) {
            currLyricIndex.value++
            let time = 0
            if (currLyricIndex.value < lyricList.value.length - 1) {
              time = lyricList.value[currLyricIndex.value + 1].time - lyricList.value[currLyricIndex.value].time
            } else {
              time = props.totalTime - lyricList.value[currLyricIndex.value].time
            }
            currStyle.value.transition = `background-size ${time}s linear`
            currStyle.value['background-size'] = '100% 100%'
          }
        }
      }
    }

    const getJumpIndex = (jumpTime:number) => {
      if (jumpTime < props.currTime) {
        for (let i = currLyricIndex.value; i > -1; i--) {
          if (lyricList.value[i].time < jumpTime) {
            return i
          }
        }
      } else if (jumpTime < lyricList.value[lyricList.value.length - 1].time) {
        for (let i = currLyricIndex.value; i < lyricList.value.length; i++) {
          if (lyricList.value[i].time > jumpTime) {
            return i - 1
          }
        }
      } else {
        return lyricList.value.length - 1
      }
      return 0
    }

    const jumpScroll = (jumpTime:number) => {
      isJump = true
      const index = getJumpIndex(jumpTime)
      if (index > -1) {
        currLyricIndex.value = index
        currStyle.value.transition = `background-size 0s`
        let percent = 0
        if (index < lyricList.value.length - 1) {
          percent = (jumpTime - lyricList.value[index].time) / (lyricList.value[index + 1].time - lyricList.value[index].time) * 100
        } else {
          percent = (jumpTime - lyricList.value[index].time) / (props.totalTime - lyricList.value[index].time) * 100
        }
        currStyle.value['background-size'] = `${percent}% 100%`
        let time = 0
        if (index < lyricList.value.length - 1) {
          time = lyricList.value[index + 1].time - jumpTime
        } else {
          time = props.totalTime - jumpTime
        }
        currStyle.value.transition = `background-size ${time}s linear`
        currStyle.value['background-size'] = '100% 100%'
        Taro.nextTick(() => {
          isJump = false
        })
      }
    }

    const initLyric = () => {
      setTimeout(() => {
        const initTime = props.currTime
        if (initTime > 2) {
          isJump = true
          let index = 0
          if (initTime < lyricList.value[lyricList.value.length - 1].time) {
            for (let i = 0; i < lyricList.value.length; i++) {
              if (lyricList.value[i].time > initTime) {
                index = i - 1
                break
              }
            }
          } else {
            index = lyricList.value.length - 1
          }
          currLyricIndex.value = index
          currStyle.value.transition = `background-size 0s`
          let percent = 0
          if (index < lyricList.value.length - 1) {
            percent = (initTime - lyricList.value[index].time) / (lyricList.value[index + 1].time - lyricList.value[index].time) * 100
          } else {
            percent = (initTime - lyricList.value[index].time) / (props.totalTime - lyricList.value[index].time) * 100
          }
          currStyle.value['background-size'] = `${percent}% 100%`
          let time = 0
          if (index < lyricList.value.length - 1) {
            time = lyricList.value[index + 1].time - initTime
          } else {
            time = props.totalTime - initTime
          }
          currStyle.value.transition = `background-size ${time}s linear`
          currStyle.value['background-size'] = '100% 100%'
          isJump = false
        }
      }, 500)
    }

    return {
      IconPlay,
      IconPause,
      lyricList,
      currLyricIndex,
      scrollViewStyle,
      currStyle,
      prevStyle,
      play,
      pause
    }
  }
})
</script>

<style module lang="scss">
.page-lyric{
  padding: 0 50px;
  .info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 200px;
    .name{
      font-size: 46px;
      font-weight: bold;
      color: #fff;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .artists{
      display: flex;
      align-items: center;
      font-size: 24px;
      color: #ffffffa0;
      margin: 30px 0;
    }
  }
  .lyric-wrapper{
    width: 100%;
    color: #fff;
    overflow-y: auto;
    .lyric{
      display: block;
      margin-right: 50px;
      width: calc(100% - 100px);
      .text{
        display: inline;
        line-height: 70px;
        font-weight: bold;
        background: #FFFFFF -webkit-linear-gradient(left, #1dcf9f, #53ecc3) no-repeat 0 0;
        background-size: 0 100%;
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    .placeholder{
      width: 100%;
      min-height: 50%;
    }
  }
  .botton{
    position: fixed;
    right: 50px;
    bottom: 50px;
    width: 80px;
    height: 80px;
  }
}
</style>
