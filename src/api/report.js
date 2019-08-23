import http from '@/util/http'
import qs from 'qs'

//查询
export function alarmList(start_time="", end_time="",type="") {
  let url= '/api/hibl/alarm/list'
  let data = {
    start_time,
    end_time,
    type
  };
  return http.post(url,data)
}

export function trace(actId, alarmId) {
  let url= '/api/hibl/activityLocate/trace.do'
  let data = {
    actId,
    alarmId,
  };
  return http.post(url,data)
}


// 处理
export function handle(actId,recordId,handleStatus,handlerResult) {


  let url= '/api/hibl/alarm/handle'
  let data = {
    actId,
    recordId,
    handleStatus,
    handlerResult
  };
  return http.post(url,data)
  
}