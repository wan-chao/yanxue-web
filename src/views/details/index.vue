<template>
  <div class="container">
		<my-header @set="setUserList"></my-header>
    <div class="create-content">
      <p >{{taskForm.actName}}
				<button class="suggset-btn" v-if="actStatus==='0' || actStatus==='12'|| actStatus==='2'" @click="goSuggestion">查看审核意见 >></button>
			</p>
			
			<!-- 基本信息 -->
			<div class="base-info">
				<div class="base">
					<p>基本信息</p>
					<el-form ref="taskForm" :inline="true"  :model="taskForm" label-width="120px"  class="base-form" size="mini">
						<el-form-item label="活动名称 ：" class="form-type">
							<div class="base-select">
								<el-input  v-model="taskForm.actName" disabled ></el-input>
							</div>
						</el-form-item>

						<el-form-item label="主办方 ：" class="form-type">
							<div class="base-select">
								<el-select class="select-input" disabled v-model="taskForm.organizerId">
									<el-option
										v-for="item in sponsorList"
										:key="item.value"
										:label="item.officeName"
										:value="item.officeId">
									</el-option>
								</el-select>
							</div>
						</el-form-item>

						<el-form-item label="承办方 ：" class="form-type">
							<div class="base-select">
								<el-select class="select-input" disabled v-model="taskForm.undertakeId">
									<el-option
										v-for="item in undertakeList"
										:key="item.value"
										:label="item.officeName"
										:value="item.officeId">
									</el-option>
								</el-select>
							</div>
						</el-form-item>

						<el-form-item label="供应方 ：" class="form-type">
							<div class="base-select">
								<el-select class="select-input" disabled v-model="taskForm.supplyId">
									<el-option
										v-for="item in supplyList"
										:key="item.value"
										:label="item.officeName"
										:value="item.officeId">
									</el-option>
								</el-select>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div>

      <!-- 选项卡 -->
      <div class="active-tab">
				<card-tab :disable="editorEnable" :checkList="checkList" :actStatus="actStatus" :scheduleList="scheduleList" :courseList="courseList" :serverList="serverList" :planList="planList" :wholeList="wholeList"></card-tab>
      </div>

			<div v-if="hideSubmitBtn">
				<button class="save-btn" @click="submitForm('12')">通过</button>
				<button class="save-btn" @click="submitForm('0')">驳回</button>
			</div>

    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import CardTab from '@/components/card-tab'
import {STATUS_TYPE,TYPE,activeEnableEditor} from '@/config/config'
import {activeSave} from '@/api/active'
import {officeList} from '@/api/organization'
import Active from '@/js/active'
import {formatDate} from '@/util/common'
import {activeInfo} from '@/api/active'
import {uploadFiles} from '@/api/active'
import {selectCheckInfo} from '@/api/active'
import {check} from '@/api/active'
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
  name: 'detail',
  components: {
		MyHeader,CardTab
  },
  data(){
    return {
      taskForm:formData,
      orgDisable:false,
			underDisable:false,
      supplyDisable:false,
      actStatus:'', //活动状态
			sponsorList:[],//主办方列表
			undertakeList:[],//承办方列表
			supplyList:[],//供应方列表
			courseList :[],
			planList :[],
			wholeList :'',
			serverList:[],//服务保障
			scheduleList:[],//活动行程
			officeArr:[],
			checkList:[],
			userType:''
    }
	},
	computed:{
		editorEnable(){
			if(this.userType===TYPE.JG){
				return true
			}else{
				return false
			}
		},
		hideSubmitBtn(){
			if(this.actStatus===STATUS_TYPE.CHECK && this.editorEnable){
				return true
			}else{
				return false
			}
		},
	},
	methods:{
		setUserList(data){
			this.userType = data.userType
			activeEnableEditor(this.userType)?this.$router.push('/'):null
		},
		getSelectCheckInfo(id){
			selectCheckInfo(id).then(res=>{
				console.log(res)
				if(res.status===200){
					this.checkList= res.data.checkList?res.data.checkList:[]
				}
			})
		},
		goSuggestion(){
      this.$router.push({
        path: '/suggestion',
        query: {
          id: this.taskForm.actId
        }
      })
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
			this.$store.dispatch('active/setCharge',active.initOffice());
			this.$store.dispatch('exercise/setActId',this.$route.query.id);
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
			this.actStatus=''; //活动状态
			this.orgDisable=false;
			this.underDisable=false;
			this.supplyDisable=false;
			this.sponsorList=[]//主办方列表
			this.undertakeList=[]//承办方列表
			this.supplyList=[]//供应方列表
			this.courseList=[]
			this.planList=[]
			this.serverList=[];//服务保障
			this.scheduleList=[];//活动行程
			this.wholeList='';
			this.officeArr=[]
			this.$store.dispatch('exercise/setScheduleData',[]);
			this.$store.dispatch('exercise/setCourseData',[]);
			this.$store.dispatch('exercise/setServerData',[]);
			this.$store.dispatch('exercise/setPlanData',[]);
			this.$store.dispatch('exercise/setWholeData','');
			this.$store.dispatch('active/setCharge',[]);
			this.$store.dispatch('exercise/setActId','');
		},
		searchOffice(){
			this.sponsorList = [] //主办
			this.undertakeList = [] //承办
			this.supplyList = [] //供应
			officeList().then(res=>{
				// console.log(res)
				if(res.status===200){
					let list = res.data
					this.officeArr = res.data
					list.forEach(item => {
						if(item.officeType === TYPE.ZB){
							this.sponsorList.push(item)
						}else if(item.officeType === TYPE.CB){
							this.undertakeList.push(item)
						}else if(item.officeType === TYPE.GY){
							this.supplyList.push(item)
						}
					});
				}
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
		submitForm(val){
			if(val==='12'){
				this.$confirm('确定通过该方案？', '提示', {
					confirmButtonText: '确定通过',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.activeCheck(val)
				})
			}else{
				this.$confirm('驳回该方案？', '提示', {
					confirmButtonText: '驳回方案',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.activeCheck(val)
				})
			}
		},
		activeCheck(val){
			let data = {
				actId:this.taskForm.actId,
				actName:this.taskForm.actName,
				resultDesc:'',
				resultStatus:val,
			}
			check(data).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.$notify({
						title: '成功',
						message: '审核成功!',
						type: 'success',
						duration: 2000
					});
					this.$router.push('/venue')
				}
			})
		},
	},
  mounted(){
		console.log(this.$route.query)
		this.searchOffice()
		this.clearForm()
		if(!this.$route.query.id){
			return
		} 
		this.getSelectCheckInfo(this.$route.query.id)
		this.keySearchActive(this.$route.query.id)
  },
  destroyed(){
		this.clearForm()
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
