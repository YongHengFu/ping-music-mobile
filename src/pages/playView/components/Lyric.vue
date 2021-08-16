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
    <scroll-view :scroll-y="true" :class="$style['lyric-wrapper']">
      <span v-for="(item,index) of lyricList" :key="item.time" :class="$style['lyric']">{{ item.lyric }}</span>
    </scroll-view>
    <div :class="$style.botton" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import player from '@/utils/player'
import { getLyricById } from '@/api/music'

export default defineComponent({
  name: 'Lyric',
  props: {
    musicInfo: Object
  },
  setup(props, ctx) {
    const lyricList = ref([])

    onMounted(() => {
      if (props.musicInfo?.id) {
        getLyricStr(props.musicInfo.id)
      }
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
    return {
      lyricList
    }
  }
})
</script>

<style module lang="scss">
.page-lyric{
  padding: 0 50px;
  .info{
    padding: 30px 0;
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
    height: 1000px;
    padding: 20% 0 20% 0;
    color: #fff;
    //max-height: 400px;
    overflow-y: auto;
    .lyric{
      display: block;
      margin: 20px 0;
    }
  }
  .button{

  }
}
</style>
