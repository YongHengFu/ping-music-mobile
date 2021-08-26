<template>
  <div :class="$style['page-play-list']" @scroll="pageScroll">
    <NavigationBar :title="navigationTitle" :color="navigationColor" />
    <div :class="$style.head" :style="headStyle">
      <canvas id="headMask" type="2d" :class="$style.mask" />
      <div :class="$style.wrapper">
        <div :class="$style.cover">
          <img :src="listInfo?.coverImgUrl+'?param=500y500'" :class="$style.image">
        </div>
        <div :class="$style.info">
          <span :class="$style.name">{{ listInfo?.name }}</span>
          <span :class="$style.creator">
            <img :src="`${listInfo?.creator?.avatarUrl}?param=200y200`" :class="$style.avatar">
            <span :class="$style.name">{{ listInfo?.creator?.nickname }}</span>
          </span>
          <span :class="$style.dsca">简介：{{ listInfo?.description }}</span>
        </div>
      </div>
      <div :class="$style['operate-bar']">
        <div :class="$style.item">
          <img :src="IconAdd" :class="$style.icon">
          <span :class="$style.text">{{ listInfo?.subscribedCount }}</span>
        </div>
        <div :class="$style.item">
          <img :src="IconComment" :class="$style.icon">
          <span :class="$style.text">{{ listInfo?.commentCount }}</span>
        </div>
        <div :class="$style.item">
          <img :src="IconShare" :class="$style.icon">
          <span :class="$style.text">{{ listInfo?.shareCount }}</span>
        </div>
      </div>
    </div>
    <div :class="$style['play-bar']" :style="stickyStyle" @click="playAll">
      <img :src="IconPlay" :class="$style.icon">
      播放全部
      <span :class="$style.text">({{ listInfo?.trackCount }})</span>
    </div>
    <div>
      <MusicItem v-for="item of musicList" :key="item.id" :music="item" @click="playSelect(item)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Taro from '@tarojs/taro'
