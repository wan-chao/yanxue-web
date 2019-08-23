<template>
 
	<div class="user-content">
		<div class="base-info">
			<div class="base">
			
				<add-dele @add="addClick" @dele="batchDele" v-show="!scheduleNotEditor && !disable"></add-dele>

				<div class="mark-box" v-if="disable">
					<mark-btn @submit="scheduleMark" :text="markList[0].checkInfo"></mark-btn>
				</div>

				<el-table
					ref="multipleTable"
					:data="list"
					tooltip-effect="dark"
					stripe
					@selection-change="handleSelectionChange"
					style="width: 100%;marginTop:20px;"
					:header-cell-style="{background:'#f5f5f5',color:'#333'}">

					<el-table-column
						v-show="!scheduleNotEditor"
						type="selection"
						width="55">
					</el-table-column>

					<el-table-column
						align="center"
						width="400"
						label="行动时段">
						<template slot-scope="scope">
							{{scope.row.beginTime}} 至 {{scope.row.endTime}}
						</template>
					</el-table-column>

					<el-table-column
						label="责任方">
						<template slot-scope="scope">
							{{officeInit(scope.row.chargeOffice)}}
						</template>
					</el-table-column>

					<el-table-column
						prop="arrivePlaceName"
						align="center"
						label="行动地点">
					</el-table-column>

					<el-table-column
						align="center"
						label="具体事项">
						<template slot-scope="scope">
							{{scope.row.workList}}
						</template>
					</el-table-column>

					<el-table-column
						label="操作"
						width="150"
						align="center">
						<template slot-scope="scope">
							<span class="edtior-icon" v-show="!scheduleNotEditor" @click="handleEdit(scope.$index, scope.row)"></span>
							<span class="dele-icon" v-show="!scheduleNotEditor" @click="handleDelete(scope.$index, scope.row)"></span>
						</template>
					</el-table-column>

				</el-table>

				<!-- <button class="save-back" @click="saveBack">保存并返回</button> -->
			</div>
		</div>

		<transition name="el-zoom-in-center">
			<schedule-form ref="form" :type="action"  v-if="showDailog" :disabled="scheduleNotEditor" @editor="editorList" @submit="addList" @close="showDailog=false"></schedule-form >
		</transition>

		<!-- 删除提示框 -->
		<el-dialog
			title="提示"
			:visible.sync="centerDialogVisible"
			width="30%"
			center>
			<span>确定删除数据吗？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="comfimDelete">确 定</el-button>
			</span>
		</el-dialog>
	</div>

</template>

