<template>
  <div :class="[$style['music-list'],{[$style['music-list-show']]:state},{[$style['music-list-hide']]:!state}]" :style="maskStyle" @click="close">
    <div :class="[$style.content,{[$style['content-in']]:state},{[$style['content-out']]:!state}]" :style="contentStyle" @click.stop="">
      <div :class="$style.head" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
        <span id="bar" :class="$style.bar" />
      </div>
      <div :class="$style.list">
        <span
          v-for="(item,index) of musicList"
          :key="item.id"
          :class="[$style.item,{[$style['item-active']]:index===currIndex}]"
          @click="playSelect(index)"
        >
          <span :class="$style.name">{{ item.name }}</span>
          <span>-</span>
          <span :class="[$style.artist,{[$style['item-active']]:index===currIndex}]">
            <span v-for="(item2,index2) of item.artist" :key="item2.id">
              {{ item2.name }}{{ index2!==item.artist.length-1?'/':'' }}
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import player from '@/utils/player'
import { throttle } from '@/utils/frequency'
export default defineComponent({
  name: 'MusicList',
  setup(props, ctx) {
    const store = useStore()
    const state = ref(true)
    const currIndex = computed(() => store.state.currIndex)
    const musicList = ref([])
    const route = Taro.getCurrentPages()[Taro.getCurrentPages().length - 1].route
    let pageY = 0
    let move = 0
    let opacity = 0
    const maskStyle = ref({
      background: 'rgba(28, 28, 28,0.65)'
    })
    const contentStyle = ref({
      transform: 'translateY(0)',
      transition: ''
    })
    musicList.value = Taro.getStorageSync('musicList') || []
    const close = () => {
      state.value = false
      if (route === 'pages/music/music') {
        Taro.showTabBar({
          animation: true,
          fail: () => {
          }
        })
      }
      setTimeout(() => {
        ctx.emit('close')
      }, 300)
    }
    const playSelect = (index:number) => {
      player.playByIndex(index)
    }
    const touchstart = (e) => {
      pageY = e.touches[0].pageY
    }
    const touchmove = (e) => {
      throttle(moveAction(e), 100)
    }
    const moveAction = (e) => {
      move = (e.touches[0].pageY - pageY) > 0 ? (e.touches[0].pageY - pageY) : 0
      opacity = 0.65 - move / pageY
      opacity = opacity > 0.65 ? 0.65 : opacity
      maskStyle.value.background = `rgba(28, 28, 28,${opacity})`
      contentStyle.value.transform = `translateY(${move}px)`
    }
    const touchend = () => {
      if (move > 200) {
        contentStyle.value.transition = 'transform 0.3s, background 0.3s'
        maskStyle.value.background = 'rgba(28, 28, 28,0)'
        contentStyle.value.transform = `translateY(${100}%)`
        if (route === 'pages/music/music') {
          setTimeout(() => {
            Taro.showTabBar({
              animation: false,
              fail: () => {
              }
            })
          }, 200)
        }
        setTimeout(() => {
          ctx.emit('close')
        }, 300)
      } else {
        contentStyle.value.transition = 'transform 0.3s, background 0.3s'
        maskStyle.value.background = 'rgba(28, 28, 28,0.65)'
        contentStyle.value.transform = `translateY(${0}px)`
      }
    }
    onMounted(() => {
      if (route === 'pages/music/music') {
        setTimeout(() => {
          Taro.hideTabBar({
            animation: false,
            fail: () => {
            }
          })
        }, 50)
      }
    })
    return {
      state,
      currIndex,
      musicList,
      maskStyle,
      contentStyle,
      close,
      playSelect,
      touchstart,
      touchmove,
      touchend
    }
  }
})
</script>

<style module lang="scss">
.music-list{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(28, 28, 28,0.65);
  z-index: 3;
  .content{
    position: absolute;
    background: #fff;
    border-radius: 30px 30px 0 0;
    max-height: 70%;
    overflow: hidden;
    width: calc(100% - 100px);
    padding: 0 50px;
    bottom: 0;
    z-index: 3;
    .head{
      display: flex;
      height: 50px;
      .bar{
        margin: auto;
        width: 20%;
        height: 10px;
        background: #ccc;
        border-radius: 30px;
      }
    }
    .list{
      flex-direction: column;
      max-height: 900px;
      //height: calc(100% - 50px);
      overflow-y: auto;
      .item{
        display: block;
        align-items: center;
        padding: 5px 0;
        margin: 15px;
        max-width: 90%;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .name{
          font-size: 26px;
          margin-right: 10px;
        }
        .artist{
          margin-left: 10px;
          font-size: 20px;
          color: #868686;
        }
      }
      .item-active{
        color: #1DCF9F!important;
      }
    }
    ::-webkit-scrollbar {
      width: 0 !important;
      height: 0!important;
    }
  }
  .content-in{
    animation: in 0.3s;
  }
  .content-out{
    animation: out 0.3s;
  }
  @keyframes in {
    0%{
      transform: translateY(100%);
    }
    100%{
      //transform: translateY(0);
    }
  }
  @keyframes out {
    from{
      //transform: translateY(0);
    }
    to{
      transform: translateY(100%);
    }
  }
}
.music-list-show{
  animation: show 0.3s ease-out;
}
.music-list-hide{
  animation: hide 0.3s;
}
@keyframes show {
  0%{
    background: rgba(28, 28, 28,0);
  }
  100%{
    background: rgba(28, 28, 28,0.65);
  }
}
@keyframes hide {
  from{
    background: rgba(28, 28, 28,0.65);
  }
  to{
    background: rgba(28, 28, 28,0);
  }
}
</style>
