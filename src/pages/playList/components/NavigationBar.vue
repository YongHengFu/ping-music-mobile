<template>
  <div :class="$style['navigation-bar']" :style="navigationBarStyle">
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
    const titleStyle = ref({
      'height': `${menuBarHeight}px`,
      'width': `calc(100% - 2 * ${menuBarWidth}px)`,
      'margin-top': `${statusBarHeight + (navigationBarHeight - statusBarHeight - menuBarHeight) / 2}px`,
      'color': `#fff`
    })

    watch(props, () => {
      navigationBarStyle.value['background-image'] = `linear-gradient(to right, ${props.color[2]} , ${props.color[1]} , ${props.color[0]});`
    })

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
  background: transparent;
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
