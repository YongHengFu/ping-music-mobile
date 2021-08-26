<template>
  <div :class="$style['navigation-bar']" :style="navigationBarStyle">
    <div :class="$style.mask" :style="maskStyle" />
    <Capsule />
    <div :class="$style.title" :style="titleStyle">
      <span :class="$style.text">{{ title }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Capsule from '@/components/Capsule.vue'
import { menuBarHeight, menuBarWidth, navigationBarHeight, statusBarHeight } from '@/utils/navigationBarInfo'
export default defineComponent({
  name: 'NavigationBar',
  components: {
    Capsule
  },
  props: {
    title: {
      type: String,
      required: true
    },
    color: {
      type: Array,
      required: true
    }
  },
  setup(props, ctx) {
    const navigationBarStyle = ref({
      height: `${navigationBarHeight}px`,
      'background-image': ''
    })
    const maskStyle = ref({
      height: `${navigationBarHeight}px`
    })
    const titleStyle = ref({
      'height': `${menuBarHeight}px`,
      'width': `calc(100% - 2 * ${menuBarWidth}px)`,
      'margin-top': `${statusBarHeight}px`,
      'color': `#fff`
    })

    watch(props, () => {
      navigationBarStyle.value['background-image'] = `linear-gradient(to right, ${props.color[2]} , ${props.color[1]} , ${props.color[0]});`
    })

    return {
      navigationBarStyle,
      titleStyle,
      maskStyle
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
  background: transparent;
  .mask{
    position: absolute;
    width: 100%;
    height: 100%;
    transform: scale(1.1);
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    //filter: blur(20px);
    z-index: -2;
    background-size: 10%
  }
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
