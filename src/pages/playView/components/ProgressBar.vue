<template>
  <div :class="$style['progress-bar']" :catch-move="true">
    <div :class="$style.bar" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
      <div :class="$style['bar-total']">
        <div :class="$style['bar-curr']" :style="barStyle">
          <div :class="$style.slider" />
        </div>
      </div>
    </div>
    <div :class="$style.time">
      <span>{{ timeFormat(currTime) }}</span>
      <span>{{ timeFormat(totalTime) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { throttle } from '@/utils/frequency'
import Taro from '@tarojs/taro'
import player from '@/utils/player'
import timeFormat from '@/utils/timeFormat'

export default defineComponent({
  name: 'ProgressBar',
  props: {
    currTime: {
      type: Number,
      required: true
    },
    totalTime: {
      type: Number,
      required: true
    }
  },
  setup(props, ctx) {
    const barStyle = ref({
      right: `${100}%`
    })
    let auto = true
    let offsetLeft = 0
    const screenWidth = Taro.getSystemInfoSync().screenWidth
    let barWidth = 0
    let startX = 0
    let right = 0

    watch(props, () => {
      if (auto) {
        // currTime.value = player.audio.currentTime
        barStyle.value.right = `${(1 - props.currTime / props.totalTime) * 100}%`
      }
    })

    const touchstart = (e) => {
      auto = false
      ctx.emit('moving', true)
      offsetLeft = e.mpEvent.target.offsetLeft
      barWidth = screenWidth - 2 * offsetLeft
      startX = e.touches[0].pageX
      right = (1 - (startX - offsetLeft) / barWidth) * 100
      barStyle.value.right = `${right}%`
    }
    const touchmove = (e) => {
      throttle(moveAction(e), 100)
    }
    const moveAction = (e) => {
      const moveX = e.touches[0].pageX
      right = (1 - (moveX - offsetLeft) / barWidth) * 100
      right = right < 0 ? 0 : (right > 100 ? 100 : right)
      barStyle.value.right = `${right}%`
      // currTime.value = (1 - right / 100) * totalTime.value
    }
    const touchend = () => {
      ctx.emit('moving', false)
      player.audio.seek((1 - right / 100) * props.totalTime)
      auto = true
    }

    return {
      barStyle,
      touchstart,
      touchmove,
      touchend,
      timeFormat
    }
  }
})
</script>

<style module lang="scss">
.progress-bar{
  width: 100%;
  .bar{
    width: 100%;
    height: 50px;
    position: relative;
    .bar-total{
      width: 100%;
      height: 8px;
      background: #686868a0;
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 100px;
      .bar-curr{
        height: 8px;
        background: #fff;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 100%;
        border-radius: 100px;
        pointer-events: none;
        .slider{
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
      }
    }
  }
  .time{
    display: flex;
    justify-content: space-between;
    //margin-top: 10px;
    font-size: 20px;
    color: #ccc;
  }
}
</style>
