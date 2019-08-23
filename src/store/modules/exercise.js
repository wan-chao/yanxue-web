const state = {
  courseData:[], //课程设计
  scheduleData:[], //活动行程
  serverData:[], //服务保障
  planData:[], //安全预案
  wholeData:'', //安全预案
  studentData:[], //学生
  actId:''
}

const getters = {
  courseComplete: state => {
    if(state.courseData.length===3){
      let isComplete = state.courseData.every(v=>{
        return v.itemValue!=''
      })
      if(isComplete){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  },
  scheduleComplete: state => {
    if(state.scheduleData.length){
      return true
    }else{
      return false
    }
  },
  serverComplete: state => {
    if(state.serverData.length===7){
      let list = state.serverData.slice(0,6)
      let isComplete = list.every(v=>{
        return v.serviceContent!=''
      })
      if(isComplete){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  },
  planComplete: state => {
    if(state.planData.length===6){
      let list = state.planData.slice(0,5)
      let isComplete = list.every(v=>{
        return v.itemValue!=''
      })
      if(isComplete){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  },
  wholeComplete: state => {
    if(state.wholeData!=''){
      return true
    }else{
      return false
    }
  },
}

const mutations = {
  SET_COURSE(state,data){
    state.courseData=data
  },
  SET_SCHEDULE(state,data){
    state.scheduleData=data
  },
  SET_SERVER(state,data){
    state.serverData=data
  },
  SET_PLAN(state,data){
    state.planData=data
  },
  SET_WHOLE(state,data){
    state.wholeData=data
  },
  SET_STUDENT(state,data){
    state.studentData=data
  },
  SET_ACTID(state,data){
    state.actId=data
  },
  
};


const actions = {
  setCourseData:({commit},data)=>{
    commit('SET_COURSE',data)
  },
  setScheduleData:({commit},data)=>{
    commit('SET_SCHEDULE',data)
  },
  setServerData:({commit},data)=>{
    commit('SET_SERVER',data)
  },
  setPlanData:({commit},data)=>{
    commit('SET_PLAN',data)
  },
  setWholeData:({commit},data)=>{
    commit('SET_WHOLE',data)
  },
  setStudentData:({commit},data)=>{
    commit('SET_STUDENT',data)
  },
  setActId:({commit},data)=>{
    commit('SET_ACTID',data)
  },
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
