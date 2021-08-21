<template>
  <div :class="$style['control-bar']" @click="goToPlayView">
    <div :class="$style.bar" :style="barStyle">
      <!--      <img :src="image" :class="$style.cover">-->
      <canvas id="canvasCover" type="2d" :class="$style.cover" />
      <img :src="iconVinyl" :class="[$style.vinyl, {[$style['vinyl-rotate']]:state}]">
      <span :class="$style.text">{{ text }}</span>
      <div :class="$style['right-icon']">
        <img v-if="state" :src="iconPause" :class="$style.pause" @click.stop="pause">
        <img v-else :src="iconPlay" :class="$style.play" @click.stop="play">
        <img :src="iconMusicList" :class="$style.list" @click.stop="showList=true">
      </div>
    </div>
  </div>
  <MusicList v-if="showList" @close="showList=false" />
</template>

<script lang="ts">
import colorThief from '#/miniapp-color-thief'
import { computed, defineComponent, onActivated, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import player from '@/utils/player'
import MusicList from '@/components/MusicList.vue'
import iconVinyl from '@/assets/icons/vinyl.png'
import iconPlay from '@/assets/icons/play-mini.png'
import iconPause from '@/assets/icons/pause-mini.png'
import iconMusicList from '@/assets/icons/music-list.png'
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro'
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
    const barStyle = ref({
      background: ''
    })

    const play = () => {
      player.audio.play()
    }
    const pause = () => {
      player.audio.pause()
    }
    const goToPlayView = () => {
      Taro.navigateTo({
        url: '/pages/playView/playView'
      })
    }

    const getPrimaryColor = () => {
      const selectorQuery = Taro.createSelectorQuery()
      selectorQuery.select('#canvasCover').fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0]?.node
          if (!canvas) {
            return
          }
          const context = canvas.getContext('2d')
          const img = canvas.createImage()
          img.src = image.value
          img.onload = () => {
            context.drawImage(img, 0, 0, 300, 150)
            const data = context.getImageData(0, 0, 85, 85).data
            const palette = colorThief(data)
              .color(2)
              .get()
            let index = 0
            for (let i = 0; i < 2; i++) {
              if (palette[i] > palette[i + 1]) {
                index = i + 1
              }
            }
            for (let i = 0; i < 3; i++) {
              palette[i] = Math.floor(100 + Math.random() * 10)
            }
            palette[index] = Math.floor(160 + Math.random() * 10)
            barStyle.value.background = `rgb(${palette})`
          }
        })
    }

    onMounted(() => {
      player.audio.onPlay(() => {
        state.value = true
      })
      player.audio.onPause(() => {
        state.value = false
      })
      Taro.nextTick(() => {
        const instance = getCurrentInstance()
        if (instance?.router !== null) {
          eventCenter.on(instance.router.onShow, () => {
            getPrimaryColor()
          })
        }
      })
      player.audio.onCanplay(() => {
        const musicList = Taro.getStorageSync('musicList')
        if (musicList) {
          image.value = musicList[currIndex.value].album.picUrl + '?param=300y300'
          getPrimaryColor()
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
      barStyle,
      iconVinyl,
      iconPlay,
      iconPause,
      iconMusicList,
      state,
      showList,
      image,
      text,
      play,
      pause,
      goToPlayView
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
    border-radius: 100px;
    background: #1cdf9f;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 6vh;
    .cover{
      width: 6.8vh;
      height: 6.8vh;
      position: absolute;
      left: 0;
      bottom: 0;
      border-radius: 8px;
      overflow: hidden;
      z-index: 2;
    }
    .vinyl{
      min-width: 60px;
      max-width: 60px;
      height: 60px;
      transition: margin-left 0.5s linear;
      margin-left: 3.8vh;
    }
    .vinyl-rotate{
      margin-left: 4.8vh;
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