<script>
import AddDele from '@/components/add-dele'
import ScheduleForm from './schedule-form'
import MarkBtn from '@/components/mark-btn'
import { formatDate } from '@/util/common'
import { STATUS_TYPE } from '@/config/config'
import {saveNote} from '@/api/active'
export default {
	props:{
    disable:{
      type:Boolean,
      default:false
		},
		actStatus:{
      type:String,
      default:''
		},
		scheduleList:{
      type:Array,
      default:()=>[]
    },
		checkSchedule:{
      type:Array,
      default:()=>[]
    },
  },
  components: {
		AddDele,ScheduleForm,MarkBtn
  },
  data(){
    return {
			index:-1,
			action:'write',
			showDailog:false,
			centerDialogVisible:false,
			list:[],
			multipleSelection:[],
			deleList:[],
			markList:[
				{checkId:'',checkCode:'0201',checkInfo:''},
			]
    }
	},
	filters:{
		dateInit(val){
			return formatDate(val,'second')
		},
	},
	computed:{
		chargeList(){
			return this.$store.state.active.charge
		},
		scheduleNotEditor(){
			return this.actStatus===STATUS_TYPE.CHECK || this.actStatus===STATUS_TYPE.BEGIN || this.actStatus===STATUS_TYPE.END
		},
		actId(){
			return this.$store.state.exercise.actId
		}
	},
	methods:{
		officeInit(val){
			let index=this.chargeList.findIndex(v=>{
				return v.officeId=val 
			})
			if(index>=0){
				return this.chargeList[index].officeName
			}else{
				return ''
			}
		},
		addClick(){
			this.action='write'
			this.showDailog=true
		},
		saveBack(){
			this.$store.dispatch('exercise/setScheduleData',this.list);
			let id = this.$route.params.id
			if(id){
				this.$router.push({
					path: '/add',
					query: {
						id: this.$route.params.id
					}
				})
			}else{
				this.$router.push('/add')
			}
		},
		addList(data){
			console.log('77',data)
			let fenceIds = data.fenceIds?data.fenceIds.join(','):''
			let list = Object.assign({},data,{fenceIds});
			this.list.push(list)
		},
		editorList(data){
			console.log(data)
			let fenceIds = data.fenceIds?data.fenceIds.join(','):''
			this.list.splice(this.index,1);
			let list = Object.assign({},data,{fenceIds});
			this.list.push(list)
		},
		batchDele(){
			this.deleList = []
			if(this.multipleSelection.length){
				this.centerDialogVisible=true;
				this.deleList.push(...this.multipleSelection);
			}else{
				this.$notify({
          title: '警告',
          message: '请先勾选要删除的数据',
					type: 'warning',
					duration:2000
        });
			}
		},
		//勾选改变时
		handleSelectionChange(val){
			this.multipleSelection=val
		},
		
		handleEdit(index,row){
			this.action="editor";
			this.index = index;
			this.showDailog = true
			this.$nextTick(()=>{
				this.$refs.form.editForm(row)
			})
		},
		handleDelete(index,row){
			this.deleList = []
			this.centerDialogVisible=true;
			this.deleList.push(row) 
		},
		comfimDelete(){
			this.centerDialogVisible=false;
			
			this.deleList.forEach(v=>{
				let index = this.list.findIndex(item=>{
					return item.place === v.place && item.text === v.text
				})
				this.list.splice(index,1);
			})
		},
		scheduleMark(val){
			let form = {
				actId:this.actId,
				checkName:'活动行程',
				checkCode:this.markList[0].checkCode,
				checkId:this.markList[0].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		activeSaveNote(form){
			saveNote(form).then(res=>{
				console.log(res)
				if(res.status===200){
					this.$notify({title: '成功',message: '批注填写成功！',type: 'success'});
				}
			})
		}
	},
	watch:{
		list(v){
			v.forEach((v,i)=>{
				v.stepId = `${i+1}`
			})
			this.$store.dispatch('exercise/setScheduleData',v);
		},
		scheduleList(val){
			console.log(val)
			if(val.length){
				this.list = val
			}
		},
		checkSchedule(val){
			val.forEach(v=>{
				let index = this.markList.findIndex(i=>{
					return i.checkCode === v.checkCode
				})
				if(index>=0){
					this.markList[index] = v
				}
			})
		}
	},
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.user-content{
	width: 100%;
	margin-top: 20px;
}

.record-search{
  width: 100%;
	margin-top: 20px;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.form-time{
  flex: 1,0;
  width: 450px;
}
.form-type{
	flex: none;
	padding-left: 10px;
	margin-right: 20px;
  width: 270px;
}
.search-btn{
  width: 81px;
  height: 38px;
  border-radius: 3px;
  font-size: 14px;
  color: #fff;
  line-height: 38px;
  background: #607df5;
  margin-left: 20px;
  margin-top: -3px;
  cursor: pointer;
}
.edtior-icon{
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0 5px;
  background: url('../../assets/images/bianji.png') no-repeat;
  background-size:100% 100%;
  cursor: pointer;
  &:hover{
    background: url('../../assets/images/bainji01.png') no-repeat;
    background-size:100% 100%;
  }
}
.dele-icon{
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0 5px;
  background: url('../../assets/images/dele.png') no-repeat;
  background-size:100% 100%;
  cursor: pointer;
  &:hover{
    background: url('../../assets/images/dele01.png') no-repeat;
    background-size:100% 100%;
  }
}

.base-info{
  width: 100%;
  background: #fff;
  box-shadow:0px 0px 2px #ddd;
}
.base{
	width: 90%;
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
.action-text{
	max-height: 90px;
	overflow: hidden;
}
.mark-box{
	text-align: right;
}
</style>
