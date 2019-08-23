<template>
  <div class="container">
		<my-header @set="setUserList"></my-header>
    <div class="user-content">
			<div class="top-bar">
				<el-form ref="form" label-position="left"  class="record-search" size="mini">
					<el-form-item label="开始时间 ：" class="form-type">
						<div class="base-input">
							<el-date-picker
								v-model="start"
								type="date"
								placeholder="开始时间">
							</el-date-picker>
						</div>
					</el-form-item>
					<el-form-item label="结束时间 ：" class="form-type">
						<div class="base-input">
							<el-date-picker
								v-model="end"
								type="date"
								placeholder="结束时间">
							</el-date-picker>
						</div>
					</el-form-item>
					<el-form-item label="报警源 ：" class="form-type">
						<div class="base-input">
							<el-select v-model="type"  clearable  placeholder="--全部类型--">
								<el-option
									v-for="item in types"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-form-item>
					<div class="search-btn" @click="search">搜索</div>
				</el-form>
			</div>

			<el-table
				ref="multipleTable"
				:data="list"
				tooltip-effect="dark"
				stripe
				style="width: 100%;  height: 600px;marginTop:20px;"
				:header-cell-style="{background:'#f5f5f5',color:'#333'}">

				<el-table-column
					prop="recordTime"
					align="center"
					label="报警时间">
				</el-table-column>

				<el-table-column
					prop="actName"
					label="活动名称">
				</el-table-column>
				
				<el-table-column
					label="报警源">
					<template slot-scope="scope">
						<span >{{scope.row.sourceType | sourceType}}</span>
					</template>
				</el-table-column>

				<el-table-column
					prop="recorder"
					label="报警人">
				</el-table-column>

				<el-table-column
					label="事项">
					<template slot-scope="scope">
						<span >{{scope.row.handlerResult?scope.row.handlerResult:'无'}}</span>
					</template>
				</el-table-column>
				
				<el-table-column
					label="处理结果">
					<template slot-scope="scope">
						<span v-if="scope.row.handleStatus==='1'">已处理</span>
						<div v-if="scope.row.handleStatus==='0'" class="warn-icon">
							<input type="text" v-model="handlerResult" class="warn-input" v-if="enableEditor">
							<span  @click="handleEdit(scope.$index, scope.row)" v-if="enableEditor">处理</span>
							<span v-if="!enableEditor">未处理</span>
						</div>
					</template>
				</el-table-column>

			</el-table>

			<my-page :size="size" :total="pageLen" @change="pageChage"></my-page>
		</div>

		<el-dialog
			title="提示"
			:visible.sync="centerDialogVisible"
			width="30%"
			center>
			<span>确定提交处理结果吗？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="comfimDelete">确 定</el-button>
			</span>
		</el-dialog>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import MyPage from '@/components/my-page'
import {TYPE} from '@/config/config'
import {alarmList,handle} from '@/api/report'

export default {
  name: 'report',
  components: {
		MyHeader,MyPage
  },
  data(){
    return {
			types:[
				{label:'固定电子围栏',value:'1'},
				{label:'公众号',value:'3'},
			],
			list:[],
			start:'',
			end:'',
			type:'',
			allData:[],
			size:7,
			centerDialogVisible:false,
			currentItem:{},
			handlerResult:'',
			userType:''
    }
	},
	computed:{
		pageLen(){
			return this.allData.length
		},
		enableEditor(){
			if(this.userType===TYPE.JG){
				return true
			}else{
				return false
			}
		}
	},
	filters:{
		sourceType(val){
			if(val === '1'){
				return '固定电子围栏'
			}else if(val === '3'){
				return '公众号'
			}
		}
	},
	methods:{
		setUserList(data){
			this.userType = data.userType
			this.roleData = data.roleList[0]
		},
		search(){
			let start = this.start.getTime()
			let end = this.end.getTime()
			this.searchAlarmList(start,end,this.type)
		},
		searchAlarmList(start,end,type=''){
			alarmList(start,end,type).then(res=>{
				// console.log(res)
				if(res.status === 200){
					this.allData = res.data
					this.list = this.allData.slice(0,this.size)
				}
			})
		},
		comfimDelete(){
			// console.log(this.currentItem)
			handle(this.currentItem.actId,this.currentItem.recordId,'1',this.handlerResult).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.$notify({
						title: '成功',
						message: '处理报警成功',
						type: 'success',
						duration: 2000
					});
					this.currentItem={}
					this.centerDialogVisible =false
					this.search()
				}
			})
		},
		handleEdit(index,row){
			console.log(row)
			this.currentItem = row
			this.centerDialogVisible=true
		},
		pageChage(val){
			this.list = this.allData.slice((val-1)*this.size,val*this.size)
		}
	},
  mounted(){
		this.end = new Date();
		let start = this.end.getTime()-1000*60*60*24
		this.start=new Date(start);
		// console.log('777',this.start)
		this.search()
  }
}
</script>

<style lang="less" scoped>
.user-content{
	width: 1688px;
  margin: 0 auto;
  padding-bottom: 20px;
}

.record-search{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.warn-input{
	width: 100px;
	margin-right: 20px;
}
.form-type{
	flex: none;
	padding-left: 10px;
	margin-right: 20px;
	margin-top: 18px;
  width: 300px;
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
  cursor: pointer;
}

.top-bar{
	height: 80px;
	margin-top: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff;
	.btn-list{
		width: 200px;
	}
}
.base-input{
	flex: none;
	display: flex;
	align-items: center;
	width:150px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.warn-icon{
	color: red;
	cursor: pointer;
}
</style>
