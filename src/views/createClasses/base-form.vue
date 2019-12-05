<template>
  <div class="base-form">
    <el-form ref="taskForm" class="task-form" :inline="true" :rules="rules" :model="taskForm" label-width="120px" size="mini">
      <el-form-item prop="grade" required>
        <span slot="label" class="form-label">年级：</span>
        <div class="base-select">
          <el-select v-model="taskForm.grade" placeholder="请选择年级">
            <el-option
              v-for="item in classList"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item prop="className" required>
        <span slot="label" class="form-label">班级编号：</span>
        <div class="base-select">
          <el-input  v-model="taskForm.className" clearable placeholder="请输入班级编号"></el-input>
        </div>
      </el-form-item>

      <el-form-item prop="academicYear" required>
        <span slot="label" class="form-label">学年：</span>
        <div class="base-select">
          <el-date-picker v-model="taskForm.academicYear" type="year" format="yyyy年" value-format="yyyy" clearable placeholder="选择年"></el-date-picker>
        </div>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="form-btn" @click="submitForm('taskForm')">{{hasCreated?'修改':'创建班级'}}</el-button>
  </div>
</template>

<script>
import {classSave} from '@/api/classes'
export default {
  props:{
    hasCreated:{
      type:Boolean,
      default:false
    },
    userInfo:Object
  },
  data(){
    return {
      classId:'',
      taskForm: {
        className:'',
        grade:'',
        academicYear:''
      },
      classList:[
        {type:'1',name:'一年级'},
				{type:'2',name:'二年级'},
				{type:'3',name:'三年级'},
				{type:'4',name:'四年级'},
				{type:'5',name:'五年级'},
				{type:'6',name:'六年级'},
				{type:'7',name:'初一'},
				{type:'8',name:'初二'},
				{type:'9',name:'初三'},
      ],
      rules: {
        grade: [
          { required: true, message: '请选择年级'}
        ],
        className: [
          { required: true, message: '请输入班级'}
        ],
        academicYear: [
          { required: true, message: '请输入学年'}
        ],
      }
    }
  },
  components: {
  },
  methods: {
    init(){
      let {className,classId,grade,academicYear} = this.$route.params
      if(classId){
        this.classId = classId
        this.taskForm.grade = grade
        this.taskForm.className = className
        this.taskForm.academicYear = `${academicYear}`
      }
    },
    editAndSave(data){
      classSave(data).then(res=>{
        console.log('班级保存',res)
        if(res.status === 200){
          this.$notify({title: '成功',message: '班级修改成功',type: 'success'});
          if(this.classId){
            let selectGrade = this.classList.find(v=>{
              return v.type === this.taskForm.grade
            })
            this.$emit('change',selectGrade.name,this.taskForm.className)
          }else{
            this.$router.push('/classInfo')
          }
        }
      })
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let selectGrade = this.classList.find(v=>{
            return v.type === this.taskForm.grade
          })
          let formData = {
            classId:this.classId,
            schoolId:this.userInfo.officeId,
            className:this.taskForm.className,
            grade:this.taskForm.grade,
            gradeDesc:selectGrade.name,
            academicYear:this.taskForm.academicYear
          }
          this.editAndSave(formData)
        }
      })
    },
  },
  mounted(){
    this.init()
  }
}
</script>

<style scoped lang="less">
.base-form{
  display: flex;
  align-items: center;
}
.form-btn{
  height: 40px;
  margin-left: 20px;
}
.task-form{
  text-align: left;
  padding-top: 20px;
}
.form-label{
  font-size: 14px;
  line-height: 38px;
}
.base-select{
	display: flex;
	align-items: center;
	height: 38px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
</style>
