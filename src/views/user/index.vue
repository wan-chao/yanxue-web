<template>
  <div class="container">
		<my-header @set="setUserList"></my-header>
    <div class="user-content">
			<div class="top-bar">
				<el-form ref="form" label-position="left"  class="record-search" size="mini">
					<el-form-item label="机构类型 ：" class="form-type" v-show="enableSearch">
						<div class="base-input">
							<el-select v-model="officeId"  clearable  placeholder="--全部类型--">
								<el-option
									v-for="item in officeList"
									:key="item.value"
									:label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
					</el-form-item>
					<el-form-item label="姓名 ：" class="form-type">
						<div class="base-input">
							<el-input v-model="userName" clearable placeholder="请输入关键字"></el-input>
						</div>
					</el-form-item>
					<div class="search-btn" @click="search">搜索</div>
				</el-form>
				<div class="btn-list" v-if="enableEditor">
					<add-dele @add="addClick" @dele="batchDele"></add-dele>
				</div>
			</div>

			<el-table
				ref="multipleTable"
				:data="list"
				tooltip-effect="dark"
				stripe
				@selection-change="handleSelectionChange"
				style="width: 100%;  height: 600px;marginTop:20px;"
				:header-cell-style="{background:'#f5f5f5',color:'#333'}">

				<el-table-column
					type="selection"
					width="55">
				</el-table-column>

				<el-table-column
					align="center"
					width="100"
					label="类型">
					<template slot-scope="scope">{{scope.row.userType | userInit}}</template>
				</el-table-column>

				<el-table-column
					prop="officeName"
					align="center"
					label="机构名称">
				</el-table-column>
				
				<el-table-column
					prop="loginName"
					align="center"
					label="登录名">
				</el-table-column>

				<el-table-column
					prop="userName"
					align="center"
					label="姓名">
				</el-table-column>

				<el-table-column
					align="center"
					label="联系方式">
					<template slot-scope="scope">{{ scope.row.mobile | phoneHide}}</template>
				</el-table-column>

				<el-table-column
					width="150"
					align="center"
					label="权限">
					<template slot-scope="scope">{{ scope.row.roleList.map(v=>v.roleName).join(',') }}</template>
				</el-table-column>

				<el-table-column
					v-if="enableEditor"
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
				<form-box v-show="showDailog" ref="form" @sucssce="addSucssce" :roles="roles" @close="showDailog=false"></form-box>
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
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import MyPage from '@/components/my-page'
import AddDele from '@/components/add-dele'
import FormBox from './form-box'
import {OFFICE_LIST,TYPE,organizationType} from '@/config/config'
import {userList,userDelete,roleList} from '@/api/user'

export default {
  name: 'user',
  components: {
		MyHeader,MyPage,AddDele,FormBox
  },
  data(){
    return {
			list:[],
			officeList:OFFICE_LIST,
      showDailog:false,
			centerDialogVisible:false,
			multipleSelection:[],
			deleList:[],
      officeId:'', 
			userName:'',
			roles:[],
			allData:[],
			size:10,
			roleData:{},
			userType:''
    }
	},
	computed:{
		pageLen(){
			return this.allData.length
		},
		enableSearch(){
			if(this.userType === TYPE.YY){
				return true
			}else{
				return false
			}
		},
		enableEditor(){
			if(this.roleData.roleId && this.roleData.roleName==='主责任人'){
				return true
			}else{
				return false
			}
		}
	},
	filters:{
		userInit(data){
			return organizationType(data)
		},
		phoneHide(tel){
			if(tel){
				return tel.substr(0, 3) + '****' + tel.substr(7);
			}else{
				return '无'
			}
    }
	},
	methods:{
		setUserList(data){
			this.userType = data.userType
			this.roleData = data.roleList[0]
		},
		search(){
			userList(this.userName,this.officeId).then(res=>{
				console.log(res)
				if(res.status===200){
					this.allData = res.data
					this.list = this.allData.slice(0,this.size)
				}
			})
		},
		addSucssce(){
			this.search()
		},
		getRoleList(){
			roleList().then(res=>{
				// console.log('1111',res)
				if(res.status===200){
					let list = res.data
					this.roles = list.map(v=>{
						return {
							roleName:v.roleName,
							roleId:v.roleId,
							roleType:v.roleType,
							roleDesc:v.roleDesc
						}
					})
					console.log('888',this.roles)
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
		comfimDelete(){
			this.centerDialogVisible=false;
			
			let parm = this.deleList.map(v=>{
				return v.loginId;
			}).join(',')

			userDelete(parm).then(res=>{
				console.log(res)
				if(res.status===200){
					this.$notify({
						title: '成功',
						message: '删除用户成功!',
						type: 'success',
						duration: 2000
					});
					this.search()
				}	
			})
	
		},
		pageChage(val){
			this.list = this.allData.slice((val-1)*this.size,val*this.size)
		}
	},
  mounted(){
		this.search()
		this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.user-content{
	width: 1500px;
  margin: 0 auto;
  padding-bottom: 20px;
}

.record-search{
  display: flex;
  flex-flow: row wrap;
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
</style>
