<template>
  <div class="container">
		<my-header></my-header>
    <div class="user-content">
			<div class="base-info">
				<div class="base">
					<p>主体对象（活动的主体对象）
					</p>

					<div class="btn-list">
						<div class="bar-btn">
							<a  href="./student.xlsx" download="学生模板.xlsx">下载表格模板</a>
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
						style="width: 100%;marginTop:20px;"
						:header-cell-style="{background:'#f5f5f5',color:'#333'}">

						<el-table-column
							type="selection"
							width="55">
						</el-table-column>

						<el-table-column
							width="350"
							align="center"
							label="学生姓名">
							<template slot-scope="scope">{{scope.row.studentName}}</template>
						</el-table-column>

						<el-table-column
							prop="studentCode"
							align="center"
							label="学籍号">
						</el-table-column>
						
						<el-table-column
							prop="cardSid"
							align="center"
							label="定位终端编号">
						</el-table-column>

						<el-table-column
							prop="guaNameOne"
							align="center"
							label="监护人1">
						</el-table-column>

						<el-table-column
							align="center"
							label="监护人1手机">
							<template slot-scope="scope">{{scope.row.guaMobileOne | phoneHide}}</template>
						</el-table-column>

						<el-table-column
							prop="guaNameTwo"
							align="center"
							label="监护人2">
						</el-table-column>

						<el-table-column
							align="center"
							label="监护人2手机">
							<template slot-scope="scope">{{scope.row.guaMobileTwo | phoneHide}}</template>
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

					<button class="save-back" @click="saveBack">返回</button>
				</div>
			</div>

			 <transition name="el-zoom-in-center">
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
import MyHeader from '@/components/my-header'
import AddDele from '@/components/add-dele'
import FormBox from './form-box'
import { formatDate } from '@/util/common'
import MyUpload from '@/components/my-upload'
import Active from '@/js/active'
import {activeInfo,studentImport,studentDelete,studentSave} from '@/api/active'
export default {
  name: 'mainstay',
  components: {
		MyHeader,AddDele,FormBox,MyUpload
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
    }
	},
	filters:{
		dateInit(val){
			return formatDate(val,'second')
		},
		phoneHide(tel){
			if(tel!='无'){
				return tel.substr(0, 3) + '****' + tel.substr(7);
			}else{
				return tel
			}
    }
	},
	methods:{
		//查询活动信息
		keySearchActive(id){
      activeInfo(id).then(res=>{
        if(res.status === 200){
					console.log(res)
					let active = new Active(res.data);
					this.list = active.studentList?active.initStudent():[]
					this.$store.dispatch('exercise/setStudentData',this.list);
        }
      })
    },
		planPreview(val){
			let data = {
				actId:this.$route.query.id,
				file:val[0].file,
				schoolId:this.$route.query.school
			}
			studentImport(data).then(res=>{
				if(res.status === 200 ){
					this.$refs.upload.clearFile()
					this.keySearchActive(this.$route.query.id)
				}
			})
		},
		addClick(){
			this.action='write'
			this.showDailog=true
		},
		saveBack(){
			this.$router.push({
        path: '/create',
        query: {
          id: this.$route.query.id
        }
      })
		},
		addList(data){
			let list = Object.assign(data,{actId:this.$route.query.id,schoolId:this.$route.query.school});
			studentSave(list).then(res=>{
				console.log(res)
				if(res.status===200){
					this.keySearchActive(this.$route.query.id)
				}
			})
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
			let list=this.deleList.map(v=>{
				return {
					actId:this.$route.query.id,
					studentCode:v.studentCode,
					cardSid:v.cardSid
				}
			})
			studentDelete(list).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.keySearchActive(this.$route.query.id)
				}
			})
		},
	},
  mounted(){
		this.keySearchActive(this.$route.query.id)
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
	margin-top: 20px;
  background: #fff;
  box-shadow:0px 0px 2px #ddd;
}
.base{
	width: 1400px;
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
.save-back{
	width: 120px;
	height: 36px;
	margin: 30px;
  line-height: 36px;
  border-radius: 4px;
  color: #fff;
  background: #2459f0;
  cursor: pointer;
}
.action-text{
	max-height: 90px;
	overflow: hidden;
}
.btn-list{
	display: flex;
	align-items: center;
}
.bar-btn{
  width: 120px;
	height: 36px;
	font-size: 14px;
	color: #fff;
  background: #2459f0;
	line-height: 36px;
	margin-right: 10px;
	border-radius: 4px;
	border: 1px solid #2459f0;
  cursor: pointer;
  a{
		padding-right: 6px;
		color: #fff;
  }
}
</style>
