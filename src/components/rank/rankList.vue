<template>
  <div class="rank">
    <div class="head">
      <h1>排行榜</h1>
    </div>
    <div class="rank-item-wrapper">
      <div class="rank-item" v-for="(item, index) in data" :key="index" @click="selectList(item, index)">
        <div class="cover">
          <img :src="item.coverImgUrl">
          <div class="update-message">{{item.updateFrequency}}</div>
        </div>
        <div class="song-message">
          <div class="song-message-wrapper">
            <div class="song-message-item" v-for="(songItem, index) in item.tracks" :key="index">{{ (index + 1) + '.' + songItem.first + '-' + songItem.second }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRankList } from '@/api/rank'

export default {
  name: 'rank',
  data () {
    return {
      data: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getRankList().then(res => {
        console.log(res.data)
        this.data = res.data.list.splice(0, 4)
      })
    },
    getRankId (name) {
      switch (name) {
        case '云音乐新歌榜': return 0
        case '云音乐热歌榜': return 1
        case '网易原创歌曲榜': return 2
        case '云音乐飙升榜': return 3
      }
    },
    selectList (item) {
      const id = this.getRankId(item.name)
      this.$router.push({ path: '/rank/detail', query: { id: id } })
    }
  }
}
</script>

<style scoped lang="stylus">
  .rank {
    position: absolute
    z-index: 10
    top: 0
    left: 0
    right: 0
    background #ffffff
    .head {
      z-index: 10
      width 100%
      text-align center
      padding 18px
      background #ffffff
      position fixed
      top 0
      left 0
    }
    .rank-item-wrapper {
      margin-top 80px
      .rank-item {
        display flex
        padding 5px 15px
        .cover {
          width 120px
          height 120px
          position relative
          img {
            width 120px
            height 120px
            border-radius 10px
          }
          .update-message {
            position absolute
            bottom 5px
            left 5px
            font-size 11px
            color white
          }
        }
        .song-message {
          padding-left 12px
          display flex
          align-items center
          .song-message-item {
            line-height 30px
            font-size 14px
            color #5a5a5a
            width 200px
            overflow hidden
            white-space nowrap
            text-overflow:ellipsis
          }
        }
      }
    }
  }
</style>
