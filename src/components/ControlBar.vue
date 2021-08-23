<template>
  <div :class="$style['control-bar']" @click="goToPlayView">
    <div :class="$style.bar" :style="barStyle">
      <!--      <img :src="image" :class="$style.cover">-->
      <canvas id="canvasCover" type="2d" :class="$style.cover" />
      <img :src="iconVinyl" :class="[$style.vinyl, {[$style['vinyl-rotate']]:state}]">
      <span :class="$style.text">{{ text }}</span>
      <div :class="$style['right-icon']">
        <div :class="$style.wrapper" @click.stop="state?pause():play()">
          <canvas id="progress" type="2d" :class="$style.progress" />
          <img :src="state?iconPause:iconPlay" :class="$style.icon1">
        </div>
        <img :src="iconMusicList" :class="$style.icon2" @click.stop="showList=true">
      </div>
    </div>
  </div>
  <MusicList v-if="showList" @close="showList=false" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro'
import colorThief from '#/miniapp-color-thief'
import player from '@/utils/player'
import MusicList from '@/components/MusicList.vue'
import iconVinyl from '@/assets/icons/vinyl.png'
import iconPlay from '@/assets/icons/play-mini.png'
import iconPause from '@/assets/icons/pause-mini.png'
import iconMusicList from '@/assets/icons/music-list.png'
import { throttle } from '@/utils/frequency'

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
    let totalTime = 0
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

    const drawProgress = (num) => {
      const selectorQuery = Taro.createSelectorQuery()
      selectorQuery.select('#progress').fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0]?.node
          if (!canvas) {
            return
          }
          canvas.width = 100
          canvas.height = 100
          const context = canvas.getContext('2d')
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const rad = Math.PI * 2 / 100
          context.save()
          context.beginPath()
          context.strokeStyle = '#fff'
          context.lineWidth = 12
          context.arc(centerX, centerY, 42, -Math.PI / 2, -Math.PI / 2 + num * rad, false)
          context.stroke()
          context.restore()
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
            drawProgress(player.audio.currentTime / totalTime * 100)
            player.audio.onTimeUpdate(() => {
              throttle(drawProgress(player.audio.currentTime / totalTime * 100), 500)
            })
          })
        }
      })
      player.audio.onCanplay(() => {
        const musicList = Taro.getStorageSync('musicList')
        if (musicList) {
          totalTime = musicList[currIndex.value].duration
          drawProgress(player.audio.currentTime / totalTime * 100)
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
      player.audio.onTimeUpdate(() => {
        throttle(drawProgress(player.audio.currentTime / totalTime * 100), 500)
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
  bottom: 20px;
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
      .wrapper{
        width: 36px;
        height: 36px;
        padding: 4px;
        border: 4px solid #fff;
        border-radius: 50%;
        position: relative;
        z-index: 2;
        .progress{
          width: 50px;
          height: 50px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          z-index: -2;
        }
        .icon1{
          width: 36px;
          height: 36px;
          z-index: 2;
        }
      }
      .icon2{
        width: 40px;
        height: 40px;
      }
    }
  }
  &:after{
    content: "";
    width: 6vh;
    height: 6vh;
    position: absolute;
    left: 3vh;
    bottom: 0;
    box-shadow: 0 8px 10px #acacac;
    z-index: -1;
  }
  &:before{
    content: "";
    width: 100%;
    height: 5vh;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translateY(30px);
    background: #fff;
    z-index: -2;
  }
}
</style>
