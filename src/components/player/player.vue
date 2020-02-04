<template>
  <div class="player" v-if="playlist.length > 0">
    <transition name="normalPlayer">
      <div class="normal-player" v-show="fullScreen">
      <div class="head">
        <svg class="icon" aria-hidden="true" @click="back">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        <div class="song-info">
          <span class="song-name">{{currentSong.name}}</span><br/>
          <span class="song-artist">{{currentSong.artist}}</span>
        </div>
      </div>
      <div class="middle">
        <div v-show="!showLyric" class="song-cover" :class="`song-cover-${coverClass}`" :style="`background-image: url('${currentSong.picUrl}')`"></div>
        <scroll v-show="showLyric" class="lyric" ref="lyric" :data="lyricList">
          <div class="lyric-wrapper" @touchstart.prevent="lyricTouchStart" @touchmove.prevent="lyricTouchMove" @touchend.prevent="lyricTouchEnd">
            <p
              v-for="(item, index) in lyricList"
              :key="index"
              ref="lyricText"
              class="lyric-text"
              :class="{'lyric-active': index === currentLyricIndex}"
            >
              {{item.text}}</p>
          </div>
        </scroll>
        <div class="move-play" v-show="this.touch.initiated">
          <svg class="icon play" aria-hidden="true" @click="getLyricPosition">
            <use xlink:href="#icon-bofang1"></use>
          </svg>
          <div class="divide" ref="divide"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <div class="currentTime time">{{timeFormat(this.currentTime)}}</div>
          <progress-bar class="progress" :percent="progressPercent" @changePercent="changePercent"></progress-bar>
          <div class="totalTime time">{{timeFormat(this.currentSong.songTime)}}</div>
        </div>
        <div class="actions">
          <svg class="icon mode" aria-hidden="true" @click="changeMode">
            <use :xlink:href="modeIcon[mode]"></use>
          </svg>
          <svg class="icon last-song" aria-hidden="true" @click="prevSong">
            <use xlink:href="#icon-shangyishou3"></use>
          </svg>
          <div class="play-stop" @click="togglePlay">
            <svg class="icon stop" aria-hidden="true" v-if="playing">
              <use xlink:href="#icon-zantingtingzhi"></use>
            </svg>
            <svg class="icon play" aria-hidden="true" v-else>
              <use xlink:href="#icon-bofang1"></use>
            </svg>
          </div>
          <svg class="icon next-song" aria-hidden="true" @click="nextSong">
            <use xlink:href="#icon-shangyishou1"></use>
          </svg>
          <svg class="icon playlist" aria-hidden="true" @click="back">
            <use xlink:href="#icon-bofangliebiao"></use>
          </svg>
        </div>
      </div>
    </div>
    </transition>
    <progress-circle :radius="33" :percent="progressPercent" class="mini-player-wrapper">
      <div
        class="mini-player"
        :class="`mini-cover-${coverClass}`"
        :style="`background-image: url('${currentSong.picUrl}')`"
        @click="setFullScreen(true)"
      >
      </div>
    </progress-circle>
    <audio ref="audio" :src="currentSong.mp3Url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import progressBar from '@/base/progressBar/progressBar'
import progressCircle from '@/base/progressCircle/progressCircle'
import { Toast } from 'vant'
import { playMode } from '@/assets/js/config'
import { shuffle } from '@/assets/js/util'
import { getLyric } from '@/api/song'
import { lyricFormat } from '@/assets/js/lyricFormat'
import scroll from '@/base/scroll/scroll'

