<template>
  <div :class="$style['control-bar']">
    <div :class="$style.bar">
      <img :src="image" :class="$style.cover">
      <img :src="iconVinyl" :class="[$style.vinyl, {[$style['vinyl-rotate']]:state}]">
      <span :class="$style.text">{{ text }}</span>
      <div :class="$style['right-icon']">
        <img v-if="state" :src="iconPause" :class="$style.pause" @click="pause">
        <img v-else :src="iconPlay" :class="$style.play" @click="play">
        <img :src="iconMusicList" :class="$style.list" @click="showList=true">
      </div>
    </div>
    <MusicList v-if="showList" @close="showList=false" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import player from '@/utils/player'
import MusicList from '@/components/MusicList.vue'
import iconVinyl from '@/assets/icons/vinyl.png'
import iconPlay from '@/assets/icons/play-mini.png'
import iconPause from '@/assets/icons/pause-mini.png'
import iconMusicList from '@/assets/icons/music-list.png'
import Taro from '@tarojs/taro'
export default defineComponent({
  name: 'ControlBar',
  components: {
    MusicList
  },
  setup() {
    const store = useStore()
    const state = ref(false)
    const showList = ref(false)
    const image = ref('')
    const text = ref('PingMusic')
    const currIndex = computed(() => store.state.currIndex)

    const play = () => {
      player.audio.play()
    }
    const pause = () => {
      player.audio.pause()
    }
    onMounted(() => {
      player.audio.onPlay(() => {
        state.value = true
      })
      player.audio.onPause(() => {
        state.value = false
      })
      player.audio.onCanplay(() => {
        const musicList = Taro.getStorageSync('musicList')
        if (musicList) {
          image.value = musicList[currIndex.value].album.picUrl + '?param=800y800'
          text.value = musicList[currIndex.value].name + '-'
          const artists = [] as string[]
          for (const item of musicList[currIndex.value].artist) {
            artists.push(item.name)
          }
          text.value += artists.join('/')
        }
      })
    })
    return {
      iconVinyl,
      iconPlay,
      iconPause,
      iconMusicList,
      state,
      showList,
      image,
      text,
      play,
      pause
    }
  }
})
</script>

<style module lang="scss">
.control-bar{
  position: fixed;
  bottom: 0;
  left: 30px;
  right: 30px;
  .bar{
    border-radius: 50px;
    background: #1cdf9f;
    //background: rgba(122, 109, 193, 0.89);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .cover{
      width: 85px;
      height: 85px;
      position: absolute;
      left: 0;
      bottom: 0;
      border-radius: 10px;
      z-index: 2;
    }
    .vinyl{
      min-width: 60px;
      max-width: 60px;
      height: 60px;
      transition: margin-left 0.5s linear;
      margin-left: 40px;
    }
    .vinyl-rotate{
      margin-left: 55px;
      animation: rotate infinite 1s linear;
      z-index: 1;
    }
    @keyframes rotate {
      from{
        transform: rotate(0);
      }
      to{
        transform: rotate(360deg);
      }
    }
    .text{
      width: 100%;
      padding: 20px;
      font-size: 22px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .right-icon{
      min-width: 130px;
      max-width: 130px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-right: 20px;
      .play, .pause{
        width: 35px;
        height: 35px;
        padding: 5px;
        border: 4px solid #fff;
        border-radius: 50%;
      }
      .list{
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>
