<template>
  <div class="container">
    <div class="user-content">
			<div class="base-info">
				<div class="base">

					<div class="btn-list">
						<div class="bar-btn">
							<a  href="./studentInfo.xlsx" download="学生信息模板.xlsx">下载表格模板</a>
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
						:data="studentList"
						tooltip-effect="dark"
						stripe
						@selection-change="handleSelectionChange"
						style="width: 100%;marginTop:20px;"
						:header-cell-style="{background:'#f5f5f5',color:'#333'}">

						<el-table-column
							type="selection"
							width="55">
						</el-table-column>

						<el-table-column
							prop="studentName"
							align="center"
							label="学生姓名">
						</el-table-column>

						<el-table-column
							prop="studentCode"
							align="center"
							label="学籍号">
						</el-table-column>

						<el-table-column
							align="center"
							label="监护人1">
							<template slot-scope="scope">{{scope.row.guardianName.split(',')[0]?scope.row.guardianName.split(',')[0]:'无'}}</template>
						</el-table-column>

						<el-table-column
							align="center"
							label="监护人1手机">
							<template slot-scope="scope">{{scope.row.guardianMobile.split(',')[0]?scope.row.guardianMobile.split(',')[0]:'无'|phoneHide}}</template>
						</el-table-column>

						<el-table-column
							align="center"
							label="监护人2">
							<template slot-scope="scope">{{scope.row.guardianName.split(',')[1]?scope.row.guardianName.split(',')[1]:'无'}}</template>
						</el-table-column>

						<el-table-column
							align="center"
							label="监护人2手机">
							<template slot-scope="scope">{{scope.row.guardianMobile.split(',')[1]?scope.row.guardianMobile.split(',')[1]:'无'|phoneHide}}</template>
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

			<transition name="move">
				<form-box ref="form" :type="action" v-show="showDailog"  @submit="addList" @close="showDailog=false"></form-box>
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
import AddDele from '@/components/add-dele'
import FormBox from './form-box'
import MyUpload from '@/components/my-upload'
import {searchStudent,studentImport,deleteStudent} from '@/api/classes'
export default {
	props:{
		classId:{
			type:String,
			default:''
		},
	},
  components: {
		AddDele,FormBox,MyUpload
  },
  data(){
    return {
			classId:'',
      showDailog:false,
      centerDialogVisible:false,
			studentList:[],
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
	methods:{
		//查询学生
		getStudentList(id){
      searchStudent(id).then(res=>{
        if(res.status === 200){
					console.log('查询学生',res)
					this.studentList = res.data
        }
      })
		},
		//删除学生
		deleteStudentList(classId,list){
			deleteStudent(classId,list).then(res=>{
				console.log('删除学生',res)
				if(res.status === 200){
					this.$notify({title: '成功',message: '删除学生信息成功',type: 'success'});
					this.getStudentList(classId)
				}
			})
		},
		planPreview(val){
			let data = {
				file:val[0].file,
				classId:this.classId
			}
			studentImport(data).then(res=>{
				if(res.status === 200 ){
					this.$refs.upload.clearFile()
					this.$notify({title: '成功',message: '导入学生信息成功',type: 'success'});
          this.getStudentList(this.classId)
				}else{
					this.deleteImg()
				}
			}).catch(()=>{
				this.deleteImg()
			})
		},
		deleteImg(){
      this.$refs.upload.clearFile()
    },
		addClick(){
			this.$refs.form.init()
			this.showDailog=true
		},
		addList(data){
			this.studentInit()
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
				return v.studentId
			})
			this.deleteStudentList(this.classId,list)
		},
		studentInit(){
			let {classId} = this.$route.params
			if(classId){
				this.classId = classId
				this.getStudentList(classId)
			}
		}
	},
  mounted(){
		this.studentInit()
  }
}
</script>

<style lang="less" scoped>
@import '../../mainstay/style/mainstay.less';
.container{
	width: 100%;
	padding-top: 0px;
}
.user-content{
	width: 100%;
}
.base-info{
	width: 100%;
}
.base{
	width: 100%;
}
.base h1{
	font-size: 26px;
	padding: 20px 0;
	border-bottom: 1px dashed #ccc;
}
</style>