export default {
  name: 'player',
  created () {
    this.touch = {}
    // console.log(this.playlist)
  },
  components: { progressBar, progressCircle, scroll },
  computed: {
    coverClass () {
      return this.playing ? 'play' : 'stop'
    },
    progressPercent () {
      return this.currentTime / this.currentSong.songTime
    },
    ...mapGetters([
      'currentIndex',
      'fullScreen',
      'playing',
      'playlist',
      'currentSong',
      'mode',
      'sequenceList'
    ])
  },
  data () {
    return {
      songReady: false,
      currentTime: 0,
      modeIcon: [
        '#icon-liebiaoxunhuan',
        '#icon-danquxunhuan',
        '#icon-ttpodicon'
      ],
      modeStr: [
        '列表循环',
        '单曲循环',
        '随机播放'
      ],
      lyricList: [],
      showLyric: true,
      currentLyricIndex: 0,
      playLyric: 0
    }
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    updateTime (e) {
      const currentTime = e.target.currentTime
      this.currentTime = currentTime
      // 滑动歌词的时候不做自动滚动
      if (!this.touch.initiated) {
        this.updateCurrentLyric(currentTime)
      }
    },
    updateCurrentLyric (currentTime) {
      // 实时记录歌词位置
      for (let i = 0; i < this.lyricList.length; i++) {
        // 歌曲刚开始
        if (currentTime < this.lyricList[0].time) {
          break
        }
        // 预防到最后一句歌词数组越界
        if (i === this.lyricList.length - 1) {
          this.currentLyricIndex = i
          break
        }
        if (currentTime >= this.lyricList[i].time && currentTime < this.lyricList[i + 1].time) {
          this.currentLyricIndex = i
          break
        }
      }
      // 实时滚动歌词
      this.scrollLyric()
    },
    scrollLyric () {
      // 滚动歌词
      const el = this.$refs.lyricText
      this.$refs.lyric.scrollToElement(el[this.currentLyricIndex], 1000, false, -160)
    },
    // 获取手动播放歌词位置 并跳转播放
    getLyricPosition () {
      const playPosition = this.$refs.divide.getBoundingClientRect().top
      const el = this.$refs.lyricText
      // 获取点击的歌词位置
      for (let i = 0; i < el.length; i++) {
        if (i === el.length - 1) {
          this.playLyric = i
          break
        } else if (el[i].getBoundingClientRect().top <= playPosition && el[i + 1].getBoundingClientRect().top >= playPosition) {
          this.playLyric = i
          break
        }
      }
      console.log(this.playLyric)
      // 跳转到对应歌词
      this.currentLyricIndex = this.playLyric
      this.scrollLyric()
      // 跳转到对应播放位置
      const newTime = this.lyricList[this.playLyric].time
      this.$refs.audio.currentTime = newTime
      // 页面更新为正在播放
      this.$refs.audio.play()
      this.setPlayState(true)
    },
    changePercent (newPercent) {
      this.$refs.audio.currentTime = this.currentSong.songTime * newPercent
    },
    togglePlay () {
      this.setPlayState(!this.playing)
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      Toast(this.modeStr[mode])
      let list = this.sequenceList
      if (mode === playMode.random) {
        list = shuffle(list)
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    // 切换随机播放后设置当前播放歌曲为现在播放的歌曲
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    timeFormat (time) {
      const minute = time / 60 | 0
      let second = time % 60 | 0
      second = second < 10 ? '0' + second : second
      return '0' + minute + ':' + second
    },
    // 歌曲放完
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.nextSong()
      }
    },
    // 单曲循环
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayState(true)
      /* if (this.currentLyric) {
        this.currentLyric.seek(0)
      } */
    },
    // 切换上一首
    prevSong () {
      // 歌曲还未加载完成不进行操作
      if (!this.songReady) {
        return
      }
      if (this.mode === playMode.loop) {
        this.loop()
        return
      }
      // 如果url不存在,则再到下一首
      let index = this.currentIndex
      do {
        index = index - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
      } while (this.playlist[index].mp3Url === null)
      this.setCurrentIndex(index)
      // 歌曲加载状态重新置为false
      this.songReady = false
    },
    nextSong () {
      // 歌曲还未加载完成不进行操作
      if (!this.songReady) {
        return
      }
      if (this.mode === playMode.loop) {
        this.loop()
        return
      }
      // 如果url不存在,则再到下一首
      let index = this.currentIndex
      do {
        index = index + 1
        if (index === this.playlist.length) {
          index = 0
        }
      } while (this.playlist[index].mp3Url === null)
      this.setCurrentIndex(index)
      // 歌曲加载状态重新置为false
      this.songReady = false
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    lyricTouchStart () {
      this.touch.initiated = true
      clearTimeout(this.timeout)
      console.log(123)
    },
    lyricTouchMove () {
      if (!this.touch.initiated) {
      }
    },
    lyricTouchEnd () {
      this.timeout = null
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.touch.initiated = false
      }, 2000)
      console.log(456)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaylist: 'SET_PLAYLIST',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      setTimeout(() => {
        // 页面更新为正在播放
        this.$refs.audio.play()
        this.setPlayState(true)
        // 获取歌词
        getLyric({ id: newSong.id }).then(res => {
          let lyric = res.data.lrc.lyric
          // console.log(lyric)
          const lyricList = lyricFormat(lyric)
          this.lyricList = lyricList
          console.log(lyricList)
          // 歌词复位
          this.currentLyricIndex = 0
          this.$refs.lyric.scrollTo(0, 0, 1000)
        })
      })
    },
    playing (newPlaying) {
      const audio = this.$refs.audio
      setTimeout(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .player {
    .normal-player {
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: #44A08D
      &.normalPlayer-enter-active, &.normalPlayer-leave-active {
        transition: all 0.4s
      }
      &.normalPlayer-enter, &.normalPlayer-leave-to {
        transform: translate3d(100%, 0, 0)
      }
      .head {
        padding 10px
        display flex
        color #f5f5f5
        background-color #3983b9
        .icon {
          font-size 20px
          margin-top 7px
        }
        .song-info {
          margin-left 25px
          width 80%
          text-align center
          overflow hidden
          white-space nowrap
          text-overflow:ellipsis
          .song-name {
            font-size 17px
          }
          .song-artist {
            line-height 15px
            font-size 12px
          }
        }
      }
      .middle {
        width 100%
        height 400px
        margin-top 70px
        .song-cover-play {
          animation rotate 25s linear infinite
        }
        .song-cover-stop {
          animation rotate 25s linear infinite
          animation-play-state: paused
        }
        .song-cover {
          background-size 300px 300px
          width 300px
          height 300px
          border-radius 50%
          margin 0 auto
        }
        .move-play {
          width 100%
          height 30px
          position fixed
          top 300px
          left 10px
          display flex
          .divide {
            width 80%
            height 1px
            background-color rgba(226, 226, 226, 0.64)
            margin-top 7px
          }
        }
        .lyric {
          width 80%
          margin 0 auto
          box-sizing border-box
          text-align center
          font-size 14px
          line-height 40px
          height 100%
          overflow hidden
          .lyric-wrapper {
            padding-top 162px
          }
          .lyric-active {
            color white
          }
        }
      }
      .bottom {
        margin-top 20px
        .progress-wrapper {
          display flex
          padding 0 12px
          .time {
            font-size 10px
            color rgba(236, 236, 236, 0.6)
            margin-top -3px
          }
        }
        .actions {
          margin-top 0px
          display flex
          justify-content space-around
          .icon {
            margin-top 15px
            font-size 20px
          }
          .play-stop {
            width 50px
            height 50px
            border-radius 50%
            border 1px solid
            .icon {
              margin-left 17px
            }
            .stop {
              margin-left 15px
            }
          }
        }
      }
    }
    .mini-player-wrapper {
      position fixed
      top 10px
      right 10px
      z-index 110
      .mini-cover-play {
        animation rotate 25s linear infinite
      }
      .mini-cover-stop {
        animation rotate 25s linear infinite
        animation-play-state: paused
      }
      .mini-player {
        background-size 30px 30px
        border-radius 50%
        width 25px
        height 25px
        position absolute
        top 4px
        left 4px
      }
    }
  }
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
