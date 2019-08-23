<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" stretch>
    <el-tab-pane label="课程设计" name="course">
			<course-tab :courseList="courseList" :checkCourse="checkCourse"  :actStatus="actStatus" :disable="disable"></course-tab>
		</el-tab-pane>
    <el-tab-pane label="活动行程" name="schedule">
      <schedule-tab :scheduleList="scheduleList" :checkSchedule="checkSchedule"  :actStatus="actStatus" :disable="disable"></schedule-tab>
    </el-tab-pane>
    <el-tab-pane label="服务保障" name="server">
      <server-tab :serverList="serverList" :checkServer="checkServer"  :actStatus="actStatus" :disable="disable"></server-tab>
    </el-tab-pane>
    <el-tab-pane label="安全预案" name="plan">
      <plan-tab :planList="planList"  :checkPlan="checkPlan" :actStatus="actStatus" :disable="disable"></plan-tab>
    </el-tab-pane>
    <el-tab-pane label="整体活动方案" name="whole">
      <whole-tab :wholeList="wholeList"  :actStatus="actStatus" :disable="disable"></whole-tab>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import CourseTab from './course-tab'
import ScheduleTab from './schedule-tab'
import ServerTab from './server-tab'
import PlanTab from './plan-tab'
import WholeTab from './whole-tab'
export default {
  props:{
    disable:{
      type:Boolean,
      default:false
    },
    actStatus:{
      type:String,
      default:''
    },
    checkList:{
      type:Array,
      default:()=>[]
    },
    scheduleList:{
      type:Array,
      default:()=>[]
    },
    courseList:{
      type:Array,
      default:()=>[]
    },
    serverList:{
      type:Array,
      default:()=>[]
    },
    planList:{
      type:Array,
      default:()=>[]
    },
    wholeList:{
      type:String,
      default:''
    },
  },
  components: {
		CourseTab,ScheduleTab,ServerTab,PlanTab,WholeTab
  },
  data(){
    return {
			activeName: 'course'
    }
	},
	computed:{
    checkCourse(){
      let list = []
      this.checkList.forEach(v=>{
        let id = v.checkCode.substring(0,2)
        if(id==='01'){
          list.push(v)
        }
      })
      return list
    },
    checkSchedule(){
      let list = []
      this.checkList.forEach(v=>{
        let id = v.checkCode.substring(0,2)
        if(id==='02'){
          list.push(v)
        }
      })
      return list
    },
    checkServer(){
      let list = []
      this.checkList.forEach(v=>{
        let id = v.checkCode.substring(0,2)
        if(id==='03'){
          list.push(v)
        }
      })
      return list
    },
    checkPlan(){
      let list = []
      this.checkList.forEach(v=>{
        let id = v.checkCode.substring(0,2)
        if(id==='04'){
          list.push(v)
        }
      })
      return list
    },
	},
	methods:{
		handleClick(tab, event) {
  
    },
	},
  mounted(){
  },
  destroyed(){
  }
}
</script>

<style lang="less" scoped>

</style>
