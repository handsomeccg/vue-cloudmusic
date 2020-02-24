<template>
  <div class="song-list">
    <h1>歌单广场</h1>
    <recommend-list :recommend-list="recommendList" @selected="selectList" class="list"></recommend-list>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
import RecommendList from '@/components/discover/recommendList'
import { personalized } from '@/api/discover'
export default {
  name: 'songList',
  components: { RecommendList },
  created () {
    this.getPersonalized()
  },
  data () {
    return {
      recommendList: []
    }
  },
  methods: {
    getPersonalized () {
      personalized().then(res => {
        if (res.status === 200) {
          this.recommendList = res.data.result
          console.log(this.recommendList)
        }
      })
    },
    selectList (id) {
      this.$router.push({ path: '/list/detail', query: { id: id } })
    }
  }
}
</script>

<style scoped lang="stylus">
  .song-list {
    position: absolute
    z-index: 10
    top: 0
    left: 0
    right: 0
    background #ffffff
    h1 {
      width 100%
      text-align center
      padding 18px
      background #ffffff
      position fixed
      top 0
      left 0
    }
    .list {
      margin-top 55px
    }
  }
</style>
