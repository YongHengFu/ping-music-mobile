<template>
  <div :class="$style['page-play-view']">
    <div :class="$style['mask-wrapper']">
      <div :class="$style.mask" :style="maskStyle" />
    </div>
    <NavigationBar @changeTab="changeTab" />
    <Component :is="currTabName" :class="$style.components" :style="pageStyle" :music-info="musicInfo" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
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
    Music,
    Lyric
  },
  setup() {
    const store = useStore()
    const currIndex = computed(() => store.state.currIndex)
    const musicInfo = ref({} as any)
    const maskStyle = ref({
      'background-image': `url(${musicInfo.value?.album?.picUrl})`
    })
    const pageStyle = {
      'margin-top': `${navigationBarHeight + 10}px`
    }
    const currTabName = ref('Music')
    const changeTab = (name:string) => {
      currTabName.value = name
    }
    onMounted(() => {
      const musicList = Taro.getStorageSync('musicList')
      if (musicList) {
        musicInfo.value = musicList[currIndex.value]
        maskStyle.value['background-image'] = `url(${musicInfo.value.album.picUrl})`
      }
      player.audio.onCanplay(() => {
        const musicList = Taro.getStorageSync('musicList')
        if (musicList) {
          musicInfo.value = musicList[currIndex.value]
          maskStyle.value['background-image'] = `url(${musicInfo.value.album.picUrl}?param=300y300)`
        }
      })
    })
    return {
      maskStyle,
      pageStyle,
      currTabName,
      musicInfo,
      changeTab
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
    width: 100%;
    min-height: 100%;
  }
}
</style>
