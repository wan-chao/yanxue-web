<template>
  <div class="container">
		<my-header @set="setUserList"></my-header>
    <div class="create-content">
      <p>{{taskForm.actName==''?'新增活动':taskForm.actName}}
				<button class="suggset-btn" v-if="actStatus==='0' || actStatus==='12'|| actStatus==='2'" @click="goSuggestion">查看审核意见 >></button>
			</p>

			<!-- 基本信息 -->
			<div class="base-info">
				<div class="base">
					<p>基本信息</p>
					<el-form ref="taskForm" :inline="true" :rules="rules" :model="taskForm" label-width="120px"  class="base-form" size="mini">
						<el-form-item label="活动名称 ：" class="form-type" prop="actName" required>
							<div class="base-select">
								<el-input  v-model="taskForm.actName" :disabled="baseNotEditor" clearable placeholder="请输入活动名称"></el-input>
							</div>
						</el-form-item>

						<el-form-item label="主办方 ：" class="form-type" prop="organizerId" required>
							<div class="base-select">
								<el-select class="select-input" :disabled="baseNotEditor||orgDisable" v-model="taskForm.organizerId" placeholder="请选择主办方" @change="chargeOffice">
									<el-option
										v-for="item in sponsorList"
										:key="item.value"
										:label="item.officeName"
										:value="item.officeId">
									</el-option>
								</el-select>
								<router-link class="router-add" to="/organization" v-show="!baseNotEditor && !sponsorList.length">添加主办方</router-link>
							</div>
						</el-form-item>

						<el-form-item label="承办方 ：" class="form-type" prop="undertakeId" required>
							<div class="base-select">
								<el-select class="select-input" :disabled="baseNotEditor || underDisable" v-model="taskForm.undertakeId" placeholder="请选择承办方" @change="chargeOffice">
									<el-option
										v-for="item in undertakeList"
										:key="item.value"
										:label="item.officeName"
										:value="item.officeId">
									</el-option>
								</el-select>
								<router-link class="router-add" to="/organization" v-show="!baseNotEditor && !undertakeList.length">添加承办方</router-link>
							</div>
						</el-form-item>

						<el-form-item label="供应方 ：" class="form-type" prop="supplyId" required>
							<div class="base-select">
								<el-select class="select-input" :disabled="baseNotEditor || supplyDisable" v-model="taskForm.supplyId" placeholder="请选择供应方" @change="chargeOffice">
									<el-option
										v-for="item in supplyList"
										:key="item.value"
										:label="item.officeName"
										:value="item.officeId">
									</el-option>
								</el-select>
								<router-link class="router-add" to="/organization" v-show="!baseNotEditor && !supplyList.length">添加供应方</router-link>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<!-- 监管人 -->
			<div class="base-info" v-show="showMainstayRegulator">
				<regulator-man :status="!mainstayNotEditor" :actId="taskForm.actId" :techers="teacherList" :officeList="officeArr" @change="setPerson"></regulator-man>
			</div>

			<!-- 主体对象 -->
			<div class="base-info" v-show="showMainstayRegulator">
				<div class="base">
					<p>主体对象（活动的主体对象）</p>
					<student-tab :list="studentList" v-show="mainstayNotEditor"></student-tab>	
				</div>
				<div class="action-btn" v-show="!mainstayNotEditor">
					<div class="edit-btn" v-if="!studentData.length" @click="writeMainstay">编辑 >></div>
					<div class="btn-ok" v-else @click="editorMainstay">去修改 >></div>
				</div>
			</div>

      <!-- 选项卡 -->
      <div class="active-tab">
        <card-tab :actStatus="actStatus" :actId="taskForm.actId" :scheduleList="scheduleList" :courseList="courseList" :serverList="serverList" :planList="planList" :wholeList="wholeList"></card-tab>
      </div>

			<div class="add-footer" v-show="!hideSubmitBtn">
				<button class="save-btn" @click="saveForm('taskForm')">保存</button>
				<button class="save-btn" @click="submitForm('taskForm')">提交</button>
			</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MyHeader from '@/components/my-header'
