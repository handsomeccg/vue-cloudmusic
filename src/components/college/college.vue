<template>
  <div class="college">
    <div class="title">
      <h2>云村热评墙</h2>
      <span>你好呀，来看看这些精彩评论</span>
    </div>
    <div class="hot-item" v-for="(item, index) in hotComments" :key="index" :style="backgrounds[index % 4]">
      <div class="author">
        <div class="avatar" :style="`background-image: url('${item.simpleUserInfo.avatar}')`">
        </div>
        <div class="author-name">{{item.simpleUserInfo.nickname}}</div>
      </div>
      <span class="content">{{item.content}}</span>
      <span class="song">{{item.simpleResourceInfo.name + '-' + item.simpleResourceInfo.artists[0].name}}</span>
    </div>
  </div>
</template>

<script>
import { getHotComments } from '@/api/college'

export default {
  name: 'college',
  created () {
    this.getHotComments()
  },
  data () {
    return {
      hotComments: [],
      backgrounds: [
        'background: #df99a6',
        'background: #636fa4',
        'background: linear-gradient(to right, #093028, #237a57)',
        'background: #c5796d'
      ]
    }
  },
  methods: {
    getHotComments () {
      getHotComments().then(res => {
        this.hotComments = res.data.data
        console.log(res.data.data)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .college {
    padding-bottom 50px
    .title {
      width: 85%
      margin 10px auto
      margin-bottom 50px
      padding 15px
      color #df99a6
      color white
      background: #44A08D;  /* fallback for old browsers */
      background: linear-gradient(to right, #094849, #44A08D);
      opacity 0.7
      border-radius 10px
      h2 {
        margin-bottom 10px
      }
      span {
        font-size 13px
      }
    }
    .hot-item {
      border-radius 15px
      width: 85%
      margin 30px auto
      padding 15px
      color #ececec
      opacity 0.9
      .author {
        display flex
        .avatar {
          width 30px
          height 30px
          background-size 30px 30px
          border-radius 50%
        }
        .author-name {
          margin-left 8px
          display flex
          align-items center
        }
      }
      .content {
        display block
        margin-top 30px
        letter-spacing 1px
        line-height 23px
      }
      .song {
        display block
        margin-top 15px
        opacity 0.7
        font-size 13px
        letter-spacing 1px
      }
    }
  }
</style>
