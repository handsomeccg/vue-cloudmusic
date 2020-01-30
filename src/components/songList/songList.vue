<template>
  <div class="song-list">
    <h1>歌单广场</h1>
    <recommend-list :recommend-list="recommendList"></recommend-list>
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
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .song-list {
    h1 {
      width 20%
      margin 15px auto
    }
  }
</style>
