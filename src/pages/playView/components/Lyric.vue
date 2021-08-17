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
    <div :class="$style.botton" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import player from '@/utils/player'
import { getLyricById } from '@/api/music'
import { throttle } from '@/utils/frequency'
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import { navigationBarHeight } from '@/utils/navigationBarInfo'

export default defineComponent({
  name: 'Lyric',
  props: {
    musicInfo: Object
  },
  setup(props, ctx) {
    const store = useStore()
    const currIndex = computed(() => store.state.currIndex)
    let totalTime = 0
    const lyricList = ref([] as any)
    const currLyricIndex = ref(0)
    const scrollViewStyle = {
      'height': `${(Taro.getSystemInfoSync().screenHeight - navigationBarHeight - 120)}px`
    }
    const prevStyle = {
      'transition': 'font-size 0.3s'
    }
    const currStyle = ref({
      'transition': '',
      'font-size': '20px',
      'background-size': '0'
    })

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
    }

    const autoScroll = (currTime:number) => {
      if (currLyricIndex.value < lyricList.value.length - 1) {
        if (currTime > lyricList.value[currLyricIndex.value + 1].time) {
          currLyricIndex.value++
          let time = 0
          if (currLyricIndex.value < lyricList.value.length - 1) {
            time = lyricList.value[currLyricIndex.value + 1].time - lyricList.value[currLyricIndex.value].time
          } else {
            time = totalTime - lyricList.value[currLyricIndex.value].time
          }
          currStyle.value.transition = `background-size ${time}s ease-out`
          currStyle.value['background-size'] = '100%'
        }
      }
    }

    onMounted(() => {
      if (props.musicInfo?.id) {
        getLyricStr(props.musicInfo.id)
      }
      const musicList = Taro.getStorageSync('musicList')
      if (musicList) {
        totalTime = musicList[currIndex.value].duration
      }
      player.audio.onTimeUpdate(() => {
        throttle(autoScroll(player.audio.currentTime), 500)
      })
    })

    return {
      lyricList,
      currLyricIndex,
      scrollViewStyle,
      currStyle,
      prevStyle
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
      font-size: 42px;
      font-weight: bold;
      color: #fff;
    }
    .artists{
      display: flex;
      align-items: center;
      font-size: 24px;
      color: #ccc;
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
        background-size: 0;
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    .placeholder{
      width: 100%;
      min-height: 50%;
    }
  }
  .button{

  }
}
</style>
