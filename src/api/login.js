import request from '@/utils/request'

// 登录接口
export function getLogin(data) {
  return request({
    url: '/login/',
    method: 'post',
    data
  })
}

// 注册接口
export function getRegister(data) {
  return request({
    url: '/register/',
    method: 'post',
    data
  })
}
