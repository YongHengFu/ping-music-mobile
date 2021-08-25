<template>
  <div :class="$style['page-music']">
    <NavigationBar />
    <scroll-view
      :scroll-y="true"
      :refresher-enabled="true"
      :refresher-threshold="5"
      :refresher-triggered="refreshState"
      :style="scrollViewStyle"
      :class="$style.scroll"
      @refresherrefresh="refresh"
    >
      <Banner :update="bannerUpdate" :style="pageStyle" />
      <div :class="$style['icon-list']">
        <div :class="$style.item">
          <img :src="radio" :class="$style.image">
          <span :class="$style.text">个性电台</span>
        </div>
        <div :class="$style.item">
          <img :src="daily" :class="$style.image">
          <span :class="$style.text">每日30首</span>
        </div>
        <div :class="$style.item">
          <img :src="rank" :class="$style.image">
          <span :class="$style.text">排行榜</span>
        </div>
        <div :class="$style.item">
          <img :src="playlist" :class="$style.image">
          <span :class="$style.text">全部歌单</span>
        </div>
        <div :class="$style.item">
          <img :src="newsong" :class="$style.image">
          <span :class="$style.text">新歌新碟</span>
        </div>
      </div>
      <span :class="$style.title">你的宝藏歌单</span>
      <swiper previous-margin="10px" next-margin="10px" :duration="100" :display-multiple-items="3" style="height: calc(((100vw - 60px) / 3 + 50px) * 2)">
        <swiper-item v-for="n of rcmdPlayList.length/2" :key="n">
          <Cover
            v-for="m of 2"
            :key="m"
            :image="rcmdPlayList[(n-1)*2+m-1].picUrl"
            :text="rcmdPlayList[(n-1)*2+m-1].name"
            :number="rcmdPlayList[(n-1)*2+m-1].playCount"
            style="margin: 5px"
            @click="playListAll(rcmdPlayList[(n-1)*2+m-1].id)"
          />
        </swiper-item>
      </swiper>
    </scroll-view>
    <ControlBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import NavigationBar from '@/pages/music/NavigationBar.vue'
import Banner from '@/components/Banner.vue'
import Cover from '@/components/Cover.vue'
import ControlBar from '@/components/ControlBar.vue'
import radio from '@/assets/icons/radio.png'
import daily from '@/assets/icons/daily.png'
import rank from '@/assets/icons/rank.png'
import playlist from '@/assets/icons/playlist.png'
import newsong from '@/assets/icons/newsong.png'
import { getRcmdPlayList } from '@/api/music'
import { playList } from '@/utils/musicList'
import { navigationBarHeight, windowHeight } from '@/utils/navigationBarInfo'

export default defineComponent({
  name: 'Music',
  components: {
    NavigationBar,
    Banner,
    Cover,
    ControlBar
  },
  setup() {
    const scrollViewStyle = {
      'margin-top': `${navigationBarHeight + 10}px`,
      'height': `calc(${windowHeight}px - 5.2vh - ${navigationBarHeight + 10}px)`,
      'padding-bottom': `calc(5.2vh)`
    }
    const rcmdPlayList = ref([])
    const refreshState = ref(false)
    const bannerUpdate = ref(0)

    const getRcmdPlayListData = () => {
      getRcmdPlayList().then((res:any) => {
        if (res.code === 200) {
          rcmdPlayList.value = res.result
        }
      })
    }

    const playListAll = (id:string) => {
      playList(id)
    }

    const refresh = async() => {
      refreshState.value = true
      bannerUpdate.value++
      await getRcmdPlayListData()
      setTimeout(() => {
        refreshState.value = false
      }, 1000)
    }

    onMounted(() => {
      getRcmdPlayListData()
    })

    return {
      scrollViewStyle,
      radio,
      daily,
      rank,
      playlist,
      newsong,
      rcmdPlayList,
      refreshState,
      bannerUpdate,
      playListAll,
      refresh
    }
  }
})
</script>

<style module lang="scss">
.page-music{
  .title{
    display: block;
    font-size: 24px;
    margin-left: 30px;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .icon-list{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 60px;
    .item{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .image{
        width: 65px;
        height: 65px;
      }
      .text{
        text-align: center;
        font-size: 18px;
        color: #6d6d6d;
        margin-top: 10px;
      }
    }
  }
}
</style>
