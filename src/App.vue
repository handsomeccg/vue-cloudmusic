<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <home-tabs></home-tabs>
    <player></player>
  </div>
</template>

<script>
import HomeTabs from '@/base/tab/homeTabs'
import { getSearchResult } from '@/api/search'
import player from '@/components/player/player'
import { remoteLoad } from '@/assets/js/remoteLoad'
export default {
  components: { HomeTabs, player },
  created () {
    remoteLoad('http://at.alicdn.com/t/font_1622152_lt7lo6jgvb.js')
  },
  data () {
    return {
      keywords: ''
    }
  },
  methods: {
    search () {
      getSearchResult({ keywords: this.keywords }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="stylus">
  @import "assets/stylus/index.styl"
</style>
