export const SPACE_TIME = 1000*60*60*8;

export const OFFICE_LIST = [
    {name:'主办方',value:'11',typeList:[{roleName:"普通人",roleId:"12"},{roleName:"主责任人",roleId:"11"}]},
    {name:'承办方',value:'12',typeList:[{roleName:"普通人",roleId:"22"},{roleName:"主责任人",roleId:"21"}]},
    {name:'供应方',value:'13',typeList:[{roleName:"普通人",roleId:"32"},{roleName:"主责任人",roleId:"31"}]},
    {name:'监管方',value:'14',typeList:[{roleName:"普通人",roleId:"42"},{roleName:"主责任人",roleId:"41"}]},
    {name:'运营方',value:'15',typeList:[{roleName:"普通人",roleId:"52"},{roleName:"主责任人",roleId:"51"}]},
]

export const TYPE = {
    JG:"14", //监管方
    ZB:"11",//主办方
    CB:"12",//承办方
    GY:"13",//供应方
    YY:"15",//运营方
}

export const STATUS_TYPE = {
    "SUBMIT" : '10', //待提交
    "CHECK" : '11', //审核中
    "REFUSE" : '0', //被驳回
    "PASS" : '12', //筹备中
    "BEGIN" : '2', //进行中
    "END" : '3', //结束
    "EXCEED" : '5' //已过期
}

export const DEVICE_TYPE = [
  {name:'闲置',value:'0'},
  {name:'分配',value:'1'},
  {name:'使用中',value:'2'},
]

export const TEACHER_TYPE = [
  {name:'学校导师',teacherType:'10'},
  {name:'服务机构导师',teacherType:'11'},
  {name:'基地（营地）导师',teacherType:'12'},
]


export const MAP_OPTS={
  zoom: 14,  //设置地图显示的缩放级别
  // center: [114.30, 30.60],//设置地图中心点坐标
  center: [114.193524, 30.660685],
}



export function filterTeacherType(value){
  let index = TEACHER_TYPE.findIndex(v=>{
    return v.teacherType === value
  })
  if(index>=0){
    return TEACHER_TYPE[index].name
  }else{
    return ''
  }
}

export function filterDeviceType(value){
  let index = DEVICE_TYPE.findIndex(v=>{
    return v.value === value
  })
  if(index>=0){
    return DEVICE_TYPE[index].name
  }else{
    return ''
  }
}


export function organizationType(officeType){
  if(officeType === TYPE.ZB){
    return '主办方'
  }else if(officeType === TYPE.CB){
    return '承办方'
  }else if(officeType === TYPE.GY){
    return '供应方'
  }else if(officeType === TYPE.JG){
    return '监管方'
  }else if(officeType === TYPE.YY){
    return '运营方'
  }
}

export function urlList (data) {

  let list = ['/','/home','/details','/map','/create','/suggestion','/mainstay','/increase']

	data.forEach(v=>{
    if(v.name === "活动管理"){
      list.push('/actions')
      list.push('/venue')
    }else if(v.name === "部门管理"){
      list.push('/organization')
    } else if(v.name === "用户管理"){
      list.push('/user')
    }else if(v.name === "报警管理"){
      list.push('/report')
    } else if(v.name === "电子围栏"){
      list.push('/fence')
    } else if(v.name === "设备管理"){
      list.push('/device')
    } else if(v.name === "信息发布"){
      list.push('/information')
    } else if(v.name === "统计分析"){
      list.push('/statistics')
    }
  })
    
  return list
}


//权限
export function activeEnableEditor(userType){
  if(userType === TYPE.ZB || userType === TYPE.YY){
    return true
  }else{
    return false
  }
}

export function cmsEnableEditor(userType){
  if(userType === TYPE.YY){
    return true
  }else{
    return false
  }
}