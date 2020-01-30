import { axios } from '../utils/request'

// 歌曲详情
export function getSongDetail (param) {
  return axios({
    url: 'song/detail',
    method: 'get',
    params: param
  })
}
