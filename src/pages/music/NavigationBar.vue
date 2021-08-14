<template>
  <div :class="$style['navigation-bar']" :style="navigationBarStyle">
    <div :style="searchInputStyle">
      <div :class="$style.search" :style="inputStyle">
        <img :src="searchIcon" :class="$style.icon">
        <input type="text" placeholder="搜索你想找的音乐" :class="$style.input">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { statusBarHeight, navigationBarHeight, pageWith, menuBarHeight, menuBarWidth } from '@/utils/navigationBarInfo'
import searchIcon from '@/assets/icons/search.png'

export default defineComponent({
  name: 'NavigationBar',
  setup() {
    const navigationBarStyle = {
      height: `${navigationBarHeight}px`
    }
    const searchInputStyle = {
      display: 'flex',
      height: `${navigationBarHeight - statusBarHeight}px`,
      width: `${pageWith - menuBarWidth}px`,
      transform: `translateY(${statusBarHeight}px)`
    }
    const inputStyle = {
      height: `${menuBarHeight}px`
    }
    return {
      searchIcon,
      navigationBarStyle,
      searchInputStyle,
      inputStyle
    }
  }
})
</script>

<style module lang="scss">
.navigation-bar{
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffffef;
  z-index: 2;
  .search{
    width: 90%;
    margin: auto 30px;
    display: flex;
    align-items: center;
    color: #868686;
    background: #f6f6f6;
    border-radius: 50px;
    padding: 0 20px;
    .icon{
      width: 35px;
      height: 35px;
      margin-right: 10px;
    }
    .input{
      width: calc(100% - 35px);
      outline: none;
    }
  }
}
</style>
