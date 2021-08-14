<template>
  <div :class="$style['page-music']" :style="pageStyle">
    <NavigationBar />
    <Banner />
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
    <div :class="$style['rcmd-play']">
      <span :class="$style.title">你的宝藏歌单</span>
      <div id="rcmd" :class="$style['rcmd-play-list']">
        <Cover
          v-for="(item,index) of rcmdPlayList"
          :id="'rcmd'+index"
          :key="item.id"
          :image="item.picUrl"
          :text="item.name"
          :number="item.playCount"
          :class="$style.item"
          @click="playListAll(item.id)"
        />
      </div>
    </div>
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
import { navigationBarHeight } from '@/utils/navigationBarInfo'

export default defineComponent({
  name: 'Music',
  components: {
    NavigationBar,
    Banner,
    Cover,
    ControlBar
  },
  setup() {
    const pageStyle = {
      'margin-top': `${navigationBarHeight + 10}px`
    }
    const rcmdPlayList = ref([])
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

    onMounted(() => {
      getRcmdPlayListData()
    })

    return {
      pageStyle,
      radio,
      daily,
      rank,
      playlist,
      newsong,
      rcmdPlayList,
      playListAll
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

  .rcmd-play{
    .rcmd-play-list{
      display: grid;
      grid-template-columns: repeat(8, calc((100% - 60px) / 3));
      grid-template-rows: repeat(2, auto);
      grid-gap: 20px 20px;
      overflow-x: auto;
      padding: 0 30px 20px 30px;
      .item{
        width: 100%;
        aspect-ratio: 1/1;
        &:last-child{
          padding-right: 30px;
        }
      }
    }
    ::-webkit-scrollbar {
      width: 0 !important
    }
  }
}
</style>
