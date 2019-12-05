<template>
  <div class="container">
		<my-header @set="setUserInfo" ></my-header>
    <div class="user-content">
			<div class="base-info">
				<div class="base">
					<h1>工作人员信息表</h1>

					<div class="btn-list">
						<div class="bar-btn">
							<a  href="./placeInfo.xlsx" download="老师模板.xlsx">下载表格模板</a>
						</div>

						<div class="bar-btn">
							<my-upload ref="upload" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @preview="planPreview">
								<span>上传表格</span>
							</my-upload>
						</div>

						<add-dele @add="addClick" @dele="batchDele"></add-dele>
					</div>
				

					<el-table
						ref="multipleTable"
						:data="list"
						tooltip-effect="dark"
						stripe
						@selection-change="handleSelectionChange"
						style="width: 100%;height: 550px;marginTop:20px;"
						:header-cell-style="{background:'#f5f5f5',color:'#333'}">

						<el-table-column
							type="selection"
							width="55">
						</el-table-column>

						<el-table-column
							width="350"
							align="center"
							:label="this.officeType==='12'?'机构名称（旅行社）':'机构名称（研学基地营地）'">
							<template slot-scope="scope">{{scope.row.officeName}}</template>
						</el-table-column>

						<el-table-column
							prop="teacherName"
							align="center"
							label="教师姓名">
						</el-table-column>
						
						<el-table-column
							align="center"
							label="手机">
							<template slot-scope="scope">{{scope.row.mobileNum | phoneHide}}</template>
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
				</div>
			</div>

			<my-page :size="size" :total="pageLen" @change="pageChage"></my-page>

			<transition name="move">
				<form-box ref="form" v-show="showDailog" :userInfo="userInfo"  @submit="addList" @close="showDailog=false"></form-box>
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
import AddDele from '@/components/add-dele'
import FormBox from './form-box'
import MyPage from '@/components/my-page'
import MyUpload from '@/components/my-upload'
import {teacherList,teacherImport,teacherDelete} from '@/api/teacher.js'
export default {
  components: {
		MyHeader,AddDele,FormBox,MyUpload,MyPage
  },
  data(){
    return {
      showDailog:false,
      centerDialogVisible:false,
			list:[],
			allData:[],
			size:10,
			userInfo:{},
			multipleSelection:[],
			deleList:[],
    }
	},
	filters:{
		phoneHide(tel){
			if(tel!='无'){
				return tel.substr(0, 3) + '****' + tel.substr(7);
			}else{
				return tel
			}
    }
	},
	computed:{
		pageLen(){
			return this.allData.length
		},
	},
	methods:{
		setUserInfo(data){
			console.log('用户信息',data)
			this.userInfo=data
			this.officeId = data.officeId
			this.officeName = data.officeName
			this.officeType = data.userType
			this.searchTeacherList(data.officeId,data.officeName)
		},

		//教师查询
		searchTeacherList(officeId,officeName){
			teacherList(officeId,officeName).then(res=>{
				console.log('教师查询',res)
				if(res.status===200){
					this.allData = res.data
					this.list = this.allData.slice(0,this.size)
				}
			})
		},

		//导入老师
		importTeacherList(data){
			teacherImport(data).then(res=>{
				console.log('导入老师',res)
				if(res.status===200){
					this.$notify({title: '成功',message: '导入老师信息成功',type: 'success'});
					this.searchTeacherList(this.officeId,this.officeName)
				}
			})
		},

		//删除教师
		deleteTeacher(data){
			teacherDelete(data).then(res=>{
				console.log('删除教师',res)
				if(res.status===200){
					this.$notify({title: '成功',message: '删除老师信息成功',type: 'success'});
					this.searchTeacherList(this.officeId,this.officeName)
				}
			})
		},

		planPreview(val){
			let data = {
				file:val[0].file,
				officeId:this.officeId,
				officeType:this.officeType
			}
			this.importTeacherList(data)
		},

		addClick(){
			this.$refs.form.init()
			this.showDailog=true
		},
		addList(data){
			this.searchTeacherList(this.officeId,this.officeName)
		},
		batchDele(){
			if(this.multipleSelection.length){
				this.deleList = this.multipleSelection
				this.centerDialogVisible=true;
			}else{
				this.$message({ message: '请先勾选要删除的数据',type: 'warning'});
			}
		},
		//勾选改变时
		handleSelectionChange(val){
			this.multipleSelection=val
		},
		
		handleEdit(index,row){
			this.$refs.form.init()
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
			let list=this.deleList.map(v=>{
				return v.teacherId
			})
			this.deleteTeacher(list)
		},
		pageChage(val){
			this.list = this.allData.slice((val-1)*this.size,val*this.size)
		}
	},
  mounted(){
  }
}
</script>

<style lang="less" scoped>
@import '../mainstay/style/mainstay.less';
.base h1{
	font-size: 26px;
	padding: 20px 0;
	border-bottom: 1px dashed #ccc;
}
</style>
