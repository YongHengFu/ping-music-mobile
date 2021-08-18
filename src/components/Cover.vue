<template>
  <div :class="$style.cover">
    <img :src="`${image}?param=300y300`" :class="$style.image" mode="widthFix"/>
    <span :class="$style.number">▶ {{ (number/10000).toFixed(1) }}万</span>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  .image{
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }
  .number{
    position: absolute;
    left: 0;
    bottom: 50px;
    background: rgba(122, 109, 193, 0.89);
    border-radius: 30px;
    font-size: 16px;
    padding: 5px 15px;
    color: #fff;
  }
  .text{
    width: 100%;
    font-size: 18px;
    line-height: 20px;
    min-height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-top: 20px;
  }
}
</style>
