import { axios } from '../utils/request'

// 歌单详情
export function getSongListDetail (param) {
  return axios({
    url: 'api/playlist/detail',
    method: 'get',
    params: param
  })
}
