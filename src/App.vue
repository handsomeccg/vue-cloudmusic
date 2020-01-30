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
    window.οnlοad = function () {
      document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
          event.preventDefault() // 阻止元素的默认行为
        }
      })
      var lastTouchEnd = 0
      document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime()
        if (now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now // 当前为最后一次触摸
      }, false)
    }
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
