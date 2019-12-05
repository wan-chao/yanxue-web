<template>
  <div class="container">
		<my-header @set="setUserList" ></my-header>
    <div class="content">
			<search-bar @search="keywordSearch"></search-bar>
			<div v-for="(list,index) in lists" :key="index" class="class-content">
				<h3 v-if="list.lists.length">{{list.name}}</h3>
				<div class="actions-list">
					<class-card v-for="(item,i) in list.lists" :key="i" :classInfo="item" :class="(i+1)%5?'card-start':''"></class-card>
				</div>
			</div>
    </div>
		<div class="card-add" @click="addClasses"></div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import SearchBar from './search-bar'
import ClassCard from './classCard'
import {searchClass} from '@/api/classes'

export default {
  components: {
		MyHeader,SearchBar,ClassCard
  },
  data(){
    return {
			lists:[
				{type:'1',name:'一年级',lists:[]},
				{type:'2',name:'二年级',lists:[]},
				{type:'3',name:'三年级',lists:[]},
				{type:'4',name:'四年级',lists:[]},
				{type:'5',name:'五年级',lists:[]},
				{type:'6',name:'六年级',lists:[]},
				{type:'7',name:'初一',lists:[]},
				{type:'8',name:'初二',lists:[]},
				{type:'9',name:'初三',lists:[]},
			],
    }
	},
	computed:{
	},
	methods:{
		setUserList(data){
			console.log('用户信息',data)
			this.schoolId=data.officeId
			this.searchClassList(data.officeId)
		},
		keywordSearch(type,keyword){
			this.searchClassList(this.schoolId,type)
		},
		addClasses(){
			this.$router.push('/createClasses')
		},
		searchClassList(schoolId,grade){
			searchClass(schoolId,grade).then(res=>{
				console.log('班级列表',res)
				if(res.status===200){
					Object.assign(this.$data, this.$options.data())
					if(!res.data.length){
						this.$message({message: '暂无班级信息',type: 'warning'});
					}
					this.classesForGrade(res.data)
				}
			})
		},
		//班级列表按年级分类
		classesForGrade(data){
			data.forEach(e => {
				this.lists.forEach(v=>{
					if(v.type===e.grade) v.lists.push(e);
				})
			});
		}
	},
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.content{
	width: 1390px;
	margin: 0 auto;
  padding-bottom: 20px;
}
.class-content{
	width: 100%;
	text-align: left;
	&>h3{
		font-size: 18px;
		color: #313f66;
		margin: 15px 0;
	}
}
.actions-list{
	display: flex;
	flex-flow: row wrap;
	align-items: flex-start;
}
.card-start{
	margin-right: 22px;
}
.card-add{
	position: fixed;
	right: 50px;
	bottom: 50px;
	width: 132px;
	height: 132px;
	background: url('../../assets/images/classAdd.png') no-repeat;
	background-size:100% 100%;
	cursor: pointer;
}
</style>
