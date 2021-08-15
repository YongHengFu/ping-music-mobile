<template>
  <div :class="$style.capsule" :style="capsuleStyle">
    <img :src="IconBack" :class="$style.back" @click="navigateBack">
    <img :src="IconHome" :class="$style.home" @click="navigateHome">
  </div>
</template>

<script lang="ts">
import Taro from '@tarojs/taro'
import { defineComponent } from 'vue'
import IconBack from '@/assets/icons/back.png'
import IconHome from '@/assets/icons/home.png'
export default defineComponent({
  name: 'Capsule',
  setup() {
    const systemInfo = Taro.getSystemInfoSync()
    const menuBarInfo = Taro.getMenuButtonBoundingClientRect()
    const capsuleStyle = {
      height: `${menuBarInfo.height}px`,
      width: `${menuBarInfo.width}px`,
      margin: `${menuBarInfo.top - systemInfo.statusBarHeight}px ${systemInfo.screenWidth - menuBarInfo.right}px`,
      transform: `translateY(${systemInfo.statusBarHeight}px)`
    }
    const navigateBack = () => {
      Taro.navigateBack({
        delta: 1
      })
    }
    const navigateHome = () => {
      Taro.switchTab({
        url: '/pages/music/music'
      })
    }
    return {
      IconBack,
      IconHome,
      capsuleStyle,
      navigateBack,
      navigateHome
    }
  }
})
</script>

<style module lang="scss">
.capsule{
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #d8d8d8;
  border-radius: 50px;
  background: #fff;
  .back{
    width: 50px;
    height: 50px;
    transform: translateX(-10px);
  }
  .home{
    width: 40px;
    height: 40px;
    transform: translateX(-5px);
  }
}
</style>
