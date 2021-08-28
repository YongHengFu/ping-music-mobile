<template>
  <div :class="$style['navigation-bar']" :style="navigationBarStyle">
    <Capsule :mode="true"/>
    <div :class="$style.title" :style="titleStyle">
      <span :class="$style.text">排行榜</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Capsule from '@/components/Capsule.vue'
import { menuBarHeight, menuBarWidth, navigationBarHeight, statusBarHeight } from '@/utils/navigationBarInfo'
export default defineComponent({
  name: 'NavigationBar',
  components: {
    Capsule
  },
  setup() {
    const navigationBarStyle = {
      height: `${navigationBarHeight}px`
    }
    const titleStyle = {
      'height': `${menuBarHeight}px`,
      'width': `calc(100% - 2 * ${menuBarWidth}px)`,
      'margin-top': `${statusBarHeight + (navigationBarHeight - statusBarHeight - menuBarHeight) / 2}px`
    }

    return {
      navigationBarStyle,
      titleStyle
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
  z-index: 2;
  background: #ffffff;
  .title{
    display: flex;
    .text{
      margin: auto;
      width: 100%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
