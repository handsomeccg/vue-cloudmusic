<template>
  <div class="list-detail">
    <div class="head">
      <svg class="icon" aria-hidden="true">
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
        <div class="author">
          <div class="author-avatar" :style="`background-image: url('${songs.creator.avatarUrl}')`"></div>
          <div class="author-name">{{songs.creator.nickname}}</div>
        </div>
        <div class="description">{{songs.description}}</div>
      </div>
    </div>
    <!--为了滑动不突兀-->
    <div class="middle"></div>
    <div class="list-head">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-bofang"></use>
      </svg>
      <span>播放全部</span>
    </div>
    <div class="song-list-view">
      <div class="song-item" v-for="(item, index) in songs.tracks || []" :key="index">
        <div class="song-sequence">{{index+ 1 }}</div>
        <div class="song-content">
          <div class="song-name">{{item.name}}</div>
          <div class="artist">{{item.ar.map(item => item.name).join('/') + '-' + item.al.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSongListDetail } from '@/api/songList'

export default {
  name: 'songListDetail',
  created () {
    this.songs = {}
    this.getListDetail()
  },
  data () {
    return {
      songs: {}
    }
  },
  methods: {
    getListDetail () {
      console.log(123)
      getSongListDetail({ id: this.$route.query.id }).then(res => {
        this.songs = res.data.playlist
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.query.id) {
        this.getListDetail()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
 .list-detail {
   .head {
     font-size 18px
     width 100%
     height 20px
     background #094849
     color #ffff
     padding 13px 14px
     position fixed
     top 0
     z-index 10
   }
   .title {
     margin-top 42px
     width 100%
     height 190px
     background #094849
     display flex
     color #ececec
     padding-top 16px
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
       }
       .author {
         margin-top 10px
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
         }
       }
       .description {
         font-size 12px
         margin-top 60px
       }
     }
   }
   .middle {
     width 100%
     height 20px
     background #094849
     position sticky
     top 46px
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
     top 46px
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
         }
         .artist {
           font-size 13px
           color #A9A9A9
           line-height 23px
         }
       }
     }
   }
 }
</style>
