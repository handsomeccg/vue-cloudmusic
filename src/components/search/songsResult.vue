<template>
  <div class="search-result">
    <h2>单曲</h2>
    <van-divider />
    <div v-for="(item, index) in songs" :key="index">
      <div class="song-name">{{item.name}}</div>
      <div class="artist">{{item.artists.map(item => item.name).join('、') + '-' + item.album.name}}</div>
      <van-divider style="margin: 10px 0"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'songsResult',
  props: {
    songs: {
      type: Array
    }
  }
}
</script>

<style scoped lang="stylus">
  .search-result {
    padding: 0 15px
    .song-name {
      color #3983b9
      margin-bottom 10px
    }
    .artist {
      font-size 12px
      color #A9A9A9
    }
  }
</style>
