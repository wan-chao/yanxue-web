import http from '@/util/http'
import qs from 'qs'

// 登录
export function userLogin(username, password) {
    let url= '/api/auth/jwt/token'
    let data = {
      username,
      password
    };
    return http.post(url,data)
}

//获取用户列表
export function userList(userName="",userType="",keyword="") {
  let url= '/api/admin/user/front/list'
  let data = {
    userName,
    userType,
    keyword,
  };
  return http.post(url,data)
}

//获取用户信息
export function userinfo(token) {
  return http({
      url: '/api/admin/user/front/info',
      method: 'GET',
      params: {
        token
      },
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
  })
}


//删除用户
export function userDelete(userList) {
  return http({
    url: '/api/admin/user/front/delete',
    method: 'GET',
    params: {
      userList
    },
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}

//保存用户
export function saveUser(data) {
  let url= '/api/admin/user/front/save'
  return http.post(url,data)
}

//角色查询
export function roleList(keyword) {
  let url= '/api/admin/role/list'
  let data = {
    keyword 
  }
  return http.post(url,data)
}


//用户是否存在
export function exsitUsername(username) {
  return http({
      url: '/api/admin/user/front/exsitUsername',
      method: 'GET',
      params: {
        username
      },
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
  })
}


//退出登录
export function logout(token) {
  return http({
      url: '/api/auth/jwt/logout',
      method: 'GET',
      params: {
        token
      },
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
  })
}


// 密码重置
export function resetPassword(token,oldPwd, newPwd) {
  let url= '/api/admin/user/front/resetPassword'
  let data = {
    token,
    oldPwd,
    newPwd
  };
  return http.post(url,data)
}