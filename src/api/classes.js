import http from '@/util/http'

// 查询班级
export function searchClass(schoolId, grade="") {
    let url= '/api/hibl/class/list'
    let data = {
      schoolId,
      grade
    };
    return http.post(url,data)
}

//班级保存
export function classSave(obj) {
    let url= '/api/hibl/class/save'
    let data = obj;
    return http.post(url,data)
}

// 老师保存
export function saveTeacher(obj) {
    let url= '/api/hibl/teacher/save'
    let data = obj;
    return http.post(url,data)
}

// 老师删除
export function deleteTeacher(classId,teacherList) {
    let url= '/api/hibl/teacher/deleteByClass'
    let data = {
      classId,
      teacherList
    };
    return http.post(url,data)
}

//查询老师
export function searchTeacher(classId) {
  return http({
      url: '/api/hibl/teacher/selectByClass',
      method: 'GET',
      params: {
        classId
      },
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
  })
}

//查询学生
export function searchStudent(classId) {
  let url= '/api/hibl/student/list'
  let data = {
    classId,
  };
  return http.post(url,data)
}

//查询学生
export function studentSave(obj) {
  let url= '/api/hibl/student/save'
  let data = obj;
  return http.post(url,data)
}

//删除学生
export function deleteStudent(classId,studentList) {
  let url= '/api/hibl/student/deleteByClass'
  let data = {
    classId,
    studentList
  };
  return http.post(url,data)
}

//查询学生
export function studentImport({file,classId}) {
  let url= '/api/hibl/student/import'
  let param = new FormData();

  param.append("file",file)
  param.append("classId",classId)

  return http.post(url,param)
}