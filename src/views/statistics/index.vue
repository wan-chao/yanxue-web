<template>
  <div class="container">
		 <my-header @set="setUserList"></my-header>
    <div class="user-content">
			<div class="top-bar">
				<el-form ref="form" label-position="left"  class="record-search" size="mini">
					<el-form-item label="活动状态 ：" class="form-type">
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

					<el-form-item label="活动时间 ：" class="form-date">
						<div class="base-time">
							<el-date-picker
								v-model="start"
								type="datetime"
								placeholder="选择日期时间">
							</el-date-picker> 至
							<el-date-picker
								v-model="end"
								type="datetime"
								placeholder="选择日期时间">
							</el-date-picker>
							<!-- <el-date-picker
								v-model="time"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
							</el-date-picker> -->
						</div>
					</el-form-item>

					<div class="search-btn" @click="search">搜索</div>
				</el-form>
			</div>
			
			<div class="center-tab">

				<el-table
					ref="multipleTable"
					:data="list"
					tooltip-effect="dark"
					stripe
					class="tab-left"
					:header-cell-style="{background:'#f5f5f5',color:'#333'}">

					<el-table-column
						prop="actId"
						align="center"
						label="活动编号">
					</el-table-column>

					<el-table-column
						prop="actName"
						align="center"
						label="活动名称">
					</el-table-column>
					
					<el-table-column
						width="100"
						align="center"
						label="活动状态">
						<template slot-scope="scope">
							{{scope.row.actStatus | actType}}
						</template>
					</el-table-column>

					<el-table-column
						prop="actTime"
						align="center"
						label="活动日期">
					</el-table-column>

					<el-table-column
						prop="officeName"
						align="center"
						width="200"
						label="学校名称">
					</el-table-column>
					
					<el-table-column
						prop="studentTotal"
						align="center"
						width="100"
						label="学生人数">
					</el-table-column>

					<el-table-column
						prop="actLength"
						align="center"
						width="150"
						label="活动里程(含往返)">
					</el-table-column>

				</el-table>

				<ul class="tab-right">
					<li class="top-li">已完成活动统计</li>
					<li class="center-li">
						<div class="center-left">活动总次数(次)</div>
						<div class="center-right">{{finishAct.actTotal}}</div>
					</li>
					<li class="center-li">
						<div class="center-left">学生人数次数(人次)</div>
						<div class="center-right">{{finishAct.actStudent}}</div>
					</li>
					<li class="center-li">
						<div class="center-left">活动总里程数(公里)</div>
						<div class="center-right">{{finishAct.actLength}}</div>
					</li>
					<li class="center-li">
						<div class="center-left">人均行动里程数(公里)</div>
						<div class="center-right">{{finishAct.actStudent?(finishAct.actLength/finishAct.actStudent).toFixed(2):''}}</div>
					</li>
				</ul>

			</div>

			<my-page :size="size" :total="pageLen" @change="pageChage"></my-page>

		</div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import MyPage from '@/components/my-page'
import AddDele from '@/components/add-dele'
import {STATUS_TYPE} from '@/config/config'
import {formatDate} from '@/util/common'
import {staticActByDate,staticFinishAct} from '@/api/statistics'
export default {
  name: 'statistics',
  components: {
		MyHeader,MyPage,AddDele
  },
  data(){
    return {
			list:[],
			allData:[],
			start:'',
			end:'',
			size:7,
			status:'',
			finishAct:{},
      types:[
        {name:'待提交',value:STATUS_TYPE.SUBMIT},
        {name:'审核中',value:STATUS_TYPE.CHECK},
				{name:'被驳回',value:STATUS_TYPE.REFUSE},
				{name:'已过期',value:STATUS_TYPE.EXCEED},
        {name:'审核通过,筹备中',value:STATUS_TYPE.PASS},
        {name:'活动进行中',value:STATUS_TYPE.BEGIN},
        {name:'活动结束',value:STATUS_TYPE.END},
      ],
    }
	},
	filters:{
		actType(data){
			if(data === STATUS_TYPE.SUBMIT){
				return "待提交"
			}else if(data === STATUS_TYPE.CHECK){
				return "审核中"
			}else if(data === STATUS_TYPE.REFUSE){
				return "被驳回"
			}else if(data === STATUS_TYPE.PASS){
				return "筹备中"
			}else if(data === STATUS_TYPE.BEGIN){
				return "进行中"
			}else if(data === STATUS_TYPE.EXCEED){
				return "已过期"
			}else if(data === STATUS_TYPE.END){
				return "活动结束"
			}
		}
	},
	computed:{
		pageLen(){
			return this.allData.length
		},
	},
	methods:{
		setUserList(data){
		},
		search(){
			let beginTime = formatDate(this.start.getTime(),'second')
			let end = formatDate(this.end.getTime(),'second')
			
			let status = this.status
			staticActByDate(beginTime,end,status).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.allData = res.data
					this.list = this.allData.slice(0,this.size)
				}
			})
			staticFinishAct(beginTime,end,status).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.finishAct = res.data
				}
			})
		},
		pageChage(val){
			this.list = this.allData.slice((val-1)*this.size,val*this.size)
		}
	},
  mounted(){
		this.end = new Date();
		let start = this.end.getTime()-1000*60*60*24
		this.start=new Date(start);
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
.tab-left{
	flex: none;
	width: 70%;
	margin-top: 20px;
	height: 600px;
}
.tab-right{
	flex: none;
	width: 25%;
	margin-top: 20px;
	height: 500px;
	border: 1px solid #ccc;
	.top-li{
		height: 50px;
		line-height: 50px;
		font-size: 16px;
		border-bottom: 1px solid #ddd;
	}
	.center-li{
		display: flex;
		height: 90px;
		line-height: 90px;
		border-bottom: 1px solid #ddd;
		.center-left{
			width: 50%;
			border-right: 1px solid #ddd;
		}
		.center-right{
			width: 50%;
			text-align: center
		}
	}
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
	padding-left: 30px;
	margin-right: 20px;
	margin-top: 18px;
  width: 270px;
}
.form-date{
	flex: none;
	padding-left: 10px;
	margin-right: 50px;
	margin-top: 18px;
  width: 350px;
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
.center-tab{
	width: 100%;
	display: flex;
	justify-content: space-between;
}
.base-input{
	flex: none;
	display: flex;
	align-items: center;
	width:150px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.base-time{
	flex: none;
	display: flex;
	align-items: center;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.info-list{
	width: 100%;
	height: 600px;
	margin-top: 20px;
	text-align: left;
}
</style>
