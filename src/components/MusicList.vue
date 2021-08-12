<template>
  <div :class="$style['music-list']" @click="close">
    <div :class="$style.content" @click.stop="">
      <div :class="$style.head">
        <span :class="$style.bar" />
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
export default defineComponent({
  name: 'MusicList',
  setup(props, ctx) {
    const store = useStore()
    const currIndex = computed(() => store.state.currIndex)
    const musicList = ref([])
    musicList.value = Taro.getStorageSync('musicList') || []
    const close = () => {
      ctx.emit('close')
    }
    const playSelect = (index:number) => {
      player.playByIndex(index)
    }
    return {
      currIndex,
      musicList,
      close,
      playSelect
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
  background: rgba(146, 145, 145, 0.63);
  z-index: 3;
  .content{
    position: absolute;
    background: #fff;
    border-radius: 30px 30px 0 0;
    height: 70%;
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
      max-height: calc(100% - 50px);
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
}
</style>
