<template>
  <div class="add-info">
    <img src="../../../assets/images/close.png" class="close-icon" @click="closeDetail">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      label-width="120px"
      size="small"
      class="demo-ruleForm">

      <el-form-item label="姓名：" prop="teacherName" required>
        <div class="base-input">
          <el-input v-model="taskForm.teacherName" placeholder="请输入姓名"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="手机号：" prop="mobileNum" required>
        <div class="base-input">
          <el-input v-model="taskForm.mobileNum" placeholder="手机号"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="学校名称：" prop="officeName" required>
        <div class="base-input">
          <el-input v-model="taskForm.officeName" disabled></el-input>
        </div>
      </el-form-item>

      <el-form-item label="班主任：" prop="isMaster" required>
         <div class="base-input">
          <el-select v-model="taskForm.isMaster" placeholder="请选择">
            <el-option
              v-for="item in masterList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
import {saveTeacher} from '@/api/classes'
export default {
  props:{
    userInfo:Object,
  },
  data(){
    return {
      masterList:[
        {value:'1',label:'是'},
        {value:'0',label:'否'},
      ],
      taskForm: {
        teacherId:'',
        teacherName:'',
        officeId:'',
        officeName:'',
        mobileNum:'',
        teacherType:'11',
        position:'',
        isMaster:'0',
        classList:[
          {classId:'',teacherId:'',isMaster:''}
        ]
      },
      rules: {
        teacherName: [
          { required: true, message: '请输入老师姓名'}
        ],
        officeName: [
          { required: true, message: '请输入学校'},
        ],
        isMaster: [
          { required: true, message: '请选择是否为班主任'},
        ],
        mobileNum: [
          {required: true, message: '请输入手机号码',},
          {pattern:/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,message:"请输入合法的手机号"}
        ],
      }
    }
  },
  methods: {
    closeDetail(){
      this.resetForm();
      this.$emit('close')
    },
    
    editForm(data){
      console.log('编辑',data)
      this.taskForm.isMaster = data.isMaster
      this.taskForm.teacherId = data.teacherId
      this.taskForm.teacherName = data.teacherName
      this.taskForm.mobileNum = data.mobileNum
    },

    //保存用户
    addTeacherSave(data){
      saveTeacher(data).then(res=>{
        console.log(res)
        if(res.status===200){
          this.$notify({title: '成功',message: '添加老师信息成功',type: 'success'});
          this.$emit('submit')
          this.closeDetail()
        }
      })
    },

    //提交表单
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.taskForm.classList[0].isMaster = this.taskForm.isMaster
          this.taskForm.classList[0].teacherId = this.taskForm.teacherId
          this.addTeacherSave(this.taskForm)
        }
      })
    },

    //重置表单
    resetForm() {
      this.taskForm.teacherId=''
      this.taskForm.officeId=''
      this.taskForm.classList=[{classId:'',teacherId:'',isMaster:''}]
      this.$refs['taskForm'].resetFields();
    },

    init(){
      let {classId} = this.$route.params
      let {officeName,officeId} = this.userInfo
      this.taskForm.officeName=officeName
      this.taskForm.officeId=officeId
      this.taskForm.classList[0].classId=classId
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
.base-check{
	flex: none;
  display: flex;
  flex-flow: column;
	align-items: flex-start;
	width:200px;
}
.checkbox-group{
  text-align: left;
}
</style>
