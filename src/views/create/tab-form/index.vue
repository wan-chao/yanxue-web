<template>
  <el-tabs v-model="activeName" type="card" stretch>
    <el-tab-pane label="报名须知" name="enroll">
      <enroll :enrollData="enrollData"></enroll>
    </el-tab-pane>
    <el-tab-pane label="教师及工作人员" name="teacher">
      <teacher :teacherList="teacherList"></teacher>
    </el-tab-pane>
    <el-tab-pane label="学生信息" name="student">
      <student :class_ids="class_ids" v-if="class_ids"></student>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {STATUS_TYPE,TYPE} from '@/config/config'
import Enroll from './enroll'
import Teacher from './teacher'
import Student from './student'
import {selectActTeacher,selectEnrollNote} from '@/api/active'
export default {
  props:{
    class_ids:{
      type:String,
      default:''
    },
  },
  components: {
    Enroll,Teacher,Student
  },
  data(){
    return {
      activeName:'enroll',
      enrollData:{},
      allTeacher:[],
      teacherList:[],
    }
	},
	computed:{
    officeList(){
      let others = this.$store.state.active.charge.filter(v=>{
        return v.officeType !=TYPE.ZB
      })
      return others.map(v=>{
        return v.officeId
      })
    },
    schoolId(){
      let school = this.$store.state.active.charge.find(v=>{
        return v.officeType === TYPE.ZB
      })
      return [school.officeId]
    }
	},
	methods:{
    //查询所有老师
    seaarchActTeacher(actId,schoolIds,officeIds){
      selectActTeacher(actId,schoolIds,officeIds).then(res=>{
        console.log('所有老师',res)
        if(res.status===200){
          this.teacherList = res.data
        }
      })
    },
    //查询报名须知
    seacrchEnrollNote(actId){
      selectEnrollNote(actId).then(res=>{
        console.log('查询报名须知',res)
        if(res.status===200){
          this.enrollData = res.data
        }
      })
    },
    init(){
      let {id} = this.$route.query
      if(id) {
        console.log('****',this.schoolId,this.officeList)
        this.actId = id
        this.seaarchActTeacher(this.actId,this.schoolId,this.officeList)
        this.seacrchEnrollNote(this.actId)
      }
    }
  },
  watch:{
    officeList(newVal){
      if(newVal.length){
        this.seaarchActTeacher(this.actId,this.schoolId,this.officeList)
      }
    },
  },
  mounted(){
    this.init()
  },
  destroyed(){
  }
}
</script>

<style lang="less" scoped>
</style>