import colorThief from '#/miniapp-color-thief'
import IconAdd from '@/assets/icons/add.png'
import IconComment from '@/assets/icons/comment.png'
import IconShare from '@/assets/icons/share.png'
import IconPlay from '@/assets/icons/play-primary.png'
import NavigationBar from '@/pages/playList/components/NavigationBar.vue'
import MusicItem from '@/components/MusicItem.vue'
import { getListById, getMusicDetail } from '@/api/music'
import { navigationBarHeight } from '@/utils/navigationBarInfo'
import { playAble } from '@/utils/musicList'
import player from '@/utils/player'
import Store from '@/store'
export default defineComponent({
  name: 'PlayList',
  components: {
    NavigationBar,
    MusicItem
  },
  onLoad(params) {
    this.getListData(params.id)
  },
  onPageScroll(e) {
    this.pageScroll(e.scrollTop)
  },
  setup() {
    const musicList = ref([])
    const listInfo = ref({})
    const headStyle = ref({
      'padding-top': `${navigationBarHeight}px`,
      'background-image': ''
    })
    const stickyStyle = {
      top: `${navigationBarHeight}px`
    }
    const navigationTitle = ref('歌单')
    const navigationColor = ref([])
    let playMusicList:any = []
    let isPlayAll = false

    const getListData = async(id:string) => {
      const param = { 'id': id }
      await getListById(param).then(async(res:any) => {
        if (res.code === 200) {
          listInfo.value = res.playlist
          getMusicList(res.playlist.trackIds)
          getPrimaryColor(`${res.playlist.coverImgUrl}?param=500y500`)
        }
      })
    }

    const getMusicList = async(list:any) => {
      playMusicList = []
      let playIndex = 0
      let ids = ''
      for (let i = 0; i < list.length; i += 50) {
        ids = ''
        if (i + 50 < list.length) {
          for (const item of list.slice(i, i + 50)) {
            ids += item.id + ','
          }
        } else {
          for (const item of list.slice(i, list.length)) {
            ids += item.id + ','
          }
        }
        const param = { 'ids': ids.slice(0, ids.length - 1) }
        await getMusicDetail(param).then((res:any) => {
          if (res.code === 200) {
            const songs = res.songs
            const details = [] as any
            for (const [index, item] of songs.entries()) {
              const song:any = {
                index: index,
                id: item.id,
                name: item.name,
                artist: item.ar,
                album: item.al,
                mvId: item.mv,
                duration: item.dt / 1000,
                publishTime: item.publishTime,
                privileges: res.privileges[index],
                fee: item.fee,
                noCopyrightRcmd: item.noCopyrightRcmd,
                canPlay: null,
                listId: 'playList'
              }
              song.canPlay = playAble(song)
              details.push(song)
              if (song.canPlay.able) {
                song.index = playIndex
                playIndex++
                playMusicList.push(song)
              }
            }
            musicList.value = musicList.value.concat(details)
          }
        })
      }
      if (isPlayAll) {
        isPlayAll = false
        Taro.setStorageSync('musicList', playMusicList)
      }
    }

    const getPrimaryColor = (imageUrl:string) => {
      const selectorQuery = Taro.createSelectorQuery()
      selectorQuery.select('#headMask').fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0]?.node
          if (!canvas) {
            return
          }
          const context = canvas.getContext('2d')
          const img = canvas.createImage()
          img.src = imageUrl
          img.onload = () => {
            context.drawImage(img, 0, 0, 500, 500)
            const data = context.getImageData(0, 0, 500, 500).data
            const palette = colorThief(data)
              .palette(3)
              .getHex()
            headStyle.value['background-image'] = `linear-gradient(to right, ${palette[2]} , ${palette[1]} , ${palette[0]});`
            navigationColor.value = palette
          }
        })
    }

    const pageScroll = (top:number) => {
      if (top > 100) {
        navigationTitle.value = listInfo.value.name
      } else {
        navigationTitle.value = '歌单'
      }
    }

    const playAll = () => {
      if (playMusicList.length > 0) {
        isPlayAll = true
        Taro.setStorageSync('musicList', playMusicList)
        let singer = ''
        for (const item of playMusicList[0].artist) {
          singer += item.name
        }
        player.audio.title = playMusicList[0].name
        player.audio.epname = playMusicList[0].album.name
        player.audio.singer = singer
        player.audio.coverImgUrl = playMusicList[0].album.picUrl + '?param=300y300'
        player.audio.src = `https://music.163.com/song/media/outer/url?id=${playMusicList[0].id}.mp3`
        Store.commit('setCurrIndex', 0)
      }
    }

    const playSelect = (music:any) => {
      if (music.canPlay.able) {
        isPlayAll = true
        for (const item of playMusicList) {
          if (item.id === music.id) {
            Taro.setStorageSync('musicList', playMusicList)
            let singer = ''
            for (const item2 of item.artist) {
              singer += item2.name
            }
            player.audio.title = item.name
            player.audio.epname = item.album.name
            player.audio.singer = singer
            player.audio.coverImgUrl = item.album.picUrl + '?param=300y300'
            player.audio.src = `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`
            Store.commit('setCurrIndex', 0)
            return
          }
        }
      } else {
        Taro.showToast({
          title: music.canPlay.msg,
          icon: 'none'
        })
      }
    }
    return {
      musicList,
      listInfo,
      headStyle,
      stickyStyle,
      navigationTitle,
      navigationColor,
      IconAdd,
      IconComment,
      IconShare,
      IconPlay,
      pageScroll,
      getListData,
      playAll,
      playSelect
    }
  }
})
</script>

<style module lang="scss">
.page-play-list{
  .head{
    padding: 0 7vw;
    position: relative;
    overflow: hidden;
    .mask{
      position: absolute;
      width: 100%;
      height: 100%;
      visibility: hidden;
    }
    .wrapper{
      padding: 50px 0;
      display: flex;
      align-items: center;
      .cover{
        width: 41vw;
        min-width: 41vw;
        height: 36vw;
        position: relative;
        &:before{
          content: "";
          position: absolute;
          width: 20vw;
          height: 80%;
          right: 3.5vw;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 12px;
          background: #ffffff20;
          z-index: -1;
        }
        .image{
          width: 36vw;
          height: 36vw;
          border-radius: 20px;
        }
      }
      .info{
        width: 45vw;
        height: 36vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name{
          font-size: 40px;
          color: #fff;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .creator{
          display: flex;
          align-items: center;
          .avatar{
            width: 50px;
            min-width: 50px;
            height: 50px;
            margin-right: 10px;
            border-radius: 50%;
          }
          .name{
            font-size: 26px;
            color: #ffffffdd;
          }
        }
        .dsca{
          font-size: 28px;
          color: #ffffffdd;
          width: 100%;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .operate-bar{
      width: 100%;
      padding-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item{
        display: flex;
        align-items: center;
        .icon{
          width: 50px;
          height: 50px;
          margin-right: 20px;
        }
        .text{
          color: #fff;
          font-size: 24px;
        }
      }
    }
  }
  .play-bar{
    padding: 20px 30px;
    display: flex;
    align-items: center;
    position: sticky;
    background: #fff;
    top: 0;
    .icon{
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .text{
      margin-left: 10px;
      color: #000000a0;
    }
  }
}
</style>
