import http from '@/util/http'

// 机构查询
export function officeList(officeType="") {
  let url= '/api/admin/office/list'
  let data = {
    officeType
  };
  return http.post(url,data)
}

// 机构树查询
export function officeTree(officeType="",officeId="") {
  let url= '/api/admin/office/tree'
  let data = {
    keyword:'',
    officeType,
    officeId,
  };
  return http.post(url,data)
}

// 机构保存
export function officeSave(form) {
  let url= '/api/admin/office/save'
  let data = form;
  return http.post(url,data)
}

// 机构删除
export function officeDelete(officeId) {
  return http({
    url: '/api/admin/office/deleteTree',
    method: 'GET',
    params:{
      officeId
    },
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}