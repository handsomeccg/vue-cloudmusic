import { axios } from '../utils/request'

// 轮播图
export function banner (param) {
  return axios({
    url: 'banner',
    method: 'get',
    params: param
  })
}

// 推荐歌单
export function personalized (param) {
  return axios({
    url: 'personalized',
    method: 'get',
    params: param
  })
}
