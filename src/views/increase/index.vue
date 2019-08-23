<template>
  <div class="container">
		<my-header></my-header>
    <div class="user-content">
      <div class="base-info">
				<div class="base">
					<p>信息发布</p>
				</div>
				
				<div class="my-editor">
					<el-form 
						:model="taskForm"
						:rules="rules"
						ref="taskForm"
						label-width="150px"
						class="demo-ruleForm">

						<el-form-item label="选择活动：" prop="actId" required>
							<div class="base-input">
								<el-select v-model="taskForm.actId" class="form-input" placeholder="请选择活动" :disabled="disabled">
									<el-option
										v-for="item in office"
										:key="item.actId"
										:label="item.actName"
										:value="item.actId">
									</el-option>
								</el-select>
							</div>
						</el-form-item>


						<el-form-item label="文章标题：" prop="title" required>
							<div class="base-input">
								<el-input v-model="taskForm.title" placeholder="请输入文章标题(限20字以内)" :disabled="disabled"></el-input>
							</div>
						</el-form-item>

						<el-form-item label="关键词：" prop="author" required>
							<div class="base-input">
								<el-input v-model="taskForm.author" placeholder="不超过3个关键词，每个关键词不超过4个子，多个关键词以逗号区分" :disabled="disabled"></el-input>
							</div>
						</el-form-item>

						<el-form-item label="发布至：" v-show="!disabled">
							<el-checkbox v-model="taskForm.publishTo">公众号</el-checkbox>
						</el-form-item>
						
						<el-form-item label="公众号封面图片："  v-show="taskForm.publishTo && !disabled">
							<div class="base-updata">
								<div class="img-list">
									<my-upload ref="myUpload" @preview="imgPreview" v-show="!previewList.length">
										<ul class="el-updata">
											<li class="el-icon-plus up-img"></li>
											<li class="up-txt">点此上传</li>
										</ul>
									</my-upload>

									<el-image  v-for="(item,index) in previewList" :key="index" @click.native="deleteImg(item.name)" :src="item.url" class="avatar-img">
										<div slot="error">
											<i class="el-icon-picture-outline image-slot"></i>
										</div>
									</el-image>
								</div>
							</div>
						</el-form-item>

						<el-form-item label="内容：" prop="content" required>
							<div class="base-editor">
								<my-editor :text="editorText" @change="editorChange" v-if="!disabled"></my-editor>
								<div v-else class="editor-text" v-html="taskForm.content"></div>
							</div>
						</el-form-item>
					</el-form>
					
					<div class="footer-btn" v-if="!disabled">
						<el-button @click="closeDetail">取 消</el-button>
						<el-button type="primary" @click="submitForm('taskForm')">确 定</el-button>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import MyEditor from '@/components/my-editor'
import MyUpload from '@/components/my-upload'
import {cmsSave,cmsDetail} from '@/api/information'
import {activeList} from '@/api/active'
export default {
  name: 'increase',
  components: {
		MyHeader,MyEditor,MyUpload
  },
  data(){
    return {
			taskForm: {
				actId:'',
				title:'',
				author:'',
				content:'',
				image_url:'',
				publishTo:true
			},
			newsId:'',
			disabled:false,
			editorText:'',
			office:[],
			previewList:[],
			rules: {
				actId: [
					{ required: true, message: '请选择活动'}
				],
				title: [
					{ required: true, message: '请输入文章标题'},
					{ min: 1, max: 20, message: '限20字以内'}
				],
				author: [
					{ required: true, message: '请输入关键字'},
					{ min: 1, max: 14, message: '不超过3个关键词，每个关键词不超过4个子，多个关键词以逗号区分'}
				],
				content: [
					{ required: true, message: '请输入文章内容'}
				]
			}
    }
	},
	methods:{
		closeDetail(){
      this.$router.push('/information')
		},
		editorChange(data){
			this.taskForm.content=data
		},
		//上传图片预览
		imgPreview(list){
			this.previewList = list
		},
		deleteImg(name){
			let index = this.previewList.findIndex(v=>{
				return v.name === name
			})
			this.previewList.splice(index,1)
			this.$refs.myUpload.deleteFile(name)
		},
		searchActiveList(keyword='',actStatus=''){
			activeList(keyword,actStatus).then(res=>{
				console.log(res)
				if(res.status===200){
					this.office = res.data
				}
			})
		},
		//提交表单
		submitForm(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.taskForm.image_url = this.taskForm.publishTo&&this.previewList[0]?this.previewList[0].file:''
					console.log(this.taskForm)
					cmsSave(this.taskForm).then(res=>{
						console.log(res)
						if(res.status===200){
							this.$notify({
								title: '成功',
								message: '保存信息成功!',
								type: 'success',
								duration: 2000
							});
							this.$router.push('/information')
						}
					})
				}
			})
		},
		//重置表单
		resetForm() {
			this.taskForm.image_url="";
			this.taskForm.publishTo=true;
			this.editorText = '';
			this.$refs['taskForm'].resetFields();
		},
		init(){
			if(this.newsId){
				this.disabled = true
				cmsDetail(this.newsId).then(res=>{
					console.log(res)
					if(res.status === 200){
						this.taskForm.actId = res.data.actId
						this.taskForm.author = res.data.createBy
						this.taskForm.content = res.data.newsContent
						this.taskForm.title = res.data.newsTitle
					}
				})
			}else{
				this.disabled = false
			}
		}
	},
  mounted(){
		this.newsId=this.$route.query.id?this.$route.query.id:''
		this.searchActiveList()
		this.init()
  }
}
</script>

<style lang="less" scoped>
.user-content{
	width: 1688px;
  margin: 0 auto;
  padding-bottom: 20px;
}
.base-info{
  width: 100%;
	margin-top: 20px;
  background: #fff;
  box-shadow:0px 0px 2px #ddd;
}
.base{
	width: 1400px;
	height: 100%;
	margin: 0 auto;
	&>p{
		text-align: left;
		font-size: 18px;
		padding: 18px 0;
		border-bottom: 1px dashed #ccc;
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
		&>a{
			font-size: 14px;
			padding: 0 5px;
			color: #2459f0;
			cursor: pointer;
		}
    &>span{
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }
	}
}
.my-editor{
	width: 1400px;
	height: 700px;
	margin: 0 auto;
	margin-top: 20px;
	text-align: left;
}
.base-input{
	flex: none;
	display: flex;
	align-items: center;
	width:500px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.base-editor{
	min-height: 350px;
}
.form-input{
	width: 100%;
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
.img-list{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	&>.avatar-img{
		width: 70px;
		height: 70px;
		margin-left: 10px;
		border-radius: 5px;
		cursor: pointer;
	}
	.image-slot{
		font-size: 80px;
		color: #999;
	}
}
.el-updata{
	display: flex;
	flex-flow: column;
	width: 70px;
	height: 70px;
	border-radius: 5px;
	border: 1px solid #ccc;
}
.base-updata{
	width: 500px;
	flex: none;
	display: flex;
	flex-flow: column;
	align-items: flex-start;
	justify-content: flex-start;
	.up-img{
		font-size: 22px;
		margin-top: 15px;
		height: 48px;
		color: #929292;
	}
	.up-txt{
		width: 100%;
		height: 22px;
		line-height: 22px;
		background: #929292;
		color: #fff;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}
}
.editor-text{
	width: 100%;
	height: 100%;
	padding: 10px;
	color: #999;
	border: 1px solid #ccc;
}
</style>
