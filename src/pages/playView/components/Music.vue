<template>
  <div :class="$style['page-music']">
    <img :src="`${musicInfo?.album?.picUrl}?param=500y500`" :class="$style.cover" mode="widthFix">
    <div :class="$style.info">
      <div>
        <span :class="$style['music-name']">{{ musicInfo?.name }}</span>
      </div>
      <div :class="$style.artists">
        <span v-for="(item,index) of musicInfo?.artist" :key="item.id">
          {{ item.name }}{{ index!==musicInfo?.artist.length-1?'/':'' }}
        </span>
      </div>
      <span :class="$style.lyric">{{currLyric}}</span>
    </div>
    <div :class="$style.control">
      <ProgressBar :class="$style['progress-bar']" :curr-time="currTime" :total-time="totalTime" @moving="moving" @jump="jumpTo" />
      <div :class="$style.button">
        <img :src="IconRand" :class="$style.icon1">
        <img :src="IconPrev" :class="$style.icon3" @click="prev">
        <img :src="state?IconPause:IconPlay" :class="$style.icon2" @click="state?pause():play()">
        <img :src="IconNext" :class="$style.icon3" @click="next">
        <img :src="IconList" :class="$style.icon1" @click="showList=true">
      </div>
    </div>
    <MusicList v-if="showList" @close="showList=false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MusicList from '@/components/MusicList.vue'
import ProgressBar from '@/pages/playView/components/ProgressBar.vue'
import IconPlay from '@/assets/icons/play.png'
import IconPause from '@/assets/icons/pause.png'
import IconNext from '@/assets/icons/next.png'
import IconPrev from '@/assets/icons/prev.png'
import IconRand from '@/assets/icons/rand.png'
import IconOrder from '@/assets/icons/order.png'
import IconLoop from '@/assets/icons/loop.png'
import IconSingle from '@/assets/icons/single.png'
import IconList from '@/assets/icons/music-list2.png'
import player from '@/utils/player'

export default defineComponent({
  name: 'Music',
  components: {
    MusicList,
    ProgressBar
  },
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
    currLyric: {
      type: String,
      required: true
    }
  },
  setup(props, ctx) {
    const showList = ref(false)

    const play = () => {
      player.audio.play()
    }

    const pause = () => {
      player.audio.pause()
    }

    const prev = () => {
      player.prev()
    }

    const next = () => {
      player.next()
    }

    const moving = (value:boolean) => {
      ctx.emit('moving', value)
    }

    const jumpTo = (jumpTime:number) => {
      ctx.emit('jump', jumpTime)
    }

    return {
      IconPlay,
      IconPause,
      IconNext,
      IconPrev,
      IconRand,
      IconOrder,
      IconLoop,
      IconSingle,
      IconList,
      showList,
      play,
      pause,
      prev,
      next,
      moving,
      jumpTo
    }
  }
})
</script>

<style module lang="scss">
.page-music{
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .cover{
    width: calc(100% - 100px);
    aspect-ratio: 1/1;
    margin: 30px auto;
    background-size:100% 100%;
    border-radius: 20px;
  }
  .info{
    width: calc(100% - 100px);
    margin: 30px auto;
    .music-name{
      width: 100%;
      display: block;
      font-size: 40px;
      font-weight: bold;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .artists{
      display: flex;
      align-items: center;
      font-size: 24px;
      color: #ccc;
      margin: 30px 0;
    }
    .lyric{
      width: 100%;
      font-size: 32px;
      color: #ccc;
      margin: 30px 0;
      overflow: auto;
      white-space:normal
    }
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .control{
    width: calc(100% - 100px);
    position: absolute;
    left: 50px;
    right: 50px;
    bottom: 60px;
    .progress-bar{
      margin-bottom: 30px;
    }
    .button{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon1{
        width: 40px;
        height: 40px;
      }
      .icon2{
        width: 100px;
        height: 100px;
      }
      .icon3{
        width: 70px;
        height: 70px;
      }
    }
  }
}
</style>
