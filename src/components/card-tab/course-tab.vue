<template>
	<div class="course">
		<div class="course-tab">
			<ul class="course-left">
				<li v-for="(item,index) in list" :key="index" :class="{'tab-active':index === currentIndex}" @click="change(index)">{{item}}</li>
			</ul>
			<ul class="course-right">
				<li v-show="currentIndex === 0">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="courseMark1" :text="markList[0].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area" :disabled="disable||courseNotEditor" v-model="value1" placeholder="请输入研学目标..."></textarea>
				</li>
				<li v-show="currentIndex === 1">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="courseMark2" :text="markList[1].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area" :disabled="disable||courseNotEditor" v-model="value2" placeholder="请输入课程设计..."></textarea>
				</li>
				<li v-show="currentIndex === 2">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="courseMark3" :text="markList[2].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area" :disabled="disable||courseNotEditor" v-model="value3" placeholder="请输入人员配置..."></textarea>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import MarkBtn from '@/components/mark-btn'
import {STATUS_TYPE} from '@/config/config'
import {saveNote} from '@/api/active'
import _ from 'lodash'
export default {
	props:{
    disable:{
      type:Boolean,
      default:false
		},
		actStatus:{
      type:String,
      default:''
		},
		courseList:{
      type:Array,
      default:()=>[]
    },
		checkCourse:{
      type:Array,
      default:()=>[]
    },
  },
  components: {
		MarkBtn
  },
  data(){
    return {
			list:['研学目标','课程设计','人员配置'],
			currentIndex:0,
			value1:'',
			value2:'',
			value3:'',
			markList:[
				{checkId:'',checkCode:'0101',checkInfo:''},
				{checkId:'',checkCode:'0102',checkInfo:''},
				{checkId:'',checkCode:'0103',checkInfo:''},
			]
    }
	},
	computed:{
		courseData(){
			return [
				{courseId:'',itemCode:"01",itemName:this.list[0],itemValue:this.value1},
				{courseId:'',itemCode:"02",itemName:this.list[1],itemValue:this.value2},
				{courseId:'',itemCode:"03",itemName:this.list[2],itemValue:this.value3},
			]
		},
		courseNotEditor(){
			return this.actStatus===STATUS_TYPE.CHECK || this.actStatus===STATUS_TYPE.PASS || this.actStatus===STATUS_TYPE.BEGIN || this.actStatus===STATUS_TYPE.END
		},
		actId(){
			return this.$store.state.exercise.actId
		}
	},
	methods:{
		change(index){
			this.currentIndex = index
		},
		courseMark1(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[0].checkCode,
				checkName:this.list[0],
				checkId:this.markList[0].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		courseMark2(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[1].checkCode,
				checkName:this.list[1],
				checkId:this.markList[1].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		courseMark3(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[2].checkCode,
				checkName:this.list[2],
				checkId:this.markList[2].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)

		},
		activeSaveNote(form,index){
			saveNote(form).then(res=>{
				console.log(res)
				if(res.status===200){
					this.$notify({title: '成功',message: '批注填写成功！',type: 'success'});
				}
			})
		}
	},
	watch:{
		courseData:_.debounce(function (v) {
			this.$store.dispatch('exercise/setCourseData',v)
		}, 500),
		courseList(val){
			console.log('1111',val)
			if(val.length){
				val.forEach((v,i)=>{
					this[`value${i+1}`]=v.itemValue
				})
			}
		},
		checkCourse(val){
			val.forEach(v=>{
				let index = this.markList.findIndex(i=>{
					return i.checkCode === v.checkCode
				})
				if(index>=0){
					this.markList[index] = v
				}
			})
		}
	},
  mounted(){
  },
  destroyed(){
  }
}
</script>

<style lang="less" scoped>
.course{
	margin-top: 10px;
	width: 100%;
}
.course-tab{
	display: flex;
}
.course-left{
	width: 200px;
	margin-right: 40px;
	&>li{
		height: 50px;
		margin-bottom: 30px;
		line-height: 50px;
		font-size: 16px;
		border: 1px solid #888;
		border-radius: 5px;
		cursor: pointer;
	}
	.tab-active{
		color:#fff;
		background: #2f76df;
	}
}
.mark-box{
	position: absolute;
	right: 10px;
	top: 10px;
}
.course-right{
	position: relative;
	width: 100%;
}
.tab-area{
	width: 98%;
	height: 300px;
	padding: 10px;
	font-size: 16px;
	line-height: 24px;
	border: 1px solid #888;
	border-radius: 5px;
}
</style>
