<template>
  <div :class="$style['control-bar']">
    <div :class="$style.bar">
      <img :src="image" :class="$style.cover">
      <img :src="iconVinly" :class="$style.vinly">
      <img v-if="state" :src="iconPause" :class="$style.pause" @click="pause">
      <img v-else :src="iconPlay" :class="$style.play" @click="play">
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import player from '@/utils/player'
import iconVinly from '@/assets/icons/vinyl.png'
import iconPlay from '@/assets/icons/play-mini.png'
import iconPause from '@/assets/icons/pause-mini.png'
import Taro from '@tarojs/taro'
export default defineComponent({
  name: 'ControlBar',
  setup() {
    const store = useStore()
    const state = ref(false)
    const image = ref('')
    const currIndex = computed(() => store.state.currIndex)
    watch(currIndex, () => {
      const musicList = Taro.getStorageSync('musicList')
      if (musicList) {
        image.value = musicList[currIndex.value].album.picUrl + '?param=800y800'
        console.log(image.value)
      }
    })
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
    })
    return {
      iconVinly,
      iconPlay,
      iconPause,
      state,
      image,
      play,
      pause
    }
  }
})
</script>

<style module lang="scss">
.control-bar{
  position: fixed;
  bottom: 10px;
  left: 30px;
  right: 30px;
  .bar{
    border-radius: 50px;
    background: rgba(122, 109, 193, 0.89);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .cover{
      width: 80px;
      height: 80px;
      position: absolute;
      left: 0;
      bottom: 0;
      box-shadow: 0 5px 5px #cccccc;
      border-radius: 5px;
    }
    .vinly{
      width: 60px;
      height: 60px;
      margin-left: 45px;
    }
    .play, .pause{
      width: 35px;
      height: 35px;
      padding: 3px;
      margin: 10px;
      border: 4px solid #ffffff;
      border-radius: 50%;
    }
  }
}
</style>
