<template>
  <div class="container-org">
		<my-header @set="setUserList"></my-header>

    <div class="content">
			<div class="content-tree">
				<div class="tree-title">组织机构</div>
				<div class="tree-list">
					<my-tree :list="sponsorTree" @edit="cardEditor"></my-tree>
					<my-tree :list="undertakeTree" @edit="cardEditor"></my-tree>
					<my-tree :list="supplyTree" @edit="cardEditor"></my-tree>
					<my-tree :list="regulatorTree" @edit="cardEditor"></my-tree>
				</div>
			</div>
			<div class="content-form">
				<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
					<el-tab-pane label="机构详情" name="first">
						<org-detail :detail="detail" v-if="detail.officeName" :enableEditor="enableEditor" @detele="orgDetele" @editor="orgEditor"></org-detail>
						<div v-else>
							<tab-tree :treeData="treeData"></tab-tree>
						</div>
					</el-tab-pane>
					<el-tab-pane label="机构添加" name="second" v-if="enableEditor">
						<form-box ref="form" :treeData="treeData" :educationTree="educationTree" @addSucc="addSucssce" @close="formClose"></form-box>
					</el-tab-pane>
				</el-tabs>
			</div>
    </div>

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
import MyHeader from '@/components/my-header'
import MyTree from '@/components/my-tree'
import FormBox from './form-box'
import OrgDetail from './org-detail'
import TabTree from './tab-tree'
import {TYPE} from '@/config/config'
import {officeTree,officeDelete} from '@/api/organization'
export default {
  name: 'organization',
  components: {
		MyHeader,FormBox,MyTree,OrgDetail,TabTree
  },
  data(){
    return {
			educationTree:[],
			treeData:[],
			sponsorTree:[],
			undertakeTree:[],
			supplyTree:[],
			regulatorTree:[],
			centerDialogVisible:false,
			activeName:'first',
			detail:{},
			userType:'',
			roleData:{}
    }
	},
	computed:{
		enableEditor(){
			if(this.userType === TYPE.YY){
				if(this.roleData.roleId && this.roleData.roleName==='主责任人'){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}
	},
	methods:{
		setUserList(data){
			this.userType = data.userType
			this.roleData = data.roleList[0]
		},
		formClose(){
			this.activeName='first'
		},
		handleClick(tab, event) {
			if(tab.name === 'second'){
				this.$refs.form.clearForm()
			}			
		},
		orgDetele(data){
			this.$confirm('删除该机构？', '提示', {
				confirmButtonText: '删除机构',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteOrganization(data.id)
			})
		},
		orgEditor(data){
			// console.log(data)
			this.activeName='second'
			this.$refs.form.editForm(data)
		},
		deleteOrganization(id){
			officeDelete(id).then(res=>{
				if(res.status===200){
					this.$notify({
						title: '成功',
						message: '删除机构成功!',
						type: 'success',
						duration: 2000
					});
					this.detail={}
					this.searchOffice()
				}
			})
		},
		addSucssce(data){
			this.searchOffice()
			this.activeName='first'
			this.detail=data
		},
		comfimDelete(){
			this.centerDialogVisible = false;
			this.deleteOrganization(this.deleData.officeId)
		},
		cardDele(data){
			this.centerDialogVisible = true;
			this.deleData = data
		},
		cardEditor(data){
			this.activeName='first'
			this.detail = data.parentId==='-1'?{}:data
		},
		searchEducation(){
			officeTree("14").then(res=>{
				// console.log(res)
				if(res.status===200){
					if(res.data.length){
						this.educationTree = res.data
					}
				}
			})
		},
		searchOffice(){
			officeTree().then(res=>{
				console.log(res)
				if(res.status===200){
					if(res.data.length){
						this.treeData = res.data
						this.supplyTree = [res.data[0]]
						this.sponsorTree = [res.data[1]]
						this.regulatorTree = [res.data[2]]
						this.undertakeTree = [res.data[3]]
					}
				}
			})
		},
	},
  mounted(){
		this.searchOffice()
		this.searchEducation()
  }
}
</script>

<style lang="less" scoped>
.container-org{
	width: 100%;
	height: 80%;
	padding-top: 80px;
}
.content{
	display: flex;
	justify-content: space-between;
	width: 1500px;
	height: 100%;
  margin: 40px auto 0;
}
.top-btn{
	display: flex;
	width: 1500px;
	margin: 0 auto;
	.add-btn{
		width: 82px;
		font-size: 14px;
		height: 36px;
		margin: 20px 0;
		line-height: 36px;
		border-radius: 4px;
		color: #fff;
		background: #2459f0;
		cursor: pointer;
		a{
			padding-right: 6px;
		}
	}
}
.content-tree{
	flex: none;
	width: 300px;
	margin-right: 40px;
	border-radius: 5px;
	background: #fff;
	overflow-y: auto;
	.tree-title{
		height: 50px;
		text-align: left;
		font-size: 18px;
		font-weight: bold;
		line-height: 50px;
		padding-left:30px;
		border-bottom: 1px solid #ccc;
	}
	.tree-list{
		padding-left:20px;
		margin-top: 20px;
	}
}
.content-form{
	border-radius: 5px;
	width: 100%;
	padding: 20px 40px;
	background: #fff;
}
.actions-list{
	min-height: 600px;
	display: flex;
	flex-flow: row wrap;
	&>li{
		width: 400px;
		height: 240px;
		margin-bottom: 30px;
	}
	.other-list{
		margin-left: 29px;
	}
}
.list-add{
	background: #fff;
	box-sizing: border-box;
	border: 2px dashed #ddd;
	border-radius: 8px;
	.list-router{
		display: inline-block;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
	span{
		display: block;
		margin-top: 10px;
		font-size: 14px;
		color: #666;
	}
	.plus-icon{
		margin-top: 20%;
		font-size: 60px;
		font-weight: bold;
		color: #999;
	}
}
</style>
