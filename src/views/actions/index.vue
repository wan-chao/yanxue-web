<template>
  <div class="container">
		<my-header @set="setUserList" ></my-header>
    <div class="content">
			<search-bar @search="keywordSearch"></search-bar>

			<ul class="actions-list">
				<li class="list-add" @click="goAdd">
					<div class="list-router">
						<span class="el-icon-plus plus-icon"></span>
						<span>新增活动</span>
					</div>
				</li>
				<li :class="{'other-list':index!=3}" v-for="(item,index) in list" :key="index">
					<action-card :card="item"></action-card>
				</li>
			</ul>
			<my-page :size="size" :total="pageLen" @change="pageChage"></my-page>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import MyPage from '@/components/my-page'
import SearchBar from './search-bar'
import ActionCard from './action-card'
import {activeList} from '@/api/active'
import {TYPE,activeEnableEditor} from '@/config/config'
import {STATUS_TYPE} from '@/config/config'

export default {
  name: 'actions',
  components: {
		MyHeader,MyPage,SearchBar,ActionCard
  },
  data(){
    return {
			list:[],
			size:7,
			allData:[],
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
			activeEnableEditor(this.userType)?this.searchActiveList():this.$router.push('/')
		},
		goAdd(){
      this.$router.push('/create')
		},
		searchActiveList(keyword='',actStatus=''){
			activeList(keyword,actStatus).then(res=>{
				console.log(res)
				if(res.status===200){
					this.allData = res.data
					this.list = this.allData.slice(0,this.size)
				}
			})
		},
		keywordSearch(type,keyword){
			this.searchActiveList(keyword,type)
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
.content{
	width: 1688px;
	margin: 0 auto;
  padding-bottom: 20px;
}
.actions-list{
	min-height: 600px;
	display: flex;
	flex-flow: row wrap;
	&>li{
		width: 400px;
		height: 400px;
		margin-bottom: 30px;
	}
	.other-list{
		margin-left: 29px;
	}
	.more-list{
		margin-right: 26px;
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
		margin-top: 40%;
		font-size: 60px;
		font-weight: bold;
		color: #999;
	}
}
</style>
