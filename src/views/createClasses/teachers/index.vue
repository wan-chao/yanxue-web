<template>
  <div class="container">
    <div class="user-content">
			<div class="base-info">
				<div class="base">
					<div class="btn-list">
						<div class="add-btn" @click="addClick">
							<a class="el-icon-plus"></a>
							<span>新增</span>
						</div>
						<div class="add-btn" @click="deleMore">
							<a class="el-icon-delete"></a>
							<span>删除</span>
						</div>
					</div>

					<el-table
						ref="multipleTable"
						:data="teacherList"
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
							align="center"
							label="教师姓名">
							<template slot-scope="scope">{{scope.row.teacherName}}</template>
						</el-table-column>

						<el-table-column
							align="center"
							label="教师手机号">
							<template slot-scope="scope">{{scope.row.mobileNum | phoneHide}}</template>
						</el-table-column>
						
						<el-table-column
							align="center"
							label="是否班主任">
							<template slot-scope="scope">{{scope.row.isMaster==='1'?'是':'否'}}</template>
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
				<form-box ref="form" v-show="showDailog" :userInfo="userInfo" @submit="addList" @close="showDailog=false"></form-box>
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
import FormBox from './form-box'
import {searchTeacher,deleteTeacher} from '@/api/classes'
export default {
	props:{
		classId:{
			type:String,
			default:''
		},
		userInfo:{
			type:Object,
			default:()=>{}
		},
	},
  components: {
		FormBox
  },
  data(){
    return {
      showDailog:false,
      centerDialogVisible:false,
			teacherList:[],
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
		//查询老师列表
		getTeacherList(classId){
      searchTeacher(classId).then(res=>{
        if(res.status === 200){
					console.log('查询老师',res)
					this.teacherList = res.data
        }
      })
    },
		//删除老师
		deleTeacherList(classId,teacherList){
      deleteTeacher(classId,teacherList).then(res=>{
        if(res.status === 200){
					console.log('删除老师',res)
					this.$notify({title: '成功',message: '删除老师信息成功',type: 'success'});
          this.teacherInit()
        }
      })
    },
		addClick(){
			this.showDailog=true
			this.$refs.form.init()
		},
		addList(){
			this.teacherInit()
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
		deleMore(){
			if(this.multipleSelection.length){
				this.deleList = this.multipleSelection
				this.centerDialogVisible=true;
			}else{
				this.$message({ message: '请先勾选要删除的数据',type: 'warning'});
			}
		},
		comfimDelete(){
			let list = []
			this.centerDialogVisible=false;
			this.deleList.forEach(v=>{
				list.push(v.teacherId)
			})
			let {classId} = this.$route.params
			if(classId) this.deleTeacherList(classId,list)
		},
		teacherInit(){
			let {classId} = this.$route.params
			if(classId) this.getTeacherList(classId)
		}
	},
  mounted(){
		this.teacherInit()
  }
}
</script>

<style lang="less" scoped>
@import '../../mainstay/style/mainstay.less';
.container{
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
.add-btn{
  width: 82px;
	height: 36px;
	margin-top: 20px;
	margin-right: 20px;
  line-height: 36px;
  border-radius: 4px;
  color: #fff;
  background: #2459f0;
  cursor: pointer;
  a{
    padding-right: 6px;
  }
}
</style>
