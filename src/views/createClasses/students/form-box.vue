<template>
 

  <div class="add-info">
    <img src="../../../assets/images/close.png" class="close-icon" @click="closeDetail">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      label-width="150px"
      size="small"
      class="demo-ruleForm">

      <el-form-item label="学生姓名：" prop="studentName" required>
        <div class="base-input">
          <el-input v-model="taskForm.studentName" placeholder="请输入学生姓名"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="学生生日：" prop="birthday" required>
        <div class="base-input">
          <el-date-picker v-model="taskForm.birthday" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="学籍号：" prop="studentCode" required>
        <div class="base-input">
          <el-input v-model="taskForm.studentCode" placeholder="请输入学籍号"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="监护人1：" prop="guaNameOne" required>
        <div class="base-input">
          <el-input v-model="taskForm.guaNameOne" placeholder="请输入监护人1姓名"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="监护人1手机：" prop="guaMobileOne" required>
        <div class="base-input">
          <el-input v-model="taskForm.guaMobileOne" placeholder="请输入监护人1手机号"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="监护人2：">
        <div class="base-input">
          <el-input v-model="taskForm.guaNameTwo" placeholder="请输入监护人2姓名"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="监护人2手机：">
        <div class="base-input">
          <el-input v-model="taskForm.guaMobileTwo" placeholder="请输入监护人2手机号"></el-input>
        </div>
      </el-form-item>


    </el-form>

    <div class="footer-btn">
      <el-button @click="closeDetail">取 消</el-button>
      <el-button type="primary" @click="submitForm('taskForm')">确 定</el-button>
    </div>
  </div>

</template>

<script>
  import {studentSave} from '@/api/classes'
  export default {
    props:{
      userInfo:Object,
    },
    data(){
      return {
        taskForm: {
          classId:'',
          studentId:'',
          studentCode:'',
          studentName:'',
          guaNameOne:'',
          guaMobileOne:'',
          guaNameTwo:'',
          guaMobileTwo:'',
          birthday:''
        },
        rules: {
          studentCode: [
            { required: true, message: '请输入学籍号'}
          ],
          birthday: [
            { required: true, message: '请选择生日'}
          ],
          studentName: [
            { required: true, message: '请输入学生姓名'}
          ],
          guaNameOne: [
            { required: true, message: '请输入监护人姓名'}
          ],
          guaMobileOne: [
            { required: true, message: '请输入手机号'},
            {pattern:/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,message:"请输入合法的手机号"}
          ]
        }
      }
    },
    components: {
    },
    methods: {
      closeDetail(){
        this.resetForm();
        this.$emit('close')
      },
      editAndSave(data){
        studentSave(data).then(res=>{
          console.log('保存学生',res)
          if(res.status===200){
            this.$notify({title: '成功',message: '保存学生信息成功',type: 'success'});
            this.$emit('submit')
            this.closeDetail()
          }
        })
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = {
              studentCode:this.taskForm.studentCode,
              studentId:this.taskForm.studentId,
              studentName:this.taskForm.studentName,
              guardianName:this.taskForm.guaNameTwo?`${this.taskForm.guaNameOne},${this.taskForm.guaNameTwo}`:this.taskForm.guaNameOne,
              guardianMobile:this.taskForm.guaMobileTwo?`${this.taskForm.guaMobileOne},${this.taskForm.guaMobileTwo}`:this.taskForm.guaMobileOne,
              classId:this.taskForm.classId,
              birthday:this.taskForm.birthday
            }
            this.editAndSave(formData)
          }
        })
      },
      editForm(data){
        console.log('编辑',data)
        this.taskForm.studentName = data.studentName
        this.taskForm.studentCode = data.studentCode
        this.taskForm.studentId = data.studentId
        this.taskForm.birthday = data.birthday
        this.taskForm.guaMobileOne = data.guardianMobile.split(',')[0]
        this.taskForm.guaMobileTwo = data.guardianMobile.split(',')[1]
        this.taskForm.guaNameOne = data.guardianName.split(',')[0]
        this.taskForm.guaNameTwo = data.guardianName.split(',')[1]
      },
      //重置表单
      resetForm() {
        this.taskForm.classId = ''
        this.taskForm.guaNameTwo = ''
        this.taskForm.guaMobileTwo = ''
        this.taskForm.studentId = ''
        this.$refs['taskForm'].resetFields();
      },
      init(){
        let {classId} = this.$route.params
        this.taskForm.classId=classId?classId:''
      }
    },
    mounted(){
    }
  }
</script>

<style scoped lang="less">
.add-info{
  position: fixed;
  top: 81px;
  right: 0;
  bottom: 0;
  width: 420px;
  z-index: 100;
  background: #fff;
  box-shadow:0px 0px 1px #999;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
}
.close-icon{
  position: absolute;
  right: 15px;
  top: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.demo-ruleForm{
  margin-top: 40px;
}
.footer-btn{
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  &>button{
    margin: 0 30px;
  }
}
.base-input{
	flex: none;
	display: flex;
	align-items: center;
	width:200px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.time-input{
  flex: none;
	display: flex;
	align-items: center;
	width:200px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.base-editor{
	height: 350px;
}
.more-input{
  margin-bottom: 20px;
}
.base-span{
  text-align: left;
  padding-bottom: 10px;
  color: red;
}
</style>
