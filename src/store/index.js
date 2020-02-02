import Vue from 'vue'
import Vuex from 'vuex'
import * as types from '@/store/mutationTypes'
import { playMode } from '@/assets/js/config'
import { shuffle } from '@/assets/js/util'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1
  },
  getters: {
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    playlist: state => state.playlist,
    sequenceList: state => state.sequenceList,
    mode: state => state.mode,
    currentIndex: state => state.currentIndex,
    currentSong: (state) => {
      return state.playlist[state.currentIndex] || {}
    }
  },
  mutations: {
    [types.SET_PLAYING_STATE] (state, flag) {
      state.playing = flag
    },
    [types.SET_FULL_SCREEN] (state, flag) {
      state.fullScreen = flag
    },
    [types.SET_PLAYLIST] (state, list) {
      state.playlist = [...list]
    },
    [types.SET_SEQUENCE_LIST] (state, list) {
      state.sequenceList = list
    },
    [types.SET_PLAY_MODE] (state, mode) {
      state.mode = mode
    },
    [types.SET_CURRENT_INDEX] (state, index) {
      state.currentIndex = index
    }
  },
  actions: {
    selectPlay ({ commit, state }, { list, index }) {
      commit(types.SET_SEQUENCE_LIST, list)
      if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = randomList.findIndex((item) => { return item.id === list[index].id })
      } else {
        commit(types.SET_PLAYLIST, list) // 播放模式改变
      }
      commit(types.SET_CURRENT_INDEX, index)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING_STATE, true)
    }
  },
  modules: {
  }
})
