import { axios } from '../utils/request'

// 推荐mv
export function getMvList (param) {
  return axios({
    url: 'api/mv/all',
    method: 'get',
    params: param
  })
}

// 获取mv数据
export function getMv (param) {
  return axios({
    url: 'api/mv/detail',
    method: 'get',
    params: param
  })
}
