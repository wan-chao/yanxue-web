<template>
  <div class="container">
		 <my-header @set="setUserList"></my-header>
    <div class="user-content">
			<div class="top-bar">
				<el-form ref="form" label-position="left"  class="record-search" size="mini">
					<el-form-item label="按活动 ：" class="form-type">
						<div class="base-input">
							<el-select v-model="actId" class="form-input" clearable="" placeholder="全部活动">
								<el-option
									v-for="item in office"
									:key="item.actId"
									:label="item.actName"
									:value="item.actId">
								</el-option>
							</el-select>
						</div>
					</el-form-item>
					<div class="search-btn" @click="search">搜索</div>
				</el-form>
				
				<ul class="main-bar" v-if="show">
					<li class="add-btn" @click="add">
						<a class="el-icon-plus"></a>
						<span>新增</span>
					</li>
				</ul>
				
			</div>
			
			<div class="info-list">
				<div>新闻列表</div>
				<info-card v-for="(item,index) in list" :show="show" :key="index" :card="item" @detele="deteleSuc"></info-card>
				<p v-show="!list.length">暂无数据</p>
			</div>


			<my-page :size="size" :total="pageLen" @change="pageChage" v-show="list.length"></my-page>

		</div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import MyPage from '@/components/my-page'
import AddDele from '@/components/add-dele'
import InfoCard from './info-card'
import {cmsEnableEditor} from '@/config/config'
import {cmsList} from '@/api/information'
import {activeList} from '@/api/active'
export default {
  name: 'information',
  components: {
		MyHeader,MyPage,AddDele,InfoCard
  },
  data(){
    return {
			size:4,
			list:[],
			allData:[],
			centerDialogVisible:false,
			actId:'',
			office:[],
			show:false
    }
	},
	computed:{
		pageLen(){
			return this.allData.length
		},
	},
	methods:{
		setUserList(data){
			this.userType = data.userType
			this.show=cmsEnableEditor(this.userType)
		},
		add(){
			this.$router.push('/increase')
		},
		search(){
			this.searchCmsList(this.actId)
		},
		deteleSuc(){
			this.searchCmsList()
		},
		searchActiveList(keyword='',actStatus=''){
			activeList(keyword,actStatus).then(res=>{
				console.log(res)
				if(res.status===200){
					this.office = res.data
				}
			})
		},
		searchCmsList(id='',order=''){
			cmsList(id,order).then(res=>{
				console.log(res)
				if(res.status === 200){
					this.allData = res.data
					this.list = this.allData.slice(0,this.size)
				}
			})
		},
		pageChage(val){
			this.list = this.allData.slice((val-1)*this.size,val*this.size)
		}
	},
  mounted(){
		this.searchActiveList()
		this.actId=this.$route.query.id?this.$route.query.id:''
		this.searchCmsList(this.actId)
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
}
.base-input{
	flex: none;
	display: flex;
	align-items: center;
	width:150px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.info-list{
	width: 100%;
	height: 600px;
	margin-top: 20px;
	text-align: left;
	&>p{
		margin-top: 20px;
		font-size: 14px;
		color: #999;
		text-align: center;
	}
}
.main-bar{
  width: 100px;
  display: flex;
  margin:20px 0;
  font-size: 14px;
  color: #666;
}
.add-btn{
  width: 82px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  color: #fff;
  background: #2459f0;
  cursor: pointer;
}
</style>
