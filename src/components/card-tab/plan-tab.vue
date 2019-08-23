<template>
	<div class="course">
		<div class="course-tab">
			<ul class="course-left">
				<li v-for="(item,index) in list" :key="index" :class="{'tab-active':index === currentIndex}" @click="change(index)">
					<div class="left-span">{{item}}</div>
				</li>
			</ul>
			<ul class="course-right">
				<li v-show="currentIndex === 0">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="planMark1" :text="markList[0].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area" :disabled="disable||planNotEditor" v-model="value1" placeholder="必填项，请输入安全责任小组..."></textarea>
				</li>
				<li v-show="currentIndex === 1">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="planMark2" :text="markList[1].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area" :disabled="disable||planNotEditor"  v-model="value2" placeholder="必填项，请输入交通事故处应急处理..."></textarea>
				</li>
				<li v-show="currentIndex === 2">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="planMark3" :text="markList[2].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area" :disabled="disable||planNotEditor" v-model="value3" placeholder="必填项，请输入饮食卫生应急处理..."></textarea>
				</li>
				<li v-show="currentIndex === 3">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="planMark4" :text="markList[3].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area" :disabled="disable||planNotEditor" v-model="value4" placeholder="必填项，请输入人身意外伤害及疾病应急处理..."></textarea>
				</li>
				<li v-show="currentIndex === 4">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="planMark5" :text="markList[4].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area"  :disabled="disable||planNotEditor" v-model="value5" placeholder="必填项，请输入学生宿舍突发事故应急处理..."></textarea>
				</li>
				<li v-show="currentIndex === 5">
					<div class="mark-box" v-if="disable">
						<mark-btn @submit="planMark6" :text="markList[5].checkInfo"></mark-btn>
					</div>
					<textarea class="tab-area" :disabled="disable||planNotEditor" v-model="value6" placeholder="选填项，请输入其他..."></textarea>
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
		planList:{
      type:Array,
      default:()=>[]
    },
		checkPlan:{
      type:Array,
      default:()=>[]
    },
  },
  components: {
		MarkBtn
  },
  data(){
    return {
			list:['安全责任小组','交通事故处应急处理','饮食卫生应急处理','人身意外伤害及疾病应急处理','学生宿舍突发事故应急处理','其他'],
			currentIndex:0,
			value1:'',
			value2:'',
			value3:'',
			value4:'',
			value5:'',
			value6:'',
			markList:[
				{checkId:'',checkCode:'0401',checkInfo:''},
				{checkId:'',checkCode:'0402',checkInfo:''},
				{checkId:'',checkCode:'0403',checkInfo:''},
				{checkId:'',checkCode:'0404',checkInfo:''},
				{checkId:'',checkCode:'0405',checkInfo:''},
				{checkId:'',checkCode:'0406',checkInfo:''},
			]
    }
	},
	computed:{
		planData(){
			return [
				{planId:'',itemCode:'01',itemName:this.list[0],itemValue:this.value1},
				{planId:'',itemCode:'02',itemName:this.list[1],itemValue:this.value2},
				{planId:'',itemCode:'03',itemName:this.list[2],itemValue:this.value3},
				{planId:'',itemCode:'04',itemName:this.list[3],itemValue:this.value4},
				{planId:'',itemCode:'05',itemName:this.list[4],itemValue:this.value5},
				{planId:'',itemCode:'06',itemName:this.list[5],itemValue:this.value6},
			]
		},
		planNotEditor(){
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
		planMark1(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[0].checkCode,
				checkName:this.list[0],
				checkId:this.markList[0].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		planMark2(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[1].checkCode,
				checkName:this.list[1],
				checkId:this.markList[1].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		planMark3(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[2].checkCode,
				checkName:this.list[2],
				checkId:this.markList[2].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		planMark4(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[3].checkCode,
				checkName:this.list[3],
				checkId:this.markList[3].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		planMark5(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[4].checkCode,
				checkName:this.list[4],
				checkId:this.markList[4].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		planMark6(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[5].checkCode,
				checkName:this.list[5],
				checkId:this.markList[5].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		activeSaveNote(form){
			saveNote(form).then(res=>{
				console.log(res)
				if(res.status===200){
					this.$notify({title: '成功',message: '批注填写成功！',type: 'success'});
				}
			})
		}
	},
	watch:{
		planData:_.debounce(function (v) {
			this.$store.dispatch('exercise/setPlanData',v)
		}, 500),
		planList(val){
			if(val.length){
				val.forEach((v,i)=>{
					this[`value${i+1}`]=v.itemValue
				})
			}
		},
		checkPlan(val){
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
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		margin-bottom: 30px;
		font-size: 14px;
		border: 1px solid #888;
		border-radius: 5px;
		cursor: pointer;
	}
	.left-span{
		width: 70%;
		line-height: 20px;
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
	height: 450px;
	padding: 10px;
	font-size: 16px;
	line-height: 24px;
	border: 1px solid #888;
	border-radius: 5px;
}
</style>
