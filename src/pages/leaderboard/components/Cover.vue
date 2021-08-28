<template>
  <div :class="$style.cover">
    <img :src="`${image}?param=300y300`" :class="$style.image"/>
    <span :class="$style.text">{{text}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Cover',
  props: {
    image: String,
    number: Number,
    text: String
  }
})
</script>

<style module lang="scss">
.cover{
  width: calc((100vw - 100px)/3);
  .image{
    width: calc((100vw - 100px)/3);
    height: calc((100vw - 100px)/3);
    border-radius: 15px;
  }
  .text{
    display: block;
    font-size: 20px;
    line-height: 20px;
    min-height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
