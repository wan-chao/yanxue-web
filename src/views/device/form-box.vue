<template>
  <div class="add-info">
    <img src="../../assets/images/close.png" class="close-icon" @click="closeDetail">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      label-width="120px"
      size="small"
      class="demo-ruleForm">

      <el-form-item label="终端名称："  prop="cardName" required>
        <div class="base-input">
          <el-input v-model="taskForm.cardName" placeholder="请输入终端名称"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="终端编号："  prop="cardSid" required>
        <div class="base-input">
          <el-input v-model="taskForm.cardSid" placeholder="请输入终端编号" :disabled="disabled"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="所属机构：" prop="officeId" required>
        <div class="base-input">
          <el-select v-model="taskForm.officeId" placeholder="请选择所属机构" >
            <el-option
              v-for="item in officeList"
              :key="item.name"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="SIM卡号：">
        <div class="base-input">
          <el-input v-model="taskForm.simId"  placeholder="请输入SIM卡号"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="说明：">
        <div class="base-input">
          <el-input v-model="taskForm.cardDesc" placeholder="请输入说明"></el-input>
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
  import {cardSave} from '@/api/device'
  export default {
    props:{
      officeList:{
        type:Array,
        default:()=>[]
      }
    },
    data(){
      return {
        taskForm: {
          officeId:'',
          cardSid:'',
          cardName:'',
          cardId:'',
          cardType:'',
          cardCode:'',
          simId:'',
          cardStatus:'0',
          cardDesc:''
        },
        disabled:false,
        rules: {
          cardName: [
            { required: true, message: '请输入终端名称'}
          ],
          cardSid: [
            { required: true, message: '请输入终端编号'}
          ],
          officeId: [
            { required: true, message: '请选择所属机构'}
          ]
        }
      }
    },
    methods: {
      closeDetail(){
        this.resetForm();
        this.$emit('close')
      },

      editForm(data){
        this.resetForm();
        console.log('编辑',data)
        this.disabled = true
        this.taskForm = Object.assign(this.taskForm,data)
      },

      //提交表单
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.taskForm)
            cardSave(this.taskForm).then(res=>{
              if(res.status === 200){
                this.$notify({
                  title: '成功',
                  message: '保存设备成功!',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('sucssce')
                this.closeDetail()
              }
            })
          }
        })
      },
      //重置表单
      resetForm() {
        this.taskForm.cardId="";
        this.taskForm.cardType="";
        this.taskForm.cardCode="";
        this.taskForm.cardDesc="";
        this.taskForm.simId="";
        this.taskForm.cardStatus="0";
        this.disabled=false
        this.$refs['taskForm'].resetFields();
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
</style>
