<template>
  <div class="add-info">
    <img src="../../assets/images/close.png" class="close-icon" @click="closeDetail">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      label-width="130px"
      size="small"
      class="demo-ruleForm">

      <el-form-item label="基(营)地名称：" prop="officeId" required>
        <div class="base-input">
          <el-select v-model="taskForm.officeId"  clearable  placeholder="请选择机构">
            <el-option
              v-for="item in officeList"
              :key="item.name"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="电子围栏名称：" prop="fenceName" required>
        <div class="base-input">
          <el-input v-model="taskForm.fenceName" placeholder="请输入电子围栏名称"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="围栏类型：" prop="bufferType" required>
        <div class="base-input">
          <el-select v-model="taskForm.bufferType" placeholder="请选围栏类型">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.bufferType">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="联系人：" prop="contactName" required>
        <div class="base-input">
          <el-input v-model="taskForm.contactName" placeholder="请输入联系人"></el-input>
        </div>
      </el-form-item>
      
      <el-form-item label="联系人电话：" prop="mobileNum" required>
        <div class="base-input">
          <el-input v-model="taskForm.mobileNum" placeholder="请输入联系人电话"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="围栏：" v-show="!isEditor">
        <div class="action-btn">
					<my-upload ref="upload" accept=".cpg,.dbf,.prj,.qpj,.shp,.shx" :limit="limit" :multiple="multiple" @preview="fencePreview" v-show="fenceFile.length<6">
						<span class="edit-btn">点此上传</span>
					</my-upload>

					<span class="file-ok" v-for="(item,index) in fenceFile" :key="index" v-show="fenceFile.length" @click="deleteFence(item.name)">{{item.name}}</span>
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
  import MyUpload from '@/components/my-upload'
  import {fenceSave} from '@/api/fence'
  export default {
    props:{
      officeList:{
        type:Array,
        default:()=>[]
      }
    },
    data(){
      return {
        limit:6,
        multiple:true,
        taskForm: {
          fenceName:'',
          officeId:'',
          contactName:'',
          bufferType:'',
          mobileNum:'',
          shapeFile:'',
          fenceId:'',
          fenceCode:'',
        },
        typeList:[
          {bufferType:1,name:'禁出'},
          {bufferType:2,name:'禁入'}
        ],
        fenceFile:[],
        isEditor:false,
        rules: {
          fenceName: [
            { required: true, message: '请输入电子围栏名称'}
          ],
          officeId: [
            { required: true, message: '请选择机构'}
          ],
          contactName: [
            { required: true, message: '请输入联系人'}
          ],
          bufferType: [
            { required: true, message: '请选围栏类型'}
          ],
          mobileNum: [
            { required: true, message: '请输入联系人电话'},
            {pattern:/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,message:"请输入合法的手机号"}
          ],
        }
      }
    },
    components:{
      MyUpload
    },
    methods: {
      closeDetail(){
        this.resetForm();
        this.$emit('close')
      },
      fencePreview(list){
        this.fenceFile=list
        this.taskForm.shapeFile = list
      },
      deleteFence(name){
        let index = this.fenceFile.findIndex(v=>{
          return v.name === name
        })
        this.fenceFile.splice(index,1)
        this.$refs.upload.deleteFile(name)
      },

      editForm(data){
        console.log(data)
        this.isEditor = true
        this.taskForm =Object.assign(this.taskForm,data) 
      },

      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let file = this.fenceFile.map(v=>{
              return v.file
            })
            this.taskForm.shapeFile = file
            console.log(this.taskForm)
            fenceSave(this.taskForm).then(res=>{
              console.log(res)
              if(res.status === 200){
                this.closeDetail()
                this.$notify({
                  title: '成功',
                  message: '保存电子围栏成功!',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('change')
              }
            })
          }
        })
      },
      //重置表单
      resetForm() {
        this.taskForm.fenceCode = '';
        this.taskForm.fenceId = '';
        this.taskForm.shapeFile = '';
        this.isEditor = false
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
  padding-left: 20px;
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
.file-ok{
  flex: none;
	display: inline-block;
	padding: 0 20px;
	text-align: center;
	line-height: 30px;
	color: #fff;
	font-size: 14px;
	border-radius: 30px;
  margin-left: 10px;
  margin-top: 10px;
	background: #42b983;
	cursor: pointer;
}
.edit-btn{
	display: inline-block;
	width: 106px;
	height: 30px;
	text-align: center;
	line-height: 30px;
	color: #fff;
	font-size: 14px;
	border-radius: 30px;
	margin-left: 10px;
	background: #2459f0;
	cursor: pointer;
}
.action-btn{
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
}
</style>
