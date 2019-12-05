<template>
  <div>
    <div class="base-info" v-if="showTabList">
      <div class="base">
        <h1>研学方案</h1>
        <ul class="li-list">
          <li @click="courseVisible = true">课程设计</li>
          <li @click="activeVisible = true">活动行程</li>
          <li @click="serverVisible = true">服务保障</li>
          <li @click="planVisible = true">安全预案</li>
          <li @click="wholeVisible = true">整体活动方案</li>
        </ul>	
      </div>
      <el-dialog title="课程设计" :visible.sync="courseVisible">
        <course-tab :courseList="courseList" :checkCourse="checkCourse"  :actStatus="actStatus" :disable="disable"></course-tab>
      </el-dialog>
      <el-dialog title="活动行程" :visible.sync="activeVisible">
        <schedule-tab :scheduleList="scheduleList" :checkSchedule="checkSchedule"  :actStatus="actStatus" :disable="disable"></schedule-tab>
      </el-dialog>
      <el-dialog title="服务保障" :visible.sync="serverVisible">
        <server-tab :serverList="serverList" :checkServer="checkServer"  :actStatus="actStatus" :disable="disable"></server-tab>
      </el-dialog>
      <el-dialog title="安全预案" :visible.sync="planVisible">
        <plan-tab :planList="planList"  :checkPlan="checkPlan" :actStatus="actStatus" :disable="disable"></plan-tab>
      </el-dialog>
      <el-dialog title="整体活动方案" :visible.sync="wholeVisible">
        <whole-tab :wholeList="wholeList"  :actStatus="actStatus" :disable="disable"></whole-tab>
      </el-dialog>
    </div>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" stretch v-else>
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
  </div>
</template>

<script>
import {STATUS_TYPE,TYPE} from '@/config/config'
import CourseTab from './course-tab'
import ScheduleTab from './schedule-tab'
import ServerTab from './server-tab'
import PlanTab from './plan-tab'
import WholeTab from './whole-tab'
export default {
  props:{
    userData:{
      type:Object,
      default:{}
    },
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
      activeName: 'course',
      courseVisible:false,
      activeVisible:false,
      serverVisible:false,
      planVisible:false,
      wholeVisible:false,
    }
	},
	computed:{
    showTabList(){
      if(this.userData.userType === TYPE.JG){
        return false
      }else{
        if(this.actStatus==STATUS_TYPE.PASS || this.actStatus==STATUS_TYPE.BEGIN||this.actStatus==STATUS_TYPE.END||this.actStatus==STATUS_TYPE.EXCEED){
          return true
        }else{
          return false
        }
      }
    },
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
    console.log('====',this.courseList)
  },
  destroyed(){
  }
}
</script>

<style lang="less" scoped>
.base-info{
  width: 100%;
	margin-top: 20px;
  background: #fff;
  box-shadow:0px 0px 2px #ddd;
}
.base{
	width: 93%;
	height: 100%;
	margin: 0 auto;
	&>h1{
    text-align: left;
    font-size: 18px;
    padding: 18px 0;
    border-bottom: 1px dashed #ccc;
  }
}
.li-list{
  display: flex;
  margin: 30px 0;
  &>li{
    width: 200px;
    height: 50px;
    line-height: 50px;
    margin-right: 50px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
