<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" @click="toPage(index)" :key="index"></span>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { addClass } from '@/assets/js/dom'
export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted () {
    BScroll.use(Slide)
    this._setSliderWidth()
    this._initDots()
    this._initSlider()

    if (this.autoPlay) {
      this._play()
    }

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  // 清除定时器，利于内存释放
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      this.children.forEach(child => {
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      })
      // 循环轮播
      if (this.loop && !isResize) {
        width += sliderWidth * 2
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        slide: {
          loop: this.loop,
          threshold: 100
        }
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    toPage (index) {
      this.slider.goToPage(index, 0, 0)
    },
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next(400)
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~@/assets/stylus/variable"

  .slider
    min-height: 1px
    position: relative
    .slider-group
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 90%
          margin: 0 auto
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          background: red
</style>
