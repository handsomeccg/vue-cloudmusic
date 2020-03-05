<template>
  <transition name="songList">
    <div class="list-detail">
      <div class="head">
        <svg class="icon" aria-hidden="true" @click="back">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        <span style="margin-left: 38%">排行榜</span>
      </div>
      <div class="title">
        <div class="cover">
          <img :src="songs.coverImgUrl">
        </div>
        <div class="brief">
          <div class="description">{{songs.description}}</div>
        </div>
      </div>
      <list-view :songs="songs" @playAll="playAll" @selectItem="selectItem"></list-view>
    </div>
  </transition>
</template>

<script>
import { getRankDetail } from '@/api/rank'
import { getSongUrl } from '@/api/song'
import listView from '@/components/songList/listView'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'rankDetail',
  components: { listView },
  created () {
    this.getListDetail()
  },
  computed: {
    ...mapGetters([
      'currentIndex',
      'fullScreen',
      'playing'
    ])
  },
  data () {
    return {
      songs: {},
      songIds: [],
      playList: []
    }
  },
  methods: {
    async getListDetail () {
      console.log(123)
      await getRankDetail(this.$route.query.id).then(res => {
        this.songs = res.data.playlist
        this.songIds = res.data.playlist.trackIds.map(item => item.id)
        this.playList = res.data.playlist.tracks.map(item => (
          {
            id: item.id,
            songTime: item.dt / 1000,
            picUrl: item.al.picUrl,
            name: item.name,
            artist: item.ar.map(item => item.name).join('/')
          }
        ))
        // console.log(this.songs)
      })
      // 获取歌曲url
      getSongUrl({ id: this.songIds.join(',') }).then(res => {
        // console.log(this.songIds)
        // console.log(res.data)
        res.data.data.forEach((item, index) => {
          const urlIndex = this.songIds.indexOf(item.id)
          // this.playList[urlIndex] = this.playList[urlIndex] || {}
          this.playList[urlIndex].mp3Url = item.url
        })
        console.log(this.playList)
      })
    },
    back () {
      this.$router.back()
    },
    selectItem (item, index) {
      // console.log(this.playList)
      // const playList = this.playList.filter(item => item.mp3Url !== null)
      this.selectPlay({
        list: this.playList,
        index
      })
    },
    playAll () {
      this.selectPlay({
        list: this.playList,
        index: 0
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.query.id) {
        this.getListDetail()
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  .songList-enter-active, .songList-leave-active {
    transition: all 0.4s
  }
  .songList-enter, .songList-leave-to {
    transform: translate3d(100%, 0, 0)
  }
  .list-detail {
    position: absolute
    z-index: 20
    top: 0
    left: 0
    right: 0
    background #ffffff
    .head {
      font-size 18px
      width 100%
      height 25px
      background #094849
      color #ffff
      padding 13px 14px
      position fixed
      top 0
      z-index 10
    }
    .title {
      width 100%
      height 190px
      background #094849
      display flex
      color #ececec
      padding-top 63px
      .cover {
        width 150px
        height 150px
        margin-left 15px
        img {
          width 150px
          height 150px
        }
      }
      .brief {
        width 190px
        height 150px
        margin-left 15px
        overflow hidden
        .description {
          font-size 16px
          line-height 20px
          width 160px
          color #ececec
          margin-top 20px
          /*overflow hidden
          text-overflow:ellipsis
          display -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical*/
        }
      }
    }
  }
</style>
