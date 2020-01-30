<template>
    <div class="search-hot">
      <h2>热搜榜</h2>
      <div class="hot-list">
        <div class="hot-item" v-for="(item, index) in hotList" :key="index">
          <div class="item-wrapper" :class="`wrapper-${index}`" @click="search(item.searchWord)">
            <div class="item-sequence"><div>{{index + 1}}</div></div>
            <div class="item-content">
              <div class="search-word"><div class="keyword">{{item.searchWord}}</div>
                <template v-if="item.iconType === 2">
                  <div class="tag-new">New</div>
                </template>
                <template v-if="item.iconType === 1">
                  <div class="tag-hot">HOT</div>
                </template>
              </div>
              <div class="search-content"><span>{{item.content}}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'searchHot',
  props: {
    hotList: {
      type: Array
    }
  },
  methods: {
    search (text) {
      this.$emit('hotSearch', text)
    }
  }
}
</script>

<style scoped lang="stylus">
  .search-hot
    padding-bottom 90px
    h2 {
      font-size 18px
      margin-top 40px
      margin-left 4%
    }
  .hot-list {
    margin-top 20px
    display flex
    flex-wrap wrap
    justify-content space-around
    .hot-item{
      width 43%
      height 60px
      .item-wrapper {
        display flex
        .item-sequence {
          width 15%
          display flex
          align-items: center
          color gray
          div {
            width 23px
            height 10px
          }
        }
        .item-content {
          width 85%
          .search-word {
            width 100%
            display flex
            font-size 14px
            opacity 0.9
            line-height 30px
            .keyword {
              max-width 70%
              white-space nowrap
              overflow hidden
              text-overflow:ellipsis
            }
            .tag-new,.tag-hot {
              color #27b950
              font-weight bolder
              font-size 13px
              margin-left 4%
            }
            .tag-hot {
              color red
            }
          }
          .search-content {
            width 100%
            font-size 11px
            color grey
            opacity 0.7
            white-space nowrap
            overflow hidden
            text-overflow:ellipsis
          }
        }
      }
      .wrapper-0,.wrapper-1,.wrapper-2,.wrapper-3 {
        .item-sequence {
          color red
        }
        .item-content {
          .search-word {
            .key-word {
              opacity 1
              font-weight 600
            }
          }
        }
      }
    }
  }
</style>