import CardTab from '@/components/card-tab'
import StudentTab from './student-tab'
import RegulatorMan from './regulator-man'
import {STATUS_TYPE,TYPE} from '@/config/config'
import {activeSave} from '@/api/active'
import {officeList} from '@/api/organization'
import Active from '@/js/active'
import {formatDate} from '@/util/common'
import {activeInfo} from '@/api/active'
import {uploadFiles} from '@/api/active'
const fileIp = 'http://wx.whxingzs.com/api/hibl/'

const formData = {
	actId:'',
	actName:'',
	organizerId:'',
	undertakeId:'',
	supplyId:'',
	startTime:'',
	endTime:'',
	imgUrl:'',
	actStatus:'',
	actDocUri:'',
	actSchedulesList:[],
	actServiceList:[],
	emergencyPlan:[],
	course:[],
}

export default {
  name: 'create',
  components: {
		MyHeader,CardTab,RegulatorMan,StudentTab
  },
  data(){
    return {
			taskForm:formData,
			userData:{},
      orgDisable:false,
			underDisable:false,
      supplyDisable:false,
      actStatus:'', //活动状态
			sponsorList:[],//主办方列表
			undertakeList:[],//承办方列表
			supplyList:[],//供应方列表
			teacherList:[], //监管人列表
			studentList :[],
			courseList :[],
			planList :[],
			wholeList :'',
			serverList:[],//服务保障
			scheduleList:[],//活动行程
			officeArr:[],
      rules: {
				actName: [
					{ required: true, message: '请输入机构名称'}
				],
				organizerId: [
					{ required: true, message: '请选择主办方'},
				],
				undertakeId: [
					{ required: true, message: '请选择承办方'},
				],
				supplyId: [
					{ required: true, message: '请选择供应方'},
				],
			},
    }
	},
	computed:{
    ...mapState('exercise',[
			'courseData',
			'scheduleData',
			'serverData',
			'planData',
			'wholeData',
			'studentData'
		]),
		courseComplete(){
			return this.$store.getters['exercise/courseComplete']
		},
		scheduleComplete(){
			return this.$store.getters['exercise/scheduleComplete']
		},
		serverComplete(){
			return this.$store.getters['exercise/serverComplete']
		},
		planComplete(){
			return this.$store.getters['exercise/planComplete']
		},
		wholeComplete(){
			return this.$store.getters['exercise/wholeComplete']
		},
    showMainstayRegulator(){
			return this.actStatus===STATUS_TYPE.PASS || this.actStatus===STATUS_TYPE.BEGIN || this.actStatus===STATUS_TYPE.END
		},
		baseNotEditor(){
			return this.actStatus===STATUS_TYPE.CHECK || this.actStatus===STATUS_TYPE.PASS || this.actStatus===STATUS_TYPE.BEGIN || this.actStatus===STATUS_TYPE.END
		},
		mainstayNotEditor(){
			return this.actStatus===STATUS_TYPE.BEGIN || this.actStatus===STATUS_TYPE.END
		},
		hideSubmitBtn(){
			return this.actStatus===STATUS_TYPE.CHECK || this.actStatus===STATUS_TYPE.BEGIN || this.actStatus===STATUS_TYPE.END
		},
	},
	methods:{
		goSuggestion(){
      this.$router.push({
        path: '/suggestion',
        query: {
          id: this.taskForm.actId
        }
      })
    },
		saveForm(formName){
			this.taskForm.actStatus = STATUS_TYPE.SUBMIT;
			this.taskForm.actDocUri=this.wholeData
			this.taskForm.actSchedulesList=this.scheduleData
			this.taskForm.course=this.courseData
			this.taskForm.actServiceList=this.serverData
			this.taskForm.emergencyPlan=this.planData
			this.activitySave(this.taskForm)
		},
		
		submitForm(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(!this.courseComplete){
						this.$notify({title: '警告',message: '课程设计内容未填写完整！',type: 'warning'});
					}else if(!this.scheduleComplete){
						this.$notify({title: '警告',message: '活动行程内容未填写完整！',type: 'warning'});
					}else if(!this.serverComplete){
						this.$notify({title: '警告',message: '服务保障内容未填写完整！',type: 'warning'});
					}else if(!this.planComplete){
						this.$notify({title: '警告',message: '安全预案内容未填写完整！',type: 'warning'});
					}else if(!this.wholeComplete){
						this.$notify({title: '警告',message: '整体活动方案未上传！',type: 'warning'});
					}else{
						this.taskForm.actStatus = this.actStatus === STATUS_TYPE.PASS?STATUS_TYPE.PASS:STATUS_TYPE.CHECK
						this.taskForm.actDocUri=this.wholeData
						this.taskForm.actSchedulesList=this.scheduleData
						this.taskForm.course=this.courseData
						this.taskForm.actServiceList=this.serverData
						this.taskForm.emergencyPlan=this.planData
						console.log(this.taskForm)
						this.activitySave(this.taskForm)
					}
				}
			})
		},

		activitySave(formData){
			activeSave(formData).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.$notify({
						title: '成功',
						message: formData.actStatus=='10'?'保存活动成功!':'提交活动成功!',
						type: 'success',
						duration: 2000
					});
					this.$router.push('/actions')
				}
			})
		},
		writeMainstay(){
			this.$router.push({path: '/mainstay',query: {
				id: this.taskForm.actId,
				type:'write',
				school:this.taskForm.organizerId
			}})
		},
		editorMainstay(){
			this.$router.push({path: '/mainstay',query: {
				id: this.taskForm.actId,
				type:'editor',
				school:this.taskForm.organizerId
			}})
		},
		chargeOffice(){
			let list = []
			let o = this.sponsorList.findIndex(v=>{
				return v.officeId === this.taskForm.organizerId
			})
			let p = this.undertakeList.findIndex(v=>{
				return v.officeId === this.taskForm.undertakeId
			})
			let s = this.supplyList.findIndex(v=>{
				return v.officeId === this.taskForm.supplyId
			})
			if(o>=0) list.push(this.sponsorList[o])
			if(p>=0) list.push(this.undertakeList[p])
			if(s>=0) list.push(this.supplyList[s])

			this.$store.dispatch('active/setCharge',list);
		},
		setUserList(data){
			this.userData=data
		},
		setPerson(data){
			this.keySearchActive(this.taskForm.actId)
		},
		initForm(data){
			console.log('info',data)
			let active = new Active(data);
			if(!active.actStatus) return
			this.taskForm = Object.assign({},active.formData())
			this.actStatus = active.actStatus
			this.scheduleList = active.actSchedulesList?active.initSchedule():[]
			this.courseList = active.course?active.course:[]
			this.serverList = active.actServiceList?active.actServiceList:[]
			this.planList = active.emergencyPlan?active.emergencyPlan:[]
			this.wholeList = active.ossCourse?active.ossCourse:''
			this.$store.dispatch('exercise/setWholeData',active.actDocUri?active.actDocUri:'')
			this.teacherList = active.teacherList?active.teacherList:[]
			this.studentList = active.studentList?active.initStudent():[]
			this.$store.dispatch('exercise/setStudentData',this.studentList);
			this.$store.dispatch('active/setCharge',active.initOffice());
		},
		clearForm(){
			this.taskForm={
				actId:'',
				actName:'',
				organizerId:'',
				undertakeId:'',
				supplyId:'',
				startTime:'',
				endTime:'',
				imgUrl:'',
				actStatus:'',
				actDocUri:'',
				actSchedulesList:[],
				actServiceList:[],
				emergencyPlan:[],
				course:[],
			};
			this.$refs.taskForm.clearValidate()
			this.actStatus=''; //活动状态
			this.orgDisable=false;
			this.underDisable=false;
			this.supplyDisable=false;
			this.sponsorList=[{officeName:'',officeId:''}]//主办方列表
			this.undertakeList=[{officeName:'',officeId:''}]//承办方列表
			this.supplyList=[{officeName:'',officeId:''}]//供应方列表
			this.courseList=[]
			this.planList=[]
			this.teacherList=[]; //监管人列表
			this.serverList=[];//服务保障
			this.scheduleList=[];//活动行程
			this.wholeList='';
			this.officeArr=[]
			this.studentList =[]
			this.$store.dispatch('exercise/setScheduleData',[]);
			this.$store.dispatch('exercise/setCourseData',[]);
			this.$store.dispatch('exercise/setServerData',[]);
			this.$store.dispatch('exercise/setStudentData',[]);
			this.$store.dispatch('exercise/setPlanData',[]);
			this.$store.dispatch('exercise/setWholeData','');
			this.$store.dispatch('active/setCharge',[]);
		},
		searchOffice(){
			officeList().then(res=>{
				console.log(res)
				if(res.status===200){
					let list = res.data
					this.officeArr = res.data
					this.sponsorList = list.filter(v=>{
						return v.officeType === TYPE.ZB
					})
					this.undertakeList = list.filter(v=>{
						return v.officeType === TYPE.CB && v.officeName!='承办方'
					})
					this.supplyList = list.filter(v=>{
						return v.officeType === TYPE.GY && v.officeName!='供应方'
					})
					this.$refs.taskForm.clearValidate()

					if(!this.$route.query.id){
						let {userType,officeId} = this.userData
						if(!officeId) return
						if(userType === TYPE.ZB){
							this.orgDisable = true
							this.taskForm.organizerId = officeId
						}else if(userType === TYPE.CB){
							this.underDisable = true
							this.taskForm.undertakeId = officeId
						}else if(userType === TYPE.GY){
							this.supplyDisable = true
							this.taskForm.supplyId = officeId
						}
					}

				}else{
					this.sponsorList = [] //主办
					this.undertakeList = [] //承办
					this.supplyList = [] //供应
				}
			}).catch((err)=>{
				this.sponsorList = []
				this.undertakeList = []
				this.supplyList = []
			})
		},
		//查询活动信息
		keySearchActive(id){
      activeInfo(id).then(res=>{
        if(res.status === 200){
					this.searchOffice();
          this.initForm(res.data)
        }
      })
    },
	},
  mounted(){
		console.log(this.$route.query)
		this.clearForm();
		this.searchOffice()
		if(!this.$route.query.id){
			return
		} 
		this.keySearchActive(this.$route.query.id)
  },
  destroyed(){
  }
}
</script>

