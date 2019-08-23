<template>
  <div class="add-info">
    <img src="../../assets/images/close.png" class="close-icon" @click="closeDetail">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      label-width="150px"
      size="small"
      class="demo-ruleForm">

      <el-form-item label="监管人类型：" prop="teacherType" required>
        <div class="base-input">
          <el-select v-model="taskForm.teacherType" popper-class="durp-box"  clearable @change="typeChange" placeholder="--全部类型--">
            <el-option
              v-for="item in teacherList"
              :key="item.value"
              :label="item.name"
              :value="item.teacherType">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="所属机构：" prop="officeId" required>
        <div class="base-input">
          <el-select v-model="taskForm.officeId" :disabled="disabled" clearable  placeholder="请选择机构">
            <el-option
              v-for="item in chargeList"
              :key="item.value"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="监管人姓名：" prop="teacherName" required>
        <div class="base-input">
          <el-input v-model="taskForm.teacherName"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="手机号：" prop="mobileNum" required>
        <div class="base-input">
          <el-input v-model="taskForm.mobileNum"></el-input>
        </div>
      </el-form-item>


      <el-form-item label="移动电子围栏：" prop="fenceBuffer" required>
        <div class="base-num">
          <el-input-number v-model="taskForm.fenceBuffer" controls-position="right"  :min="1" :max="100">
          </el-input-number>
        </div>
        <span class="input-num">米</span>    
      </el-form-item>

      <el-form-item label="定位产品编号：" prop="cardSid" required>
        <div class="base-input">
          <el-select v-model="taskForm.cardSid" popper-class="durp-box2"  placeholder="选择定位产品编号">
            <el-option
              v-for="item in device"
              :key="item.value"
              :label="item.cardSid"
              :value="item.cardSid">
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
  import {deviceList} from '@/api/device'
  import {selectByMobile} from '@/api/active'
  import {TEACHER_TYPE} from '@/config/config'
  export default {
    props:{
      officeList:{
        type:Array,
        default:()=>[]
      }
    },
    data(){
      return {
        teacherList:TEACHER_TYPE,
        taskForm: {
          teacherId:'',
          officeId:'',
          teacherName:"",
          mobileNum:'',
          teacherType:'',
          fenceBuffer:1,
          cardSid:'',
        },
        disabled:true,
        device:[],
        rules: {
          teacherName: [
            { required: true, message: '请输入监管人姓名'}
          ],
          mobileNum: [
            { required: true, message: '请输入手机号'}
          ],
          fenceBuffer: [
            { required: true, message: '请输入电子围栏范围'}
          ],
          officeId: [
            { required: true, message: '请输入所属机构'}
          ],
          teacherType: [
            { required: true, message: '请选择监管人类型'}
          ],
          cardSid: [
            { required: true, message: '请输入产品编号'}
          ]
        }
      }
    },
    computed:{
      chargeList(){
        // console.log(this.$store.state.active.charge)
        return this.$store.state.active.charge
      }
    },
    methods: {
      getSelectByMobile(mobile){
        selectByMobile(mobile).then(res=>{
          console.log(res)
          if(res.status === 200){
            let info = res.data.db
            if(res.data.flag === "0"){
              this.$notify({
                title: '成功',
                message: '保存成功!',
                type: 'success',
                duration: 2000
              });
              this.$emit('submit',this.taskForm)
              this.closeDetail()
            }else{
              if(info.officeId === this.taskForm.officeId){
                this.$notify({
                  title: '成功',
                  message: '保存成功!',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('submit',this.taskForm)
                this.closeDetail()
              }else{
                this.$confirm(`监管人：${this.taskForm.teacherName}已存在其他机构中，是否确认修改其所属机构？`, '确认信息', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: '保存',
                  cancelButtonText: '放弃修改'
                }).then(() => {
                  this.$notify({
                    title: '成功',
                    message: '保存成功!',
                    type: 'success',
                    duration: 2000
                  });
                  this.$emit('submit',this.taskForm)
                  this.closeDetail()
                }).catch(action => {console.log('取消')});
              }
            }
          }
        })
      },
      getDeviceList(status='0'){
        deviceList(status).then(res=>{
          // console.log('8888',res)
          if(res.status === 200){
            this.device = res.data
          }
        })
      },
      typeChange(val){
        console.log(val,this.chargeList)
        if(val === '10'){
          this.taskForm.officeId = this.chargeList[0].officeId
        }else if(val === '11'){
          this.taskForm.officeId = this.chargeList[1].officeId
        }else if(val === '12'){
          this.taskForm.officeId = this.chargeList[2].officeId
        }else if(!val){
          this.taskForm.officeId = ''
        }
      },
      closeDetail(){
        this.resetForm();
        this.$emit('close')
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getSelectByMobile(this.taskForm.mobileNum)
          }
        })
      },
      editForm(data){
        console.log('编辑',data)
        this.taskForm = Object.assign({},data) 
      },
      //重置表单
      resetForm() {
        this.taskForm.teacherId=''
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
  z-index: 10;
  width: 450px;
  padding-top: 30px;
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
  margin-left: 20px;
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
.base-num{
  flex: none;
	display: flex;
	align-items: center;
	width:100px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.input-num{
  position: absolute;
  top: 2px;
  right:75px;
}
</style>
