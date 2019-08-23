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

      <el-form-item label="行动时间段(开始)：" prop="beginTime" required>
        <div class="time-input">
          <el-date-picker
            popper-class="durp-time"
            :disabled="disabled"
            v-model="taskForm.beginTime"
            type="datetime"
            :picker-options="pickerStart"
            format="yyyy-MM -dd  HH:mm"
            placeholder="选择开始时间">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="行动时间段(结束)：" prop="endTime" required>
        <div class="time-input">
          <el-date-picker
            popper-class="durp-time2"
            :disabled="disabled"
            v-model="taskForm.endTime"
            :picker-options="pickerStart"
            type="datetime"
            format="yyyy-MM -dd  HH:mm"
            placeholder="选择结束时间">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="责任方：" prop="chargeOffice" required>
        <div class="time-input">
          <el-select :disabled="disabled" v-model="taskForm.chargeOffice" popper-class="durp-time3" placeholder="请选择主管单位">
            <el-option
              v-for="item in chargeList"
              :key="item.value"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="行动地点：" prop="arrivePlaceName" required>
        <div class="base-input">
          <el-input v-model="taskForm.arrivePlaceName" :disabled="disabled" placeholder="请输入行动地点,不超过20字"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="具体事项：">
        <p class="base-span">提交具体事项有助于在公众号生成工作内容提示，审核通过后也可进行修改。</p>
        <div class="base-input more-input">
          <el-input v-model="taskForm.workList[0]" placeholder="请输入内容,不超过20字"></el-input>
        </div>
        <div class="base-input more-input">
          <el-input v-model="taskForm.workList[1]" placeholder="请输入内容,不超过20字"></el-input>
        </div>
        <div class="base-input more-input">
          <el-input v-model="taskForm.workList[2]" placeholder="请输入内容,不超过20字"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="固定电子围栏：" >
        <p class="base-span">勾选该地点所对应的固定电子围栏区域；没有对应的电子围栏区域的，请选择“本区域没有电子围栏”</p>
        <div class="check-input">
          <el-checkbox-group  v-model="taskForm.fenceIds" v-if="fenceItem.length">
            <el-checkbox v-for="fence in fenceItem" :label="fence.fenceId" :key="fence.fenceId">{{fence.fenceName}}</el-checkbox>
          </el-checkbox-group>
          <div v-else>本区域没有电子围栏</div>
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
  import {fenceList} from '@/api/fence'
  import {formatDate} from '@/util/common'
  export default {
    props:{
      type:String,
      disabled:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        taskForm: {
          arrivePlaceName:'',
          beginTime:'',
          endTime:'',
          workList:['','',''],
          chargeOffice:'',
          fenceIds:[],
        },
        fenceItem:[],
        rules: {
          arrivePlaceName: [
            { required: true, message: '请输入地点'}
          ],
          chargeOffice: [
            { required: true, message: '请选择主管单位'}
          ],
          beginTime: [
            { required: true, message: '请选择开始时间'}
          ],
          endTime: [
            { required: true, message: '请选择结束时间'}
          ],
          fenceIds: [
            { required: true, message: '请选择电子围栏'}
          ]
        },
        pickerStart:{
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    computed:{
      chargeList(){
        return this.$store.state.active.charge
      }
    },
    components: {
    },
    methods: {
      closeDetail(){
        this.resetForm();
        this.$emit('close')
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.taskForm.beginTime=formatDate(this.taskForm.beginTime,'second')
            this.taskForm.endTime=formatDate(this.taskForm.endTime,'second')
            let workList = this.workListInit()
            this.taskForm.workList=workList.join('|')
            if(this.type==='write') this.$emit('submit',this.taskForm)
            else this.$emit('editor',this.taskForm)
            this.closeDetail()
          }
        })
      },
      workListInit(){
        let list = []
        this.taskForm.workList.forEach(v=>{
          if(v!=''){
            list.push(v)
          }
        })
        return list
      },
      getFenceList(officeId="",keyword=""){
        fenceList(officeId,keyword).then(res=>{
          console.log(res)
          if(res.status===200){
            this.fenceItem = res.data
          }
        })
      },
      editForm(data){
        console.log('编辑',data)
        let fenceIds = data.fenceIds?data.fenceIds.split(','):[]
        let workList = data.workList?data.workList.split('|'):['','','']
        this.taskForm = Object.assign({},data,{fenceIds},{workList}) 
      },
      //重置表单
      resetForm() {
        this.$refs['taskForm'].resetFields();
        this.taskForm.workList=['','','']
        this.taskForm.fenceIds=[]
      }
    },
    mounted(){
      console.log('*****',this.chargeList)
      let index = this.chargeList.findIndex(v=>{
        return v.officeType === '13'
      })
      if(index>=0){
        let office = this.chargeList[index]
        this.getFenceList(office.officeId)
      }
      
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
  width: 1100px;
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
  margin: 50px 0;
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
.check-input{
  width:500px;
  text-align: left;
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
