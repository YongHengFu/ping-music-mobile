<template>
  <div :class="$style['navigation-bar']" :style="navigationBarStyle">
    <Capsule />
    <div :class="$style.tabs" :style="tabsStyle">
      <span v-for="(item,index) of tabList" :key="item.name" :class="[$style.item,{[$style['item-active']]:index===currIndex}]" @click="changeTab(index)">
        {{ item.title }}
        <span v-if="index<tabList.length-1" :class="$style.split" @click.stop="">|</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Capsule from '@/components/Capsule.vue'
import { statusBarHeight, navigationBarHeight, pageWith, menuBarWidth } from '@/utils/navigationBarInfo'
export default defineComponent({
  name: 'NavigationBar',
  components: {
    Capsule
  },
  setup(props, ctx) {
    const navigationBarStyle = {
      height: `${navigationBarHeight}px`
    }
    const tabsStyle = {
      height: `${navigationBarHeight - statusBarHeight}px`,
      width: `${pageWith - menuBarWidth * 2}px`,
      transform: `translateY(${statusBarHeight}px)`
    }
    const tabList = [
      { title: '推荐', name: 'Rcmd' },
      { title: '歌曲', name: 'Music' },
      { title: '歌词', name: 'Lyric' }
    ]
    const currIndex = ref(1)

    const changeTab = (index:number) => {
      if (index !== currIndex.value) {
        currIndex.value = index
        ctx.emit('changeTab', tabList[currIndex.value].name)
      }
    }
    return {
      navigationBarStyle,
      tabsStyle,
      tabList,
      currIndex,
      changeTab
    }
  }
})
</script>

<style module lang="scss">
.navigation-bar{
  width: 100%;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffff00;
  z-index: 2;
  .tabs{
    display: flex;
    justify-content: center;
    align-items: center;
    .item{
      font-size: 24px;
      color: #9a9a9aa0;
      .split{
        margin: 0 10px;
        color: #9a9a9aa0;
      }
    }
    .item-active{
      color: #fff;
    }
  }
}
</style>
