import { axios } from '../utils/request'

// 歌曲详情
export function getSongDetail (param) {
  return axios({
    url: 'song/detail',
    method: 'get',
    params: param
  })
}

// 获取相似音乐
export function getSongUrl (param) {
  return axios({
    url: 'song/url',
    method: 'get',
    params: param
  })
}

// 获取相似音乐
export function getNextSong (param) {
  return axios({
    url: 'simi/song',
    method: 'get',
    params: param
  })
}

// 获取歌词
export function getLyric (param) {
  return axios({
    url: 'lyric',
    method: 'get',
    params: param
  })
}
