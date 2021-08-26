<template>
  <div :class="$style['navigation-bar']" :style="navigationBarStyle">
    <Capsule />
    <div :class="$style.title" :style="titleStyle">
      <span :class="$style.text">{{ navigationTitle }}</span>
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
    opcaity: {
      type: Number,
      required: true
    }
  },
  setup(props, ctx) {
    const navigationBarStyle = ref({
      height: `${navigationBarHeight}px`,
      background: `rgba(255,255,255,${props.opcaity})`
    })
    const navigationTitle = ref('歌单')
    const titleStyle = ref({
      'height': `${menuBarHeight}px`,
      'width': `calc(100% - 2 * ${menuBarWidth}px)`,
      'margin-top': `${statusBarHeight}px`,
      'color': `#fff`
    })

    watch(props, () => {
      navigationBarStyle.value.background = `rgba(28, 223, 159,${props.opcaity})`
      if (props.opcaity > 0.3) {
        navigationTitle.value = props.title
        // titleStyle.value.color = '#1c1c1c'
      } else {
        navigationTitle.value = '歌单'
        titleStyle.value.color = '#fff'
      }
    })

    return {
      navigationBarStyle,
      titleStyle,
      navigationTitle
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
