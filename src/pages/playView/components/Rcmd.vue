<template>
  <div :class="$style['page-rcmd']">
    <div :class="$style.info">
      <span :class="$style['music-name']">{{ musicInfo?.name }}</span>
      <div :class="$style.driver" />
      <div :class="$style['artist-album']">
        <div :class="$style.artist">
          <img :src="cover" :class="$style.img">
          <span>歌手：</span>
          <span v-for="(item,index) of musicInfo?.artist" :key="item.id">
            {{ item.name }}{{ index!==musicInfo?.artist.length-1?'/':'' }}
          </span>
        </div>
        <div :class="$style.album">
          <img :src="musicInfo?.album?.picUrl+'?param=500y500'" :class="$style.img">
          <span>专辑：{{ musicInfo?.album?.name }}</span>
        </div>
      </div>
    </div>
    <div :class="$style['play-list']">
      <span :class="$style.title">相关歌单</span>
      <div v-for="item of simiPlayList" :key="item.id" :class="$style.item">
        <img :src="item.coverImgUrl+'?param=300y300'" :class="$style.img">
        <div :class="$style['item-info']">
          <span :class="$style.name">{{ item.name }}</span>
          <span :class="$style.count">{{ item.trackCount }}首</span>
        </div>
      </div>
    </div>
    <div :class="$style['music-list']">
      <span :class="$style.title">相似歌曲</span>
      <div v-for="item of simiMusicList" :key="item.id" :class="$style.item">
        <img :src="item.album.picUrl+'?param=300y300'" :class="$style.img">
        <div :class="$style['item-info']">
          <span :class="$style.name">{{ item.name }}</span>
          <span :class="$style.artist">
            <span v-for="(item2,index) of item?.artists" :key="item2.id">
              {{ item2.name }}{{ index!==item?.artists.length-1?'/':'' }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { getArtistInfo, getSimiMusic, getSimiPlayList } from '@/api/music'

export default defineComponent({
  name: 'Rcmd',
  props: {
    musicInfo: Object
  },
  setup(props, ctx) {
    const cover = ref('')
    const simiPlayList = ref([])
    const simiMusicList = ref([])
    watch(props, () => {
      getArtInfo(props?.musicInfo?.artist[0]?.id)
      getSimiPlayListData(props?.musicInfo?.id)
      getSimiMusicListData(props?.musicInfo?.id)
    })

    const getArtInfo = (id:string) => {
      const param = { id: id }
      getArtistInfo(param).then((res:any) => {
        if (res.code === 200) {
          cover.value = res.data.artist.cover + '?param=200y200'
        }
      })
    }

    const getSimiPlayListData = (id:string) => {
      const param = { id: id }
      getSimiPlayList(param).then((res:any) => {
        if (res.code === 200) {
          simiPlayList.value = res.playlists
        }
      })
    }

    const getSimiMusicListData = (id:string) => {
      const param = { id: id }
      getSimiMusic(param).then((res:any) => {
        if (res.code === 200) {
          simiMusicList.value = res.songs
        }
      })
    }

    return {
      cover,
      simiPlayList,
      simiMusicList
    }
  }
})
</script>

<style module lang="scss">
.page-rcmd{
  padding: 30px 50px;
  height: 100%;
  overflow-y: auto;
  .info{
    background: #ffffff20;
    border-radius: 20px;
    padding: 20px 40px 0 40px;
    width: calc(100% - 80px);
    color: #fff;
    .music-name{
      display: inline-block;
      width: 100%;
      font-size: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .driver{
      width: 100%;
      height: 3px;
      margin: 20px 0;
      background: #ffffff30;
    }
    .artist-album{
      display: flex;
      flex-wrap: wrap;
      font-size: 26px;
      .artist,.album{
        display: flex;
        align-items: center;
      }
      .artist{
        margin-right: 50px;
        padding-bottom: 20px;
        .img{
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 20px;
        }
      }
      .album{
        padding-bottom: 20px;
        .img{
          width: 50px;
          height: 50px;
          border-radius: 6px;
          margin-right: 20px;
        }
      }
    }
  }
  .title{
    display: block;
    font-size: 30px;
    color: #fff;
    margin: 60px 0 30px 0;
  }
  .play-list{
    display: flex;
    flex-direction: column;
    .item{
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      &:last-child{
        margin-bottom: 0;
      }
      .img{
        min-width: 120px;
        width: 120px;
        height: 120px;
        border-radius: 10px;
        margin-right: 30px;
      }
      .item-info{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: calc(100% - 150px);
        .name{
          width: 100%;
          font-size: 30px;
          color: #fff;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .count{
          font-size: 22px;
          color: #ffffff60;
        }
      }
    }
  }
  .music-list{
    display: flex;
    flex-direction: column;
    .item{
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      &:last-child{
        padding-bottom: 30px;
      }
      .img{
        min-width: 120px;
        width: 120px;
        height: 120px;
        border-radius: 10px;
        margin-right: 30px;
      }
      .item-info{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: calc(100% - 150px);
        .name{
          width: 100%;
          font-size: 30px;
          color: #fff;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .artist{
          font-size: 22px;
          color: #ffffff60;
        }
      }
    }
  }
}
</style>
