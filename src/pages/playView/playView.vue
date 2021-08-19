<template>
  <div :class="$style['page-play-view']">
    <div :class="$style['mask-wrapper']">
      <div :class="$style.mask" :style="maskStyle" />
    </div>
    <NavigationBar :curr-tab-index="currTabIndex" @changeTab="changeTab" />
    <swiper :class="$style.components" :style="pageStyle" :vertical="stopChange" :duration="300" :current="currTabIndex" @Change="changeTabIndex">
      <swiper-item>
        <Rcmd :music-info="musicInfo" />
      </swiper-item>
      <swiper-item>
        <Music :music-info="musicInfo" :state="state" :curr-time="currTime" :total-time="totalTime" @moving="moving" />
      </swiper-item>
      <swiper-item>
        <Lyric :music-info="musicInfo" :state="state" :curr-time="currTime" :total-time="totalTime" />
      </swiper-item>
    </swiper>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import Rcmd from '@/pages/playView/components/Rcmd.vue'
import Music from '@/pages/playView/components/Music.vue'
import Lyric from '@/pages/playView/components/Lyric.vue'
import NavigationBar from '@/pages/playView/components/NavigationBar.vue'
import { navigationBarHeight } from '@/utils/navigationBarInfo'
import player from '@/utils/player'
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'PlayView',
  components: {
    NavigationBar,
    Rcmd,
    Music,
    Lyric
  },
  setup() {
    const store = useStore()
    const state = ref(false)
    const currTime = ref(0)
    const totalTime = ref(0)
    const currIndex = computed(() => store.state.currIndex)
    const musicInfo = ref({} as any)
    const maskStyle = ref({
      'background-image': `url(${musicInfo.value?.album?.picUrl})`
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

    onMounted(() => {
      totalTime.value = player.audio.duration
      const musicList = Taro.getStorageSync('musicList')
      if (musicList) {
        musicInfo.value = musicList[currIndex.value]
        maskStyle.value['background-image'] = `url(${musicInfo.value.album.picUrl})`
        totalTime.value = musicList[currIndex.value].duration
      }
      player.audio.onCanplay(() => {
        const musicList = Taro.getStorageSync('musicList')
        if (musicList) {
          musicInfo.value = musicList[currIndex.value]
          maskStyle.value['background-image'] = `url(${musicInfo.value.album.picUrl}?param=300y300)`
        }
        if (musicList) {
          totalTime.value = musicList[currIndex.value].duration
        }
      })
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
      currTabIndex,
      stopChange,
      musicInfo,
      changeTab,
      changeTabIndex,
      moving
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
      width: 100%;
      height: 100%;
      filter: blur(30px);
      background-size:100% 100%;
      transform: scale(1.2);
      opacity: 0.5;
    }
  }
  .components{
    width: 100vw;
    overflow-y: hidden!important;
    //height: 100vh;
  }
}
</style>
