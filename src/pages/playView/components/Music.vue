<template>
  <div :class="$style['page-music']">
    <div :class="$style.cover" :style="{'background-image':`url(${musicInfo?.album?.picUrl}?param=300y300)`}" />
    <div :class="$style.info">
      <div>
        <span :class="$style['music-name']">{{ musicInfo?.name }}</span>
      </div>
      <div :class="$style.artists">
        <span v-for="(item,index) of musicInfo?.artist" :key="item.id">
          {{ item.name }}{{ index!==musicInfo?.artist.length-1?'/':'' }}
        </span>
      </div>
    </div>
    <div :class="$style.control">
      <ProgressBar :class="$style['progress-bar']"/>
      <div :class="$style.button">
        <img :src="IconRand" :class="$style.icon1">
        <img :src="IconPrev" :class="$style.icon3" @click="prev">
        <img :src="state?IconPause:IconPlay" :class="$style.icon2" @click="state=!state">
        <img :src="IconNext" :class="$style.icon3" @click="next">
        <img :src="IconList" :class="$style.icon1" @click="showList=true">
      </div>
    </div>
    <MusicList v-if="showList" @close="showList=false" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
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
import Taro from '@tarojs/taro'

export default defineComponent({
  name: 'Music',
  components: {
    MusicList,
    ProgressBar
  },
  props: {
    musicInfo: Object
  },
  setup(props, ctx) {
    const state = ref(false)
    const showList = ref(false)
    watch(state, () => {
      if (state.value) {
        player.audio.play()
      } else {
        player.audio.pause()
      }
    })

    const prev = () => {
      player.prev()
    }
    const next = () => {
      player.next()
    }

    onMounted(() => {
      if (player.audio.paused) {
        state.value = false
      } else {
        state.value = true
      }
      player.audio.onPlay(() => {
        state.value = true
      })
      player.audio.onPause(() => {
        state.value = false
      })
    })
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
      state,
      showList,
      prev,
      next
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
        width: 90px;
        height: 90px;
      }
      .icon3{
        width: 70px;
        height: 70px;
      }
    }
  }
}
</style>