<style lang="less" scoped>
.create-content{
  width: 1400px;
	margin: 0 auto;
	padding-bottom: 20px;
	&>p{
		position: relative;
		padding: 20px 0;
		font-size: 26px;
		color: #313f66;
	}
	.suggset-btn{
		position: absolute;
		top: 15px;
		right:0px;
		height: 38px;
		width: 136px;
		color: #fff;
		background: none;
		font-size: 14px;
		background: #2459f0;
		border-radius: 6px;
		cursor: pointer;
	}
}
.base-info{
	position: relative;
	width: 100%;
  margin-bottom: 40px;
  background: #fff;
  box-shadow:0px 0px 2px #ddd;
}
.base{
  width: 1300px;
	height: 100%;
	margin: 0 auto;
	&>p{
		text-align: left;
		font-size: 18px;
		padding: 18px 0;
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
		.warn-span{
			color: red;
		}
	}
}
.base-form{
	margin-top: 10px;
	display: flex;
	flex-flow: row wrap;
	justify-content: flex-start;
}
.form-type{
	display: flex;
	align-items: center;
	justify-content: flex-start;
  width: 48%;
  height: 65px;
}
.base-select{
	position: relative;
	flex: none;
	display: flex;
	align-items: center;
	width:230px;
	margin-right: 80px;
	height: 38px;
	border-radius: 2px;
	border: 1px solid #ccc;
	.router-add{
		position: absolute;
		right: -90px;
		color: red;
	}
}
.select-input{
	width: 100%;
}
.active-tab{
  margin-top: 20px;
  width: 100%;
  padding: 20px 0;
  background: #fff;
}
.action-btn{
	position: absolute;
	top: 12px;
	right: 40px;
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
.btn-ok{
	display: inline-block;
	width: 106px;
	height: 30px;
	text-align: center;
	line-height: 30px;
	color: #fff;
	font-size: 14px;
	border-radius: 30px;
	margin-left: 10px;
	background: #42b983;
	cursor: pointer;
}
.add-footer{
	margin: 50px 0;
}
.save-btn{
	width: 120px;
	height: 36px;
	background: #2459f0;
	font-size: 14px;
	color: #fff;
	border-radius: 3px;
	margin: 0 30px;
	cursor: pointer;
}
</style>
