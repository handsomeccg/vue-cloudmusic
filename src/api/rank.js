import { axios } from '../utils/request'

// 排行榜简要信息
export function getRankList () {
  return axios({
    url: 'api/toplist/detail',
    method: 'get'
  })
}

// 获取排行榜内容
export function getRankDetail (id) {
  return axios({
    url: `api/top/list?idx=${id}`,
    method: 'get'
  })
}
