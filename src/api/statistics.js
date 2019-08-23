import http from '@/util/http'

// 查询
export function staticActByDate(beginTime,endTime,actStatus) {
  let url= '/api/hibl/activity/staticActByDate'
  let data = {
    beginTime,
    endTime,
    actStatus
  };
  return http.post(url,data)
}

export function staticFinishAct(beginTime,endTime,actStatus) {
  let url= '/api/hibl/activity/staticFinishAct'
  let data = {
    beginTime,
    endTime,
    actStatus
  };
  return http.post(url,data)
}