<template>
  <div class="container">
		<my-header @set="setUserList"></my-header>
    <div class="user-content">
			<div class="top-bar">
				<el-form ref="form" label-position="left"  class="record-search" size="mini">
					<el-form-item label="基地(营地)名称 ：" class="form-type">
						<div class="base-input">
							<el-select v-model="officeId"  clearable  placeholder="全部机构">
								<el-option
									v-for="item in officeList"
									:key="item.name"
									:label="item.officeName"
									:value="item.officeId">
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
				stripe
				@selection-change="handleSelectionChange"
				style="width: 100%;  height: 600px;marginTop:20px;"
				:header-cell-style="{background:'#f5f5f5',color:'#333'}">

				<el-table-column
					type="selection"
					width="55">
				</el-table-column>

				<el-table-column
					prop="officeName"
					label="基地(营地)名称">
				</el-table-column>

				<el-table-column
					prop="fenceName"
					label="电子围栏名称">
				</el-table-column>

				<el-table-column
					prop="fenceCode"
					label="编号">
				</el-table-column>
				
				<el-table-column
					prop="contactName"
					label="联系人">
				</el-table-column>

				<el-table-column
					label="联系方式">
					<template slot-scope="scope">{{ scope.row.mobileNum | phoneHide}}</template>
				</el-table-column>

				<!-- <el-table-column
					prop="masterName"
					label="预览">
				</el-table-column> -->

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
				<form-box v-show="showDailog" :officeList="officeList" ref="form"  @change="formChange"  @close="showDailog=false"></form-box>
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
import {fenceList,fenceDelete} from '@/api/fence'
import {officeList} from '@/api/organization'
export default {
  name: 'fence',
  components: {
		MyHeader,MyPage,AddDele,FormBox
  },
  data(){
    return {
			list:[],
      allData:[],
			size:7,
      showDailog:false,
      centerDialogVisible:false,
      officeList:[],
			officeId:'',
			multipleSelection:[],
			deleList:[],
    }
	},
	computed:{
		pageLen(){
			return this.allData.length
		},
	},
	filters:{
		phoneHide(tel){
      return tel.substr(0, 3) + '****' + tel.substr(7);
    }
	},
	methods:{
		setUserList(data){
		},
		search(){
			this.getFenceList(this.officeId)
		},
		addClick(){
			this.showDailog=true
		},
		getFenceList(officeId="",keyword=""){
			fenceList(officeId,keyword).then(res=>{
				console.log(res)
				if(res.status===200){
					this.allData = res.data
					this.list = this.allData.slice(0,this.size)
				}
			})
		},
		searchOffice(type='13'){
			officeList(type).then(res=>{
				console.log(res)
				if(res.status===200){
					this.officeList = res.data.filter((v)=>{
						return v.officeName != '供应方'
					})
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
				return v.fenceId;
			}).join(',')
			// console.log(parm)
			fenceDelete(parm).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.$notify({
						title: '成功',
						message: '删除电子围栏成功!',
						type: 'success',
						duration: 2000
					});
					this.getFenceList()
				}
			})
		},
		formChange(){
			this.getFenceList()
		},
		pageChage(val){
			this.list = this.allData.slice((val-1)*this.size,val*this.size)
		}
	},
  mounted(){
		this.searchOffice()
		this.getFenceList()
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
</style>
