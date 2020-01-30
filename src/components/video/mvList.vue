<template>
  <list :mv-list="mvList">
    <template slot="cover" slot-scope="text">
      <div v-if="text.index === videoNum">
        <video controls="" playsinline webkit-playsinline :src="videoUrl"></video>
      </div>
      <div v-else>
        <img :src="text.record.cover" @click="play(text)"/>
      </div>
    </template>
  </list>
</template>

<script>
import { getMvList, getMv } from '@/api/mv'
import list from '@/components/video/list'
export default {
  name: 'mvList',
  components: { list },
  created () {
    this.getData()
  },
  data () {
    return {
      mvList: [],
      // 当前播放的视频序号
      videoNum: null,
      videoUrl: ''
    }
  },
  methods: {
    getData () {
      getMvList().then(res => {
        console.log(res.data)
        this.mvList = res.data.data
      })
    },
    play (text) {
      this.videoNum = text.index
      getMv({ mvid: text.record.id }).then(res => {
        this.videoUrl = res.data.data.brs[480]
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  img {
    width 100%
    height 200px
    border-radius 10px
  }
  video {
    width 100%
    height 200px
    border-radius 15px
  }
</style>
