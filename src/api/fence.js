import http from '@/util/http'
import qs from 'qs'

// 列表查询
export function fenceList(officeId="",keyword="") {
  let url= '/api/hibl/fence/list'
  let data = {
    keyword,
    officeId,
  };
  return http.post(url,data)
}


// 删除
export function fenceDelete(fenceIds) {
  return http({
    url: '/api/hibl/fence/delete',
    method: 'GET',
    params:{
      fenceIds
    },
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}


//保存
export function fenceSave({shapeFile,fenceId,fenceCode,fenceName,officeId,bufferType,contactName,mobileNum}) {
  let url= '/api/hibl/fence/save'

  let param = new FormData();

  shapeFile.forEach(v=>{
    param.append("shapeFile",v)
  })
  
  param.append("fenceId",fenceId)
  param.append("fenceCode",fenceCode)
  param.append("fenceName",fenceName)
  param.append("officeId",officeId)
  param.append("bufferType",bufferType)
  param.append("contactName",contactName)
  param.append("mobileNum",mobileNum)

  return http.post(url,param)
}