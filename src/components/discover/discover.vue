<template>
  <div>
    <div class="search">
      <van-search
        v-model="searchText"
        shape="round"
        :placeholder="defaultText"
        :show-action="shadow"
        @focus="showShadow"
        @cancel="hiddenShadow"
        @input="showSuggests"
        @search="showResult"
        class="search-wrapper"
      />
    </div>
    <div class="shadow" v-show="shadow">
      <!--<scroll ref="scrollHot" class="recommend-content" :data="hotList">-->
        <search-hot ref="hot" :hot-list="hotList" v-show="!searchSuggests.length && !songResult" @hotSearch="showResult"></search-hot>
        <div v-show="searchSuggests.length">
          <div class="search-suggest" v-if="searching">
            <div class="search-suggest-item" v-for="(item, index) in searchSuggests" :key="index">
              <div @click="showResult(item)"><van-icon name="search" color="#A9A9A9" /><span>{{item}}</span></div>
              <van-divider />
            </div>
          </div>
        </div>
        <transition name="slide">
          <songs-result :songs="resultSongs" v-if="songResult"></songs-result>
        </transition>
      <!--</scroll>-->
    </div>
    <div class="recommend" v-show="!shadow">
      <!--<scroll ref="scroll" class="recommend-content" :data="recommendList">-->
        <div>
          <div v-if="banners.length" class="slider-wrapper" ref="sliderWrapper">
            <slider>
              <div v-for="(item, index) in banners" :key="index">
                <a @click="bannerClick">
                  <img @load="loadImage" :src="item.imageUrl">
                </a>
              </div>
            </slider>
          </div>
          <recommend-list :recommend-list="recommendList"></recommend-list>
        </div>
      <!--</scroll>-->
    </div>
  </div>
</template>

<script>
import Slider from '@/base/slider/slider'
import RecommendList from '@/components/discover/recommendList'
import SearchHot from '@/components/search/searchHot'
import songsResult from '@/components/search/songsResult'
/* import Scroll from '@/base/scroll/scroll' */
import { banner, personalized } from '@/api/discover'
import { getSearchDefault, searchHot, searchSuggest, getSearchResult } from '@/api/search'

export default {
  name: 'recommend',
  components: { Slider, RecommendList, /* Scroll, */ SearchHot, songsResult },
  data () {
    return {
      searchText: '',
      banners: [],
      recommendList: [],
      shadow: false,
      defaultText: '',
      hotList: [],
      searchSuggests: [],
      searching: true,
      resultSongs: [],
      songResult: false
    }
  },
  created () {
    this.getSearchDefault()
    this.getSearchHot()
    this.getBanner()
    this.getPersonalized()
  },
  methods: {
    // 获取搜索关键词
    getSearchDefault () {
      getSearchDefault().then(res => {
        this.defaultText = res.data.data.realkeyword
      })
    },
    // 热搜榜
    getSearchHot () {
      searchHot().then(res => {
        console.log(res.data)
        this.hotList = res.data.data
      })
    },
    getBanner () {
      banner().then(res => {
        if (res.status === 200) {
          this.banners = res.data.banners
        }
      })
    },
    getPersonalized () {
      personalized().then(res => {
        if (res.status === 200) {
          this.recommendList = res.data.result
        }
      })
    },
    bannerClick () {
      console.log('banner click!')
    },
    loadImage () {
      if (!this.checked) {
        this.$refs.scroll.refresh()
        this.checked = true
      }
    },
    showShadow (e) {
      this.shadow = true
      this.searching = true
      this.songResult = false
      setTimeout(() => {
        this.$refs.scrollHot.refresh()
      }, 20)
    },
    hiddenShadow (e) {
      this.shadow = false
    },
    showSuggests () {
      if (!this.searchText) {
        this.searchSuggests = []
        return
      }
      const params = {
        keywords: this.searchText,
        type: 'mobile'
      }
      searchSuggest(params).then(res => {
        const result = res.data.result.allMatch
        if (result) {
          this.searchSuggests = result.map(item => item.keyword)
        } else {
          this.searchSuggests = []
        }
      })
    },
    showResult (text) {
      if (text) {
        this.searchText = text
      }
      this.searching = false
      this.songResult = true
      console.log(123)
      const params = {
        keywords: this.searchText
      }
      getSearchResult(params).then(res => {
        console.log(res)
        this.resultSongs = res.data.result.songs
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~@/assets/stylus/variable"
  .search {
    width 100%
    padding 0 5%
    padding-top 5px
    box-sizing border-box
    position fixed
    background-color #ffff
    z-index 10
  }
  .search-suggest {
    padding-left 20px
    .search-suggest-item span{
      margin-left 12px
    }
  }
  .recommend,.shadow {
    position: relative
    width: 100%
    top: 60px
    overflow-x hidden
    .recommend-content {
    }
  }
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
