<template>
  <div class="card" @click="classesDetail">
		<div class="card-left">
			<img src="../../assets/images/classImgDef.png">
			<div class="left-tips">班主任</div>
		</div>
		<div class="card-right">
			<ul>
				<li>{{classInfo.gradeDesc+classInfo.className}}</li>
				<li class="right-num">{{classInfo.total?classInfo.total:'0'}}<span>人</span></li>
				<li class="right-txt">班主任：{{classInfo.teacherName?classInfo.teacherName:'无'}}</li>
			</ul>
		</div>
  </div>
</template>

<script>
export default {
	props:{
		classInfo:Object
	},
  components: {
  },
  data(){
    return {
    }
	},
	computed:{
	},
	methods:{
		classesDetail(){
			this.$router.push({
				name: 'createClasses',
				params: this.classInfo
			})
		}
	},
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.card{
	flex: none;
	display: flex;
	width: 260px;
	height: 100px;
	margin-bottom: 22px;
	background: #fff;
	border-radius: 5px;
	box-shadow: 0px 0px 3px #ddd;
	cursor: pointer;
}
.card-left{
	position: relative;
	flex: none;
	width: 100px;
	height: 100%;
	font-size: 12px;
	text-align: left;
	color: #fff;
	&>img{
		width: 100%;
		height: 100%;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	.left-tips{
		position: absolute;
		bottom: 0px;
		padding: 0 10px;
		width: calc(100% - 20px);
		height: 20px;
		line-height: 20px;
		background:rgba(0, 0, 0, 0.2);
		border-bottom-left-radius: 5px;
	}
}
.card-right{
	padding: 10px 20px;
	width: 100%;
	font-size: 18px;
	text-align: left;
	color: #313f66;
	.right-num{
		font-size: 20px;
		margin-top: 10px;
		&>span{
			font-size: 14px;
		}
	}
	.right-txt{
		font-size: 14px;
		color: #666666;
		margin-top: 15px;
	}
}
</style>
