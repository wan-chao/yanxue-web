<template>
  <div class="form-box">
    <el-form :model="taskForm" ref="taskForm" :rules="rules" label-width="150px" size="small">
      <el-form-item prop="price" required>
        <span slot="label" class="form-label">活动费用：</span>
        <div class="base-input">
          <el-input v-model="taskForm.price" placeholder="请输入活动费用" type="number"></el-input>
          <span class="base-txt">元</span>
        </div>
      </el-form-item>
      <el-form-item prop="payee" required>
        <span slot="label" class="form-label">收款方：</span>
        <div class="base-input">
          <el-select v-model="taskForm.payee" clearable  placeholder="请选择收款方">
            <el-option
              v-for="item in typeList"
              :key="item.officeId"
              :label="item.officeName"
              :value="item.officeId">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item prop="registDeadline" required>
        <span slot="label" class="form-label">报名截至：</span>
        <div class="base-input">
          <el-date-picker v-model="taskForm.registDeadline" 
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择报名截至时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item prop="imgUrl" required>
        <span slot="label" class="form-label">活动头图：</span>
        <div class="base-upload">
          <my-upload ref="planUpload" @preview="planPreview" v-show="!imgPath">
            <div class="pic-upload">
              <a class="el-icon-plus upload-icon"></a>
              <p class="upload-txt">点此上传</p>
            </div>
          </my-upload>
          <img :src="imgPath" v-show="imgPath" class="pic-text" @click="deleteImg">
        </div>
      </el-form-item>
      <el-form-item prop="noteContent" required>
        <span slot="label" class="form-label">报名须知：</span>
        <div class="notice-editor">
          <my-editor :text='taskForm.noteContent' @change="editorChange" v-if="!disabled"></my-editor>
					<div v-else class="editor-text" v-html="taskForm.noteContent"></div>
        </div>
      </el-form-item>
    </el-form>
    <el-button :type="hasSubmit?'success':'primary'" @click="submitForm('taskForm')" class="form-sub">{{hasSubmit?'修 改':'确 定'}}</el-button>
  </div>
</template>

<script>
import {STATUS_TYPE} from '@/config/config'
import MyUpload from '@/components/my-upload'
import MyEditor from '@/components/my-editor'
import {uploadFiles,getURLList,saveEnrollNote} from '@/api/active'
export default {
  props:{
    enrollData:{
      type:Object,
      default:{}
    }
  },
  components: {
    MyUpload,MyEditor
  },
  data(){
    return {
      disabled:false,
      oss:'oss-cn-hangzhou.aliyuncs.com',
      imgPath:'',
      editorText:'',
      taskForm:{
        actId:'',
        price:'',
        payee:'',
        registDeadline:'',
        imgUrl:'',
        noteContent:''
      },
      rules: {
        price: [
          { required: true, message: '请输入价格'}
        ],
        payee: [
          { required: true, message: '请选收款方'}
        ],
        registDeadline: [
          { required: true, message: '请选择结束时间'}
        ],
        imgUrl: [
          { required: true, message: '请选择图片'},
        ],
        noteContent: [
          { required: true, message: '请输入报名须知'},
        ],
      }
    }
	},
	computed:{
    hasSubmit(){
      if(this.enrollData.registDeadline){
        return true
      }else{
        return false
      }
    },
    typeList(){
      return this.$store.state.active.charge
    },
	},
	methods:{
    //提交表单
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.taskForm)
          this.userSaveEnrollNote(this.taskForm)
        }
      })
    },
    //保存报名须知
    userSaveEnrollNote(obj){
      saveEnrollNote(obj).then(res=>{
        console.log('保存报名须知',res)
        if(res.status===200){
          this.$notify({title: '成功',message: '保存报名须知成功',type: 'success'});
        }
      })
    },
    //编辑须知
    editorEnroll(obj){
      this.taskForm.actId = obj.actId?obj.actId:''
      this.taskForm.registDeadline = obj.registDeadline?obj.registDeadline:''
      this.taskForm.noteContent = obj.noteContent?obj.noteContent:''
      this.taskForm.imgUrl = obj.imgUrl?obj.imgUrl:''
      this.taskForm.payee = obj.payee
      this.taskForm.price = obj.price
      this.imgPath = obj.ossImg?obj.ossImg.replace("oss-cn-hangzhou-internal.aliyuncs.com",this.oss):''
    },
    planPreview(list){
      let os = list[0].file
      this.$refs['taskForm'].clearValidate();
			uploadFiles(os).then(res=>{
        console.log('上传图片',res)
				if(res.status === "0"){
          this.imgPath = list[0].url
          this.taskForm.imgUrl=res.datas
				}
			}).catch(()=>{
        this.deleteImg()
			})
    },
    getFileUrl(keys){
      getURLList(keys).then(res=>{
        console.log('图片获取',res)
      })
    },
    deleteImg(){
      this.taskForm.imgUrl=''
      this.imgPath = ''
      this.$refs.planUpload.clearFile()
    },
    editorChange(data){
      this.taskForm.noteContent = data
      this.$refs['taskForm'].clearValidate();
    },
    clearForm(){
      this.taskForm.registDeadline=''
      this.taskForm.imgUrl=''
      this.taskForm.noteContent=''
      this.taskForm.actId=''
    }
  },
  watch:{
    enrollData(newVal){
      if(newVal.actId){
        this.editorEnroll(newVal)
      }
    }
  },
  mounted(){
    let {id} = this.$route.query
    if(id) {
      this.taskForm.actId = id
      console.log('ssss',this.$store.state.active.charge)
    }
  },
  destroyed(){
  }
}
</script>

<style lang="less" scoped>
.form-box{
  width: 100%;
  margin-top: 20px;
}
.form-label{
  font-size: 16px;
  color: #333;
}
.base-input{
  position: relative;
	flex: none;
	display: flex;
	align-items: center;
	width:200px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.base-txt{
  position: absolute;
  right: -25px;
}
.base-upload{
  display: flex;
}
.pic-text{
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.pic-upload{
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  .upload-icon{
    font-size: 30px;
    line-height: 70px;
    color: #666;
    font-weight: bold;
  }
  .upload-txt{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    color: #fff;
    background: #666;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
.notice-editor{
  height: 500px;
}
</style>
