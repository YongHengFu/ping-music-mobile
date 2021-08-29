<template>
  <canvas :id="'boardCover'+data.id" type="2d" :class="$style['board-cover']" />
  <div :class="$style['board-wrapper']" :style="wrapperStyle">
    <div :class="$style.info">
      <!--      <span :class="$style.name">{{ data.name }}</span>-->
      <span v-for="(item,index) of data.tracks" :key="item.first" :class="$style.item">{{ index+1 }}. {{ item.first }}-{{ item.second }}</span>
    </div>
    <img :src="`${data.coverImgUrl}?param=300y300`" :class="$style.cover">
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Taro from '@tarojs/taro'
import colorThief from '#/miniapp-color-thief'

export default defineComponent({
  name: 'BoardBlock',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props, ctx) {
    const wrapperStyle = ref({
      background: ''
    })

    const getPrimaryColor = (imageUrl:string) => {
      const selectorQuery = Taro.createSelectorQuery()
      selectorQuery.select('#boardCover' + props.data.id).fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0]?.node
          if (!canvas) {
            return
          }
          const width = 100
          const height = 100
          canvas.width = width
          canvas.height = height
          const context = canvas.getContext('2d')
          const image = canvas.createImage()
          image.src = imageUrl
          image.onload = () => {
            context.drawImage(image, 0, 0, width, height)
            const data = context.getImageData(0, 0, 5, height).data
            const palette = colorThief(data)
              .color(10)
              .get()
            wrapperStyle.value.background = `rgb(${palette})`
          }
        })
    }
    onMounted(() => {
      if (props?.data?.coverImgUrl) {
        Taro.nextTick(() => {
          getPrimaryColor(`${props.data.coverImgUrl}?param=300y300`)
        })
      }
    })

    return {
      wrapperStyle
    }
  }
})
</script>

<style module lang="scss">
.board-cover{
  width: 0;
  height: 0;
  visibility: hidden;
}
.board-wrapper{
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  margin: 10px 0;
  .info{
    width: calc(100% - 240px);
    height: 160px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .name{
      font-size: 36px;
      font-weight: bold;
      color: #fff;
    }
    .item{
      font-size: 26px;
      color: #fff;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .cover{
    width: 200px;
    min-width: 200px;
    height: 200px;
    border-radius: 0 20px 20px 0;
  }
}
</style>
