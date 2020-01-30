<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <home-tabs></home-tabs>
  </div>
</template>

<script>
import HomeTabs from '@/base/tab/homeTabs'
import { getSearchResult } from '@/api/search'

export default {
  components: { HomeTabs },
  created () {
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
