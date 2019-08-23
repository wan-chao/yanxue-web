<template>
  <div class="container">
		<my-header @set="setUserList"></my-header>
    <div class="user-content">
			<div class="top-bar">
				<el-form ref="form" label-position="left" class="record-search" size="mini">
					<el-form-item label="终端状态 ：" class="form-type">
						<div class="base-input">
							<el-select v-model="status"  clearable  placeholder="--全部类型--">
								<el-option
									v-for="item in types"
									:key="item.value"
									:label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-form-item>
					 
					<div class="search-btn" @click="search">搜索</div>
				</el-form>
				<div class="btn-list">
					<add-dele @add="addClick" @dele="batchDele"></add-dele>
				</div>
			</div>

			<el-table
				ref="multipleTable"
				:data="list"
				tooltip-effect="dark"
				@selection-change="handleSelectionChange"
				stripe
				style="width: 100%;  height: 600px;marginTop:20px;"
				:header-cell-style="{background:'#f5f5f5',color:'#333'}">

				<el-table-column
					type="selection"
					width="55">
				</el-table-column>

				<el-table-column
					type="index"
					label="序号"
					align="center"
					width="80">
				</el-table-column>

				<el-table-column
					prop="cardName"
					align="center"
					label="终端名称">
				</el-table-column>

				<el-table-column
					prop="cardSid"
					align="center"
					label="终端编号">
				</el-table-column>
				
				<el-table-column
					prop="simId"
					align="center"
					label="SIM卡号">
				</el-table-column>

				<el-table-column
					prop="cardStatus"
					align="center"
					label="当前状态">
					<template slot-scope="scope">{{scope.row.cardStatus | cardStatus}}</template>
				</el-table-column>

				<!-- <el-table-column
					align="center"
					label="说明">
					<template>无</template>
				</el-table-column> -->

				<el-table-column
					label="历史记录"
					align="center">
					<template slot-scope="scope">
						<span class="record-span" @click="handleHistory(scope.$index, scope.row)">点击查看</span>
					</template>
				</el-table-column>

				<el-table-column
					label="操作"
					width="150"
					align="center">
					<template slot-scope="scope">
						<span class="edtior-icon" @click="handleEdit(scope.$index, scope.row)"></span>
						<span class="dele-icon" @click="handleDelete(scope.$index, scope.row)"></span>
					</template>
				</el-table-column>

			</el-table>

			<my-page :size="size" :total="pageLen" @change="pageChage"></my-page>

			<transition name="move">
				<form-box v-show="showDailog" :officeList="officeList" ref="form" @sucssce="FormSubmit"  @close="showDailog=false"></form-box>
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

		<el-dialog :visible.sync="dialogTableVisible">
			<el-table :data="historyList">
				<el-table-column property="beginTime" label="开始时间"></el-table-column>
				<el-table-column property="endTime" label="结束时间"></el-table-column>
				<el-table-column property="userName" label="使用人"></el-table-column>
				<el-table-column property="actName" label="活动"></el-table-column>
			</el-table>
		</el-dialog>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import MyPage from '@/components/my-page'
import AddDele from '@/components/add-dele'
import FormBox from './form-box'
import {officeList} from '@/api/organization'
import {DEVICE_TYPE,filterDeviceType} from '@/config/config'
import {deviceList,cardDelete,cardSave,cardHistory} from '@/api/device'
export default {
  name: 'device',
  components: {
		MyHeader,MyPage,AddDele,FormBox
  },
  data(){
    return {
			list:[],
			allData:[],
			officeList:[],
			deleList:[],
			multipleSelection:[],
			historyList: [],
			showDailog:false,
			dialogTableVisible:false,
			centerDialogVisible:false,
			status:'',
			size:7,
			types:DEVICE_TYPE
    }
	},
	computed:{
		pageLen(){
			return this.allData.length
		},
	},
	filters:{
		cardStatus(data){
			return filterDeviceType(data)
		}
	},
	methods:{
		setUserList(data){
		},
		search(){
			this.getDeviceList(this.status)
		},
		addClick(){
			this.showDailog=true
		},
		getDeviceList(status=''){
			deviceList(status).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.allData = res.data
					this.list = this.allData.slice(0,this.size)
				}
			})
		},
		getCardHistory(id){
			cardHistory(id).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.dialogTableVisible=true;
					this.historyList = res.data
				}
			})
		},
		addClick(){
			this.showDailog=true
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
		handleHistory(index,row){
			let id = row.cardSid;
			console.log(row)
			this.getCardHistory(id)
		},
		//勾选改变时
		handleSelectionChange(val){
			this.multipleSelection=val
		},
		handleEdit(index,row){
			this.$refs.form.editForm(row)
			this.showDailog = true
		},
		handleDelete(index,row){
			this.deleList = []
			this.centerDialogVisible=true;
			this.deleList.push(row) 
		},
		FormSubmit(){
			this.getDeviceList()
		},
		comfimDelete(){
			this.centerDialogVisible=false;
			
			let parm = this.deleList.map(v=>{
				return v.cardId;
			}).join(',')
			console.log(parm)
			cardDelete(parm).then(res=>{
				console.log(res)
				if(res.status===200){
					this.$notify({
						title: '成功',
						message: '删除设备成功!',
						type: 'success',
						duration: 2000
					});
					this.getDeviceList()
				}	
			})
		},
		searchOffice(){
			let supplyType = "13"; //供应
      this.officeList = []
			officeList().then(res=>{
				// console.log(res)
				if(res.status===200){
					let list = res.data
					list.forEach(item => {
						if(item.officeType === supplyType &&item.officeName!="供应方"){
							this.officeList.push(item)
						}
					});
				}
			})
		},
		pageChage(val){
			this.list = this.allData.slice((val-1)*this.size,val*this.size)
		}
	},
  mounted(){
		this.getDeviceList()
		this.searchOffice()
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
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.form-time{
  flex: 1,0;
  width: 450px;
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
.record-span{
	cursor: pointer;
}
</style>
