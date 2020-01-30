import { axios } from '../utils/request'

// 云村热评墙
export function getHotComments (param) {
  return axios({
    url: 'comment/hotwall/list',
    method: 'get',
    params: param
  })
}
