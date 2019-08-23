<template>
  <div class="model">

  <div class="add-info">
    <img src="../../assets/images/close.png" class="close-icon" @click="closeDetail">
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

      <el-form-item label="学籍号：" prop="studentCode" required>
        <div class="base-input">
          <el-input v-model="taskForm.studentCode" placeholder="请输入学籍号"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="定位终端编号：" prop="cardSid" required>
        <div class="base-input">
          <el-select v-model="taskForm.cardSid"   placeholder="选择定位产品编号">
            <el-option
              v-for="item in device"
              :key="item.value"
              :label="item.cardSid"
              :value="item.cardSid">
            </el-option>
          </el-select>
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
  </div>

</template>

<script>
  import {deviceList} from '@/api/device'
  export default {
    props:{
      type:String
    },
    data(){
      return {
        taskForm: {
          studentCode:'',
          cardSid:'',
          studentName:'',
          guaNameOne:'',
          guaMobileOne:'',
          guaNameTwo:'',
          guaMobileTwo:''
        },
        device:[],
        rules: {
          cardSid: [
            { required: true, message: '请输入定位终端编号'}
          ],
          studentCode: [
            { required: true, message: '请输入学籍号'}
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
      getDeviceList(status='0'){
        deviceList(status).then(res=>{
          console.log('8888',res)
          if(res.status === 200){
            this.device = res.data
          }
        })
      },
      closeDetail(){
        this.resetForm();
        this.$emit('close')
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              studentCode:this.taskForm.studentCode,
              cardSid:this.taskForm.cardSid,
              studentName:this.taskForm.studentName,
              guardianName:`${this.taskForm.guaNameOne},${this.taskForm.guaNameTwo}`,
              guardianMobile:`${this.taskForm.guaMobileOne},${this.taskForm.guaMobileTwo}`,
            }
            this.$emit('submit',data)
            this.closeDetail()
          }
        })
      },
      editForm(data){
        console.log('编辑',data)
        this.taskForm = Object.assign({},data) 
      },
      //重置表单
      resetForm() {
        this.$refs['taskForm'].resetFields();
        this.taskForm.guaNameTwo=''
        this.taskForm.guaMobileTwo=''
      }
    },
    mounted(){
      this.getDeviceList()
    }
  }
</script>

<style scoped lang="less">
.model{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-info{
  width: 1400px;
  height: 700px;
  margin-top: 50px;
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
  margin-left: 40px;
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
	width:500px;
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
