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
          <songs-result :songs="resultSongs" v-if="songResult" @selectItem="selectSearchItem"></songs-result>
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
                  <img :src="item.imageUrl">
                </a>
              </div>
            </slider>
          </div>
          <recommend-list :recommend-list="recommendList" @selected="selectList"></recommend-list>
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
import { mapActions } from 'vuex'
import { getSongDetail, getSongUrl } from '@/api/song'
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
    showShadow (e) {
      this.shadow = true
      this.searching = true
      this.songResult = false
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
    },
    selectList (id) {
      this.$router.push({ path: '/list/detail', query: { id: id } })
    },
    async selectSearchItem (songIds, index) {
      const playList = songIds.map(item => ({ id: item }))
      const ids = songIds.join(',')
      console.log(playList)
      // 获取歌曲图片url
      await getSongDetail({ ids: ids }).then(res => {
        console.log(res.data)
        res.data.songs.forEach((item, index) => {
          playList[index].picUrl = item.al.picUrl
          playList[index].name = item.name
          playList[index].artist = item.ar.map(item => item.name).join('/')
          playList[index].songTime = item.dt / 1000
        })
      })
      // 获取歌曲url
      await getSongUrl({ id: ids }).then(res => {
        // console.log(res.data)
        res.data.data.forEach((item, index) => {
          const urlIndex = songIds.indexOf(item.id)
          console.log(urlIndex)
          // this.playList[urlIndex] = this.playList[urlIndex] || {}
          playList[urlIndex].mp3Url = item.url
        })
      })
      console.log(playList)
      this.selectPlay({
        list: playList,
        index: index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  }
}
</script>

<style scoped lang="stylus">
  @import "~@/assets/stylus/variable"
  .search {
    width 100%
    padding 0 5%
    padding-right 10%
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
    top: 65px
    overflow-x hidden
    .recommend-content {
    }
  }
  .slide-enter-active, .slide-leave-active
    transition: all 0.4s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
