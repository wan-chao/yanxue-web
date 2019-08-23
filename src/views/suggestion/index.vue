<template>
  <div class="container">
		<my-header></my-header>
    <div class="user-content">
      <div class="base-info">
				<div class="base">
					<p>【{{actName}}】</p>
				</div>

				<ul class="top-list">
					<li>审核结果：<span>{{resultStatus==="0"?'被驳回':'审核通过'}}</span></li>
					<li>审核日期：<span>{{updateDate}}</span></li>
				</ul>
				
				<ul class="my-text">
					<li class="text-span">审核意见：</li>
					<li class="text-word">
						<div class="word-list" v-for="(item,index) in checkList" :key="index">
							<span>{{item.checkName}}：</span>
							<a>{{item.checkInfo}}</a>
						</div>
						<div class="word-list" v-if="!checkList.length">
							<span>无</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import {selectCheckInfo} from '@/api/active'
export default {
  name: 'suggestion',
  components: {
		MyHeader
  },
  data(){
    return {
			actName:'',
			resultStatus:'',
			updateDate:'',
			checkList:[]
    }
	},
	computed:{
	},
	methods:{
		getSelectCheckInfo(id){
			selectCheckInfo(id).then(res=>{
				console.log(res)
				if(res.status===200){
					this.actName= res.data.actName
					this.updateDate= res.data.checkDate
					this.resultStatus= res.data.resultStatus
					this.checkList= res.data.checkList?res.data.checkList:[]
				}
			})
		}
	},
  mounted(){
		if(!this.$route.query.id){
			this.$router.push('/venue')
			return
		}
		this.getSelectCheckInfo(this.$route.query.id)
  }
}
</script>

<style lang="less" scoped>
.user-content{
	width: 1688px;
  margin: 0 auto;
  padding-bottom: 20px;
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
	}
}
.top-list{
	width: 1400px;
	height: 80px;
	font-size: 18px;
	line-height: 80px;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	span{
		margin-left: 10px;
	}
}
.my-text{
	font-size: 18px;
	width: 1400px;
	margin: 0 auto;
	padding-bottom: 50px;
	display: flex;
}
.text-span{
	flex: none;
}
.text-word{
	text-align: left;
	padding-left: 10px;
	font-size: 16px;
	line-height: 24px;
}
.word-list{
	width: 200px;
}
</style>
