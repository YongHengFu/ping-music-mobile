<template>
  <div :class="$style['page-leaderboard']" :style="pageStyle">
    <NavigationBar />
    <div :class="$style['super-list']">
      <span :class="$style.title">超级榜</span>
      <div
        v-for="item of superList"
        :key="item.id"
        @click="openList(item?.id)"
      >
        <BoardBlock :data="item"/>
      </div>
    </div>
    <div class="cloud">
      <span :class="$style.title">云听榜</span>
      <div :class="$style['order-list']">
        <Cover
          v-for="item of cloudList"
          :key="item?.id"
          :image="item?.coverImgUrl"
          :text="item?.name"
          @click="openList(item?.id)"
        />
      </div>
    </div>
    <div class="global">
      <span :class="$style.title">全球榜</span>
      <div :class="$style['order-list']">
        <Cover
          v-for="item of globalList"
          :key="item?.id"
          :image="item?.coverImgUrl"
          :text="item?.name"
          @click="openList(item?.id)"
        />
      </div>
    </div>
    <div class="pattern">
      <span :class="$style.title">花样榜</span>
      <div :class="$style['order-list']">
        <Cover
          v-for="item of patternList"
          :key="item?.id"
          :image="item?.coverImgUrl"
          :text="item?.name"
          @click="openList(item?.id)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import NavigationBar from '@/pages/leaderboard/components/NavigationBar.vue'
import BoardBlock from '@/pages/leaderboard/components/BoardBlock.vue'
import Cover from '@/pages/leaderboard/components/Cover.vue'
import { getTopList } from '@/api/music'
import Taro from '@tarojs/taro'
import { navigationBarHeight } from '@/utils/navigationBarInfo'
export default defineComponent({
  name: 'Leaderboard',
  components: {
    NavigationBar,
    BoardBlock,
    Cover
  },
  setup() {
    const pageStyle = {
      'margin-top': `${navigationBarHeight + 10}px`
    }
    const topList = ref([])
    const superList = ref([])
    const cloudList = ref([])
    const globalList = ref([])
    const patternList = ref([])

    const getTopListData = () => {
      getTopList().then((res:any) => {
        if (res.code === 200) {
          topList.value = res.list
          classify(res.list)
        }
      })
    }
    const classify = (list:any) => {
      for (const [index, item] of list.entries()) {
        if (index < 4) {
          superList.value.push(item)
        } else if (item.name.indexOf('云音乐') !== -1 || item.name.indexOf('语榜') !== -1) {
          cloudList.value.push(item)
        } else {
          switch (item.name) {
            case '黑胶VIP爱听榜':
            case 'KTV唛榜':
            case '中国新乡村音乐排行榜':
            case '潜力爆款榜':
            case '听歌识曲榜':
            case '网络热歌榜':
              patternList.value.push(item)
              break
            default:
              globalList.value.push(item)
              break
          }
        }
      }
    }

    const openList = (id:string) => {
      Taro.navigateTo({
        url: `/pages/playList/playList?id=${id}`
      })
    }

    onMounted(() => {
      getTopListData()
    })

    return {
      pageStyle,
      topList,
      superList,
      cloudList,
      globalList,
      patternList,
      openList
    }
  }
})
</script>

<style module lang="scss">
.page-leaderboard{
  padding: 0 30px;
  .title{
    display: block;
    font-size: 40px;
    margin-bottom: 15px;
    font-weight: bolder;
  }
  .super-list{
    display: flex;
    flex-direction: column;
  }
  .order-list{
    display: grid;
    grid-template-columns: repeat(3, calc((100vw - 100px)/3));
    grid-template-rows: repeat(1, calc((100vw - 100px)/3 + 40px));
    grid-gap: 10px 20px;
    margin: 10px 0;
  }
}
</style>
