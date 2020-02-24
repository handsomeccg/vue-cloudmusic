<template>
  <transition name="songList">
    <div class="list-detail">
      <div class="head">
        <svg class="icon" aria-hidden="true" @click="back">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        <span style="margin-left: 38%">歌单</span>
      </div>
      <div class="title">
        <div class="cover">
          <img :src="songs.coverImgUrl">
        </div>
        <div class="brief">
          <div class="name">{{songs.name}}</div>
          <div class="author" v-if="songs.creator">
            <div class="author-avatar" :style="`background-image: url('${songs.creator.avatarUrl}')`"></div>
            <div class="author-name">{{songs.creator.nickname}}</div>
          </div>
          <div class="description">{{songs.description}}</div>
        </div>
      </div>
      <!--为了滑动不突兀-->
      <div class="middle"></div>
      <div class="list-head" @click="playAll">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-bofang"></use>
        </svg>
        <span>播放全部</span>
      </div>
      <div class="song-list-view">
        <div class="song-item" v-for="(item, index) in songs.tracks || []" :key="index" @click="selectItem(item, index)">
          <div class="song-sequence">{{index+ 1 }}</div>
          <div class="song-content">
            <div class="song-name">{{item.name}}</div>
            <div class="artist">{{item.ar.map(item => item.name).join('/') + '-' + item.al.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { getSongListDetail } from '@/api/songList'
import { getSongDetail, getSongUrl } from '@/api/song'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'songListDetail',
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
      await getSongListDetail({ id: this.$route.query.id }).then(res => {
        this.songs = res.data.playlist
        this.songIds = res.data.playlist.trackIds.map(item => item.id)
        this.playList = res.data.playlist.tracks.map(item => ({ songTime: item.dt / 1000 }))
        this.playList.map((item, index) => {
          item.id = this.songIds[index]
        })
        // console.log(this.songs)
      })
      // 获取歌曲图片url
      getSongDetail({ ids: this.songIds.join(',') }).then(res => {
        // console.log(res.data)
        res.data.songs.forEach((item, index) => {
          // this.playList[index] = this.playList[index] || {}
          this.playList[index].picUrl = item.al.picUrl
          this.playList[index].name = item.name
          this.playList[index].artist = item.ar.map(item => item.name).join('/')
        })
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
       .name {
         letter-spacing 1px
         line-height 20px
       }
       .author {
         margin-top 15px
         display flex
         .author-avatar {
           width 30px
           height 30px
           background-size 30px 30px
           border-radius 50%
         }
         .author-name {
           font-size 14px
           margin-left 5px
           margin-top 8px
           opacity 0.8
           width 150px
           overflow hidden
           white-space nowrap
           text-overflow:ellipsis
         }
       }
       .description {
         font-size 12px
         line-height 15px
         width 160px
         color #ececec
         margin-top 30px
         overflow hidden
         text-overflow:ellipsis
         display -webkit-box
         -webkit-line-clamp: 2
         -webkit-box-orient: vertical
       }
     }
   }
   .middle {
     width 100%
     height 20px
     background #094849
     position sticky
     top 51px
   }
   .list-head {
     box-sizing border-box
     margin-top -20px
     margin-bottom 10px
     width 100%
     height 40px
     padding 15px 10px
     background-color white
     border-radius 20px 20px 0 0
     z-index 5
     position sticky
     top 51px
   }
   .song-list-view {
     .song-item {
       display flex
       padding 0 15px
       margin-bottom 15px
       .song-sequence {
         display flex
         align-items center
         font-size 18px
         color #A9A9A9
       }
       .song-content {
         margin-left 15px
         .song-name {
           font-size 18px
           letter-spacing 1px
           width 280px
           overflow hidden
           white-space nowrap
           text-overflow:ellipsis
         }
         .artist {
           font-size 13px
           color #A9A9A9
           line-height 23px
           width 280px
           overflow hidden
           white-space nowrap
           text-overflow:ellipsis
         }
       }
     }
   }
 }
</style>
