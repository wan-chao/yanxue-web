import http from '@/util/http'
import qs from 'qs'

// 活动查询
export function activeList(keyword, actStatus,actId="") {
  let url= '/api/hibl/activity/listNew'
  let data = {
    keyword,
    actStatus,
    actId
  };
  return http.post(url,data)
}

export function activeInfo(actId) {
  return http({
    url: '/api/hibl/activity/selectByActId',
    method: 'GET',
    params:{
      actId
    },
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}

export function selectCheckInfo(actId) {
  return http({
    url: '/api/hibl/activity/selectCheckInfo',
    method: 'GET',
    params:{
      actId
    },
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}


// 活动保存
export function activeSave(formData) {

  let url='/api/hibl/activity/save'
  
  let data =formData

  return http.post(url,data)
}

export function saveNote(formData) {

  let url='/api/hibl/activity/saveNote'
  
  let data =formData

  return http.post(url,data)
}


// 上传图片
export function uploadFiles(files) {

  let url='/api/cloudstorage/uploadFiles'
  
  let param = new FormData();

  param.append("files", files)
  
  return http.post(url,param)
}


// 老师保存
export function teacherSave({teacherId,teacherName,officeId,mobileNum,teacherType,cardSid,actId,fenceBuffer}) {
  let url= '/api/hibl/activity/teacher/save'
  let data = {
    teacherId,
    teacherName,
    officeId,
    mobileNum,
    teacherType,
    cardSid,
    actId,
    fenceBuffer
  };
  return http.post(url,data)
}

// 老师删除
export function teacherDelete(data) {
  let url= '/api/hibl/activity/teacher/delete'
  return http.post(url,data)
}

// 老师查询
export function selectByMobile(mobile) {
  return http({
    url: '/api/hibl/teacher/selectByMobile',
    method: 'GET',
    params:{
      mobile
    },
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}


// 批量删除学生
export function studentDelete(data) {
  let url= '/api/hibl/activity/student/delete'
  return http.post(url,data)
}


// 学生保存
export function studentSave({actId,studentCode,cardSid,guardianName,guardianMobile,studentName,schoolId}) {
  let url= '/api/hibl/activity/student/save'
  let data = {
    actId,
    studentCode,
    cardSid,
    guardianName,
    studentName,
    guardianMobile,
    schoolId,
  };
  return http.post(url,data)
}




// 学生批量导入
export function studentImport({file,actId,schoolId}) {
  let url= '/api/hibl/activity/student/import'

  let param = new FormData();

  param.append("file",file)
  param.append("actId",actId)
  param.append("schoolId",schoolId)

  return http.post(url,param)
}


// 活动审查
export function check({actId,actName,resultStatus,resultDesc}) {
  let url= '/api/hibl/activity/check'
  let data = {
    actId,
    actName,
    resultStatus,
    resultDesc,
  };
  return http.post(url,data)
}
