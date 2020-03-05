<template>
  <div class="list-view">
    <!--为了滑动不突兀-->
    <div class="middle"></div>
    <div class="list-head" @click="playAll">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-bofang"></use>
      </svg>
      <span>播放全部</span>
    </div>
    <van-loading size="24px" vertical v-if="!songList.tracks">加载中...</van-loading>
    <div class="song-list-view">
      <div class="song-item" v-for="(item, index) in songList.tracks || []" :key="index" @click="selectItem(item, index)">
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
export default {
  name: 'listView',
  props: {
    songs: {
      type: Object
    }
  },
  data () {
    return {
      songList: this.songs
    }
  },
  mounted () {
    console.log(788)
    this.songList = {}
  },
  watch: {
    songs (newVal, oldVal) {
      this.songList = newVal
    }
  },
  methods: {
    playAll () {
      this.$emit('playAll')
    },
    selectItem (item, index) {
      this.$emit('selectItem', item, index)
    }
  }
}
</script>

<style scoped lang="stylus">
  .list-view {
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
