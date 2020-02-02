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
        <div class="song-cover" :class="`song-cover-${coverClass}`" :style="`background-image: url('${currentSong.picUrl}')`"></div>
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

export default {
  name: 'player',
  created () {
    console.log(this.playlist)
  },
  components: { progressBar, progressCircle },
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
      ]
    }
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
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
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayState(true)
      /* if (this.currentLyric) {
        this.currentLyric.seek(0)
      } */
    },
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
        this.$refs.audio.play()
        // 页面更新为正在播放
        this.setPlayState(true)
        // 获取歌词
        getLyric({ id: newSong.id }).then(res => {
          let lyric = res.data.lrc.lyric
          // console.log(lyric)
          const lyricList = lyricFormat(lyric)
          console.log(lyricList)
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
          margin 70px auto
        }
      }
      .bottom {
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
          margin-top 30px
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
