<template>
  <div :class="$style['music-item']">
    <img :src="`${music.album.picUrl}?param=200y200`" :class="$style.cover"/>
    <span :class="$style.info">
      <span :class="[$style.name,{[$style['name-invalid']]:!music?.canPlay.able}]">{{ music.name }}</span>
      <span :class="$style.dsca">
        <span v-for="(item,index) of music?.artist" :key="item.id">
          {{ item.name }}{{ index!==music?.artist.length-1?'/':'' }}
        </span>
      </span>
    </span>
    <div :class="$style.operate">
      <img :src="IconMore" :class="$style.icon">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IconMore from '@/assets/icons/more.png'
export default defineComponent({
  name: 'MusicItem',
  props: {
    music: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      IconMore
    }
  }
})
</script>

<style module lang="scss">
.music-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  &:active{
    background: #cccccc20;
  }
  .cover{
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }
  .info{
    width: calc(100% - 200px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    .name{
      font-size: 30px;
      color: #000;
    }
    .name-invalid{
      font-size: 30px;
      color: rgba(227, 227, 227, 0.8) !important;
    }
    .dsca{
      font-size: 26px;
      color: #000000cc;
      margin-top: 10px;
    }
  }
  .operate{
    display: flex;
    align-items: center;
    .icon{
      width: 50px;
      height: 50px;
    }
  }
}
</style>
