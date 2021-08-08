<template>
  <div>
    <swiper
      :class="$style.banner"
      indicator-color="#cccccca0"
      indicator-active-color="#fff"
      :circular="true"
      :indicator-dots="true"
      :autoplay="true"
    >
      <swiper-item v-for="item of bannerList" :key="item.targetId">
        <div :class="$style.item">
          <img :src="item.pic" :class="$style.image">
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getBanner } from '@/api/music'

export default defineComponent({
  name: 'Banner',
  setup() {
    const bannerList = ref([])
    const getBannerData = () => {
      getBanner().then((res:any) => {
        if (res.code === 200) {
          bannerList.value = res.banners
        }
      })
    }
    onMounted(() => {
      getBannerData()
    })
    return {
      bannerList
    }
  }
})
</script>

<style module lang="scss">
.banner{
  width: 100%;
  .item{
    width: calc(100% - 60px);
    aspect-ratio: 75/29;
    height: 100%;
    padding: 0 30px;
  }
  .image{
    width: 100%;
    height: 100%;
    border-radius: 20px;
  }
}
</style>
