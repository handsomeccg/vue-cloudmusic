<template>
  <div ref="progressBar" class="progress-bar" @click="progressClick">
    <div ref="progress" class="progress"></div>
    <div
      ref="progressBtn"
      class="progress-btn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd"
    >
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 11
export default {
  name: 'progressBar',
  props: {
    percent: {
      type: Number
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const maxOffsetWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = Math.max(0, Math.min(this.touch.left + deltaX, maxOffsetWidth))
      this.offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this.triggerPercent()
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this.offset(offsetWidth)
      this.triggerPercent()
    },
    triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const newPercent = this.$refs.progress.clientWidth / barWidth
      this.$emit('changePercent', newPercent)
    },
    offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = barWidth * newPercent
        this.offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  .progress-bar {
    position relative
    width 80%
    height 3px
    background-color rgba(236, 236, 236, 0.23)
    margin 0 auto
    .progress {
      width 0
      height 3px
      background-color rgba(255, 255, 255, 0.56)
    }
    .progress-btn {
      width 11px
      height 11px
      background-color rgba(255, 255, 255, 0.8)
      border-radius 50%
      position absolute
      top -4px
      left -1px
    }
  }
</style>
