<template>
  <div class="container">
		<my-header @set="setUserInfo"></my-header>
    <div class="user-content">
			<h1>{{classHasCreated?`${gradeDesc}${className}`:'新建班级'}}</h1>
			<base-form :hasCreated="classHasCreated" :userInfo="userInfo" @change="classNameChange"></base-form>
			<div class="active-tab">			
				<el-tabs v-model="activeName" type="card" stretch>
					<el-tab-pane label="教师信息" name="teacher" :disabled="!classHasCreated">
						<teachers :classId='classId' :userInfo="userInfo"></teachers>
					</el-tab-pane>
					<el-tab-pane label="学生信息" name="student" :disabled="!classHasCreated">
						<student></student>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import BaseForm from './base-form'
import Student from './students/index'
import Teachers from './teachers/index'
export default {
  components: {
		MyHeader,BaseForm,Student,Teachers
  },
  data(){
    return {
			userInfo:{},
			activeName:'',
			classId:'',
			gradeDesc:'',
			className:''
    } 
	},
	filters:{
	},
	computed:{
		classHasCreated(){
			return this.classId?true:false
		}
	},
	methods:{
		setUserInfo(data){
			this.userInfo = data
			console.log('99',this.userInfo)
		},
		classInfoInit(){
			let {classId,gradeDesc,className} = this.$route.params
			this.classId = classId?classId:''
			this.gradeDesc = gradeDesc
			this.className = className
			this.activeName = this.classHasCreated?'teacher':''
		},
		classNameChange(grade,className){
			this.gradeDesc = grade
			this.className = className
		}
	},
  mounted(){
		this.classInfoInit()
  }
}
</script>

<style lang="less" scoped>
.user-content{
	width: 1400px;
	margin: 0 auto;
	color: #333;
	&>h1{
		font-size: 26px;
		margin: 20px 0;
	}
	.active-tab{
		margin-top: 20px;
	}
}
</style>
