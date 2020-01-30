<template>
    <div class="recommend-list">
      <div class="recommend-item" v-for="(item, index) in recommendList" :key="index">
        <img v-lazy="item.picUrl" class="recommend-img"/>
        <div class="recommend-text">{{item.name}}</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'recommendList',
  props: {
    recommendList: {
      type: Array
    }
  }
}
</script>

<style scoped lang="stylus">
.recommend-list {
  margin-top 20px
  padding 0 10px
  display flex
  flex-wrap wrap
  justify-content space-between
  padding-bottom 50px
  .recommend-item {
    width 110px
    height 160px
    img {
      width 110px
      height 110px
    }
    .recommend-text {
      font-size 14px
      overflow hidden
      text-overflow:ellipsis
      display -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
    }
  }
}
</style>
