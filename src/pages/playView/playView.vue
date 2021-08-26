<template>
  <div :class="$style['page-play-view']">
    <div :class="$style['mask-wrapper']">
      <div :class="$style['mask-color']" :style="maskStyle" />
      <canvas id="mask" type="2d" :class="$style.mask"/>
    </div>
    <NavigationBar :curr-tab-index="currTabIndex" @changeTab="changeTab" />
    <swiper :class="$style.components" :style="pageStyle" :vertical="stopChange" :duration="300" :current="currTabIndex" @Change="changeTabIndex">
      <swiper-item>
        <Rcmd :music-info="musicInfo" />
      </swiper-item>
      <swiper-item>
        <Music :music-info="musicInfo" :state="state" :curr-time="currTime" :total-time="totalTime" :curr-lyric="currLyric" @moving="moving" @jump="jumpTo" />
      </swiper-item>
      <swiper-item>
        <Lyric :music-info="musicInfo" :state="state" :curr-time="currTime" :jump-time="jumpTime" :total-time="totalTime" @currLyric="getCurrLyric" />
      </swiper-item>
    </swiper>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Taro from '@tarojs/taro'
import colorThief from '#/miniapp-color-thief'
import Rcmd from '@/pages/playView/components/Rcmd.vue'
import Music from '@/pages/playView/components/Music.vue'
import Lyric from '@/pages/playView/components/Lyric.vue'
import NavigationBar from '@/pages/playView/components/NavigationBar.vue'
import { navigationBarHeight } from '@/utils/navigationBarInfo'
import player from '@/utils/player'

export default defineComponent({
  name: 'PlayView',
  components: {
    NavigationBar,
    Rcmd,
    Music,
    Lyric
  },
  onReady() {
    Taro.nextTick(() => {
      this.getPrimaryColor()
    })
  },
  setup() {
    const store = useStore()
    const state = ref(false)
    const currTime = ref(0)
    const totalTime = ref(0)
    const jumpTime = ref(0)
    const currIndex = computed(() => store.state.currIndex)
    const currLyric = ref('')
    const musicInfo = ref({} as any)
    const maskStyle = ref({
      'background': ''
    })
    const pageStyle = {
      'margin-top': `${navigationBarHeight + 10}px`,
      'height': `calc(100vh - ${navigationBarHeight + 10}px)`
    }
    const currTabIndex = ref(1)
    const stopChange = ref(false)

    const changeTabIndex = (e) => {
      currTabIndex.value = e.detail.current
    }

    const changeTab = (index:number) => {
      currTabIndex.value = index
    }

    const moving = (value:boolean) => {
      stopChange.value = value
    }

    const getPrimaryColor = () => {
      const selectorQuery = Taro.createSelectorQuery()
      selectorQuery.select('#mask').fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0]?.node
          if (!canvas) {
            return
          }
          const context = canvas.getContext('2d')
          const image = canvas.createImage()
          image.src = musicInfo.value.album.picUrl + '?param=50y50'
          image.onload = () => {
            context.drawImage(image, 0, 0, 300, 150)
            const data = context.getImageData(0, 0, Taro.getSystemInfoSync().screenWidth, Taro.getSystemInfoSync().screenHeight).data
            const palette = colorThief(data)
              .color(2)
              .get()
            let isLight = false
            for (let i = 0; i < 3; i++) {
              if (palette[i] > 150) {
                isLight = true
                break
              }
            }
            if (isLight) {
              for (let i = 0; i < 3; i++) {
                palette[i] -= Math.ceil(palette[i] / 3)
              }
            }
            maskStyle.value.background = `rgba(${palette},0.8)`
          }
        })
    }

    const jumpTo = (time:number) => {
      jumpTime.value = time
    }

    const getCurrLyric = (lyric:string) => {
      currLyric.value = lyric
    }

    onMounted(() => {
      if (player.audio.paused || player.audio.paused === undefined) {
        state.value = false
      } else {
        state.value = true
      }
      totalTime.value = player.audio.duration
      const musicList = Taro.getStorageSync('musicList')
      if (musicList) {
        musicInfo.value = musicList[currIndex.value]
        totalTime.value = musicList[currIndex.value].duration
      }
      player.audio.onCanplay(() => {
        const musicList = Taro.getStorageSync('musicList')
        if (musicList) {
          musicInfo.value = musicList[currIndex.value]
          getPrimaryColor()
        }
        if (musicList) {
          totalTime.value = musicList[currIndex.value].duration
        }
      })
      player.audio.onPlay(() => {
        state.value = true
      })
      player.audio.onPause(() => {
        state.value = false
      })
      player.audio.onTimeUpdate(() => {
        currTime.value = player.audio.currentTime
      })
      player.audio.onStop(() => {
        currTime.value = 0
      })
    })
    return {
      maskStyle,
      pageStyle,
      state,
      currTime,
      totalTime,
      jumpTime,
      currTabIndex,
      currLyric,
      stopChange,
      musicInfo,
      changeTab,
      changeTabIndex,
      moving,
      getPrimaryColor,
      jumpTo,
      getCurrLyric
    }
  }
})
</script>

<style module lang="scss">
.page-play-view{
  width: 100%;
  height: 100%;
  .mask-wrapper{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
    background: #323232;
    .mask{
      width: 100vw;
      height: 100vh;
      filter: blur(30px);
      background-size:100% 100%;
      position: absolute;
      left: 0px;
      top: 0;
      z-index: -1;
    }
    .mask-color{
      width: 100vw;
      height: 100vh;
    }
  }
  .components{
    width: 100vw;
    height: 100vh;
  }
}
</style>
