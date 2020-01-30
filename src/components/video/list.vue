<template>
  <div class="mv-list">
    <div class="mv-item" v-for="(item, index) in mvList" :key="index">
      <slot name="cover" :record="item" :index="index">
        <img :src="item.cover"/>
      </slot>
      <div class="desc">{{item.briefDesc || item.name }}</div>
      <van-divider />

    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  props: {
    mvList: {
      type: Array
    }
  }
}
</script>

<style scoped lang="stylus">
  .mv-list {
    margin-top 15px
    width 100%
    .mv-item {
      width 90%
      margin 0 auto
      .desc {
        line-height 30px
      }
    }
  }
</style>
