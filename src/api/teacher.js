import http from '@/util/http'

// 查询老师
export function teacherList(officeId='',officeName='') {
    let url= '/api/hibl/teacher/list'
    let data = {
      "teacherId":"",
      "teacherName":"",
      officeId,
      officeName,
      "mobileNum":"",
      "teacherType":"",
    };
    return http.post(url,data)
}

// 删除老师
export function teacherDelete(teacherList) {
    let url= '/api/hibl/teacher/delete'
    let data = teacherList;
    return http.post(url,data)
}

// 老师批量导入
export function teacherImport({file,officeId,officeType}) {
  let url= '/api/hibl/teacher/import'

  let param = new FormData();

  param.append("file",file)
  param.append("officeId",officeId)
  param.append("officeType",officeType)

  return http.post(url,param)
}