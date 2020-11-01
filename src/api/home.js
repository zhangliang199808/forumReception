import request from '@/utils/request'

// 首页文章列表(分类)
export function getArticleTypeList(data) {
  return request({
    url: '/category/article/',
    method: 'get',
    params: data
  })
}

// 获取文章分类
export function articleType(data) {
    return request({
      url: '/all/category/',
      method: 'get',
      params: data
    })
  }
// 文章详情接口
export function apiDetail(data) {
  return request({
    url: '/article/data/',
    method: 'get',
    params: data
  })
}
// 图片上传
export function apiImgUpload(data) {
  return request({
    url: '/upload/file/',
    method: 'POST',
    data
  })
}
// 发布文章
export function addArtice(data) {
  return request({
    url: '/add/article/',
    method: 'POST',
    data
  })
}