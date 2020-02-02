<template>
  <div class="tab">
    <div class="tab-wrapper">
      <router-link tag="div" class="tab-item" to="/discover">
        <div class="tab-item-wrapper">
          <div class="tab-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-logo-dark"></use>
            </svg>
          </div>
          <div class="tab-link">发现</div>
        </div>
      </router-link>
      <router-link tag="div" class="tab-item" to="/mv">
        <div class="tab-item-wrapper">
          <div class="tab-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shipin1"></use>
            </svg>
          </div>
          <div class="tab-link">视频</div>
        </div>
      </router-link>
      <router-link tag="div" class="tab-item" to="/my">
        <div class="tab-item-wrapper">
          <div class="tab-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yinyue"></use>
            </svg>
          </div>
          <div class="tab-link">我的</div>
        </div>
      </router-link>
      <router-link tag="div" class="tab-item" to="/songList">
        <div class="tab-item-wrapper">
          <div class="tab-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gedan"></use>
            </svg>
          </div>
          <div class="tab-link">歌单</div>
        </div>
      </router-link>
      <router-link tag="div" class="tab-item" to="/college">
        <div class="tab-item-wrapper">
          <div class="tab-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-duoren"></use>
            </svg>
          </div>
          <div class="tab-link">云村</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homeTabs'
}
</script>

<style lang="stylus" scoped>
  @import "~@/assets/stylus/index";
  @import "~@/assets/stylus/variable";
  .tab {
    position fixed
    width 100%
    bottom 0
    z-index 99
    .tab-wrapper {
      display: flex;
      height: 44px;
      line-height: 34px;
      font-size: 18px;
      background-color: #f7f7f7;
      .tab-item {
        flex: 1;
        text-align: center;
        .tab-item-wrapper {
          display: flex
          flex-direction: column
        }
      }
      .tab-link {
        color: @color-text-l;
        font-size 10px
      }
      .tab-icon {
        height 18px
      }
      & .router-link-active{
        .tab-item-wrapper {
          color: red;
        }
      }
    }
  }
</style>
