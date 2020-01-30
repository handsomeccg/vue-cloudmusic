import { axios } from '../utils/request'

// 搜索结果
export function getSearchResult (param) {
  return axios({
    url: 'search',
    method: 'get',
    params: param
  })
}

// 默认搜索关键词
export function getSearchDefault (param) {
  return axios({
    url: 'search/default',
    method: 'get',
    params: param
  })
}

// 热搜榜
export function searchHot (param) {
  return axios({
    url: 'search/hot/detail',
    method: 'get',
    params: param
  })
}

// 搜索建议
export function searchSuggest (param) {
  return axios({
    url: 'search/suggest',
    method: 'get',
    params: param
  })
}
