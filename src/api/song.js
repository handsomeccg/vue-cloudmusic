import { axios } from '../utils/request'

// 歌曲详情
export function getSongDetail (param) {
  return axios({
    url: 'api/song/detail',
    method: 'get',
    params: param
  })
}

// 获取歌曲url
export function getSongUrl (param) {
  return axios({
    url: 'api/song/url',
    method: 'get',
    params: param
  })
}

// 获取相似音乐
export function getSimiSong (param) {
  return axios({
    url: 'api/simi/song',
    method: 'get',
    params: param
  })
}

// 获取歌词
export function getLyric (param) {
  return axios({
    url: 'api/lyric',
    method: 'get',
    params: param
  })
}
