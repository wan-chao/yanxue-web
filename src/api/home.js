import http from '@/util/http'

// 获取天气
export function weather() {
  return http({
      url: '/api/hibl/activity/weather',
      method: 'GET',
      params: {
      },
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
  })
}

//查询公众号相关新闻
export function cms() {
  return http({
      url: '/api/hibl/cms/wx',
      method: 'GET',
      params: {
        v:new Date().getTime()
      },
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
  })
}


// 动态播报
export function notify(start_time="", end_time="",role) {
  let url= '/api/hibl/notify/list'
  let data = {
    start_time,
    end_time,
    role
  };
  return http.post(url,data)
}

// 某月活动行程安排
export function activeTime(beginTime,endTime) {
  let url= '/api/hibl/activity/schedule'
  let data = {
    beginTime,
    endTime
  };
  return http.post(url,data)
}