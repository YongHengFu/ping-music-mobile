<template>
  <div :class="$style['page-music']">
    <img :src="`${musicInfo?.album?.picUrl}?param=500y500`" :class="$style.cover" mode="widthFix">
    <div id="info" :class="$style.info">
      <div id="scrollName" :class="[$style['name-wrapper'],{[$style['name-wrapper-scroll']]:musicNameStyle['padding-right']!=='0px'}]">
        <span :class="$style['music-name']" :style="musicNameStyle">{{ musicInfo?.name }}</span>
        <span v-if="musicNameStyle['padding-right']!=='0px'" :class="$style['music-name']" :style="musicNameStyle">{{ musicInfo?.name }}</span>
      </div>
      <div :class="$style.artists">
        <span v-for="(item,index) of musicInfo?.artist" :key="item.id">
          {{ item.name }}{{ index!==musicInfo?.artist.length-1?'/':'' }}
        </span>
      </div>
      <span :class="$style.lyric">{{ currLyric }}</span>
    </div>
    <div :class="$style.control">
      <ProgressBar :class="$style['progress-bar']" :curr-time="currTime" :total-time="totalTime" @moving="moving" @jump="jumpTo" />
      <div :class="$style.button">
        <img :src="IconRand" :class="$style.icon1">
        <img :src="IconPrev" :class="$style.icon3" @click="prev">
        <img :src="state?IconPause:IconPlay" :class="$style.icon2" @click="state?pause():play()">
        <img :src="IconNext" :class="$style.icon3" @click="next">
        <img :src="IconList" :class="$style.icon1" @click="showList=true">
      </div>
    </div>
    <MusicList v-if="showList" @close="showList=false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue'
import Taro from '@tarojs/taro'
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

export default defineComponent({
  name: 'Music',
  components: {
    MusicList,
    ProgressBar
  },
  props: {
    musicInfo: {
      type: Object,
      required: true
    },
    state: {
      type: Boolean,
      required: true
    },
    currTime: {
      type: Number,
      required: true
    },
    totalTime: {
      type: Number,
      required: true
    },
    currLyric: {
      type: String,
      required: true
    }
  },
  setup(props, ctx) {
    const musicNameStyle = ref({
      'padding-right': `${0}px`
    })
    const showList = ref(false)

    let musicId = props.musicInfo.id

    watch(props, () => {
      if (props.musicInfo.id !== musicId) {
        musicId = props.musicInfo.id
        musicNameStyle.value['padding-right'] = '0px'
        Taro.nextTick(() => {
          isScroll()
        })
      }
    })

    const play = () => {
      player.audio.play()
    }

    const pause = () => {
      player.audio.pause()
    }

    const prev = () => {
      player.prev()
    }

    const next = () => {
      player.next()
    }

    const moving = (value:boolean) => {
      ctx.emit('moving', value)
    }

    const jumpTo = (jumpTime:number) => {
      ctx.emit('jump', jumpTime)
    }

    const isScroll = () => {
      const selectorQuery = Taro.createSelectorQuery()
      selectorQuery.select('#scrollName').fields({ size: true })
        .exec((res) => {
          const selectorQuery = Taro.createSelectorQuery()
          selectorQuery.select('#info').fields({ size: true })
            .exec((res2) => {
              if (res[0].width > res2[0].width) {
                setTimeout(() => {
                  musicNameStyle.value['padding-right'] = `30vw`
                }, 300)
              } else {
                musicNameStyle.value['padding-right'] = '0px'
              }
            })
        })
    }

    onMounted(() => {
      Taro.nextTick(() => {
        isScroll()
      })
    })

    return {
      musicNameStyle,
      IconPlay,
      IconPause,
      IconNext,
      IconPrev,
      IconRand,
      IconOrder,
      IconLoop,
      IconSingle,
      IconList,
      showList,
      play,
      pause,
      prev,
      next,
      moving,
      jumpTo
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
    .name-wrapper{
      display: inline-block;
    }
    .name-wrapper-scroll{
      animation: scroll 10s infinite linear;
    }
    @keyframes scroll {
      0%{
        transform: translateX(0);
      }
      90%{
        transform: translateX(-50%);
      }
      100%{
        transform: translateX(-50%);
      }
    }
    .music-name{
      display: inline-block;
      font-size: 46px;
      font-weight: bold;
      color: #fff;
      //padding-right: calc(100vw - 30px);
    }
    .artists{
      display: flex;
      align-items: center;
      font-size: 24px;
      color: #ffffffa0;
      margin: 30px 0;
    }
    .lyric{
      width: 100%;
      font-size: 36px;
      color: #ffffffaa;
      margin: 30px 0;
      overflow: auto;
      white-space:normal
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
        width: 100px;
        height: 100px;
      }
      .icon3{
        width: 70px;
        height: 70px;
      }
    }
  }
}
</style>
