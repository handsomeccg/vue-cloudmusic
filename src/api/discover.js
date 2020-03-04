import { axios } from '../utils/request'

// 轮播图
export function banner (param) {
  return axios({
    url: 'api/banner',
    method: 'get',
    params: param
  })
}

// 推荐歌单
export function personalized (param) {
  return axios({
    url: 'api/personalized',
    method: 'get',
    params: param
  })
}
