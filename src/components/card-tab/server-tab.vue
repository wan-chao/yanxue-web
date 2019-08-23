<template>
	<div :class="disable?'server-disable':'server'">
		<ul class="list-item">
			<li class="top-left">服务项目</li>
			<li class="top-right">服务内容</li>
		</ul>
		<ul class="list-form">
			<li class="form-left">交通服务</li>
			<li class="form-right">
				<textarea class="area-form" :disabled="disable||serverNotEditor" v-model="value1" placeholder="必填项，请输入交通服务内容..."></textarea>
			</li>
			<div class="mark-box" v-if="disable">
				<mark-btn @submit="serverMark1" :text="markList[0].checkInfo"></mark-btn>
			</div>
		</ul>
		<ul class="list-form">
			<li class="form-left">餐饮服务</li>
			<li class="form-right">
				<textarea class="area-form" :disabled="disable||serverNotEditor" v-model="value2" placeholder="必填项，请输入餐饮服务内容..."></textarea>
			</li>
			<div class="mark-box" v-if="disable">
				<mark-btn @submit="serverMark2" :text="markList[1].checkInfo"></mark-btn>
			</div>
		</ul>
		<ul class="list-form">
			<li class="form-left">住宿服务</li>
			<li class="form-right">
				<textarea class="area-form" :disabled="disable||serverNotEditor" v-model="value3" placeholder="必填项，请输入住宿服务内容..."></textarea>
			</li>
			<div class="mark-box" v-if="disable">
				<mark-btn @submit="serverMark3" :text="markList[2].checkInfo"></mark-btn>
			</div>
		</ul>
		<ul class="list-form">
			<li class="form-left">保险</li>
			<li class="form-right">
				<textarea class="area-form" :disabled="disable||serverNotEditor" v-model="value4" placeholder="必填项，请输入保险内容..."></textarea>
			</li>
			<div class="mark-box" v-if="disable">
				<mark-btn @submit="serverMark4" :text="markList[3].checkInfo"></mark-btn>
			</div>
		</ul>
		<ul class="list-form">
			<li class="form-left">医疗服务</li>
			<li class="form-right">
				<textarea class="area-form" :disabled="disable||serverNotEditor" v-model="value5" placeholder="必填项，请输入医疗服务内容..."></textarea>
			</li>
			<div class="mark-box" v-if="disable">
				<mark-btn @submit="serverMark5" :text="markList[4].checkInfo"></mark-btn>
			</div>
		</ul>
		<ul class="list-form">
			<li class="form-left">导游讲解服务</li>
			<li class="form-right">
				<textarea class="area-form" :disabled="disable||serverNotEditor" v-model="value6" placeholder="必填项，请输入导游讲解服务内容..."></textarea>
			</li>
			<div class="mark-box" v-if="disable">
				<mark-btn @submit="serverMark6" :text="markList[5].checkInfo"></mark-btn>
			</div>
		</ul>
		<ul class="list-form">
			<li class="form-left">其他</li>
			<li class="form-right">
				<textarea class="area-form" :disabled="disable||serverNotEditor" v-model="value7" placeholder="选填项"></textarea>
			</li>
			<div class="mark-box" v-if="disable">
				<mark-btn @submit="serverMark7" :text="markList[6].checkInfo"></mark-btn>
			</div>
		</ul>
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
		serverList:{
      type:Array,
      default:()=>[]
    },
		checkServer:{
      type:Array,
      default:()=>[]
    },
  },
  components: {
		MarkBtn
  },
  data(){
    return {
			list:['交通服务','餐饮服务','住宿服务','保险','医疗服务','导游讲解服务','其他'],
			value1:'',
			value2:'',
			value3:'',
			value4:'',
			value5:'',
			value6:'',
			value7:'',
			markList:[
				{checkId:'',checkCode:'0301',checkInfo:''},
				{checkId:'',checkCode:'0302',checkInfo:''},
				{checkId:'',checkCode:'0303',checkInfo:''},
				{checkId:'',checkCode:'0304',checkInfo:''},
				{checkId:'',checkCode:'0305',checkInfo:''},
				{checkId:'',checkCode:'0306',checkInfo:''},
				{checkId:'',checkCode:'0307',checkInfo:''},
			]
    }
	},
	computed:{
		serverData(){
			return [
				{serviceName:'',serviceType:'01',serviceTypeName:this.list[0],serviceContent:this.value1,sort:''},
				{serviceName:'',serviceType:'02',serviceTypeName:this.list[1],serviceContent:this.value2,sort:''},
				{serviceName:'',serviceType:'03',serviceTypeName:this.list[2],serviceContent:this.value3,sort:''},
				{serviceName:'',serviceType:'04',serviceTypeName:this.list[3],serviceContent:this.value4,sort:''},
				{serviceName:'',serviceType:'05',serviceTypeName:this.list[4],serviceContent:this.value5,sort:''},
				{serviceName:'',serviceType:'06',serviceTypeName:this.list[5],serviceContent:this.value6,sort:''},
				{serviceName:'',serviceType:'07',serviceTypeName:this.list[6],serviceContent:this.value7,sort:''},
			]
		},
		serverNotEditor(){
			return this.actStatus===STATUS_TYPE.CHECK || this.actStatus===STATUS_TYPE.PASS || this.actStatus===STATUS_TYPE.BEGIN || this.actStatus===STATUS_TYPE.END
		},
		actId(){
			return this.$store.state.exercise.actId
		}
	},
	filters:{
	},
	watch:{
		serverData:_.debounce(function (v) {
			this.$store.dispatch('exercise/setServerData',v)
		}, 500),
		serverList(val){
			console.log('1111',val)
			if(val.length){
				val.forEach((v,i)=>{
					this[`value${i+1}`]=v.serviceContent
				})
			}
		},
		checkServer(val){
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
	methods:{
		serverMark1(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[0].checkCode,
				checkName:this.list[0],
				checkId:this.markList[0].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		serverMark2(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[1].checkCode,
				checkName:this.list[1],
				checkId:this.markList[1].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		serverMark3(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[2].checkCode,
				checkName:this.list[2],
				checkId:this.markList[2].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		serverMark4(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[3].checkCode,
				checkName:this.list[3],
				checkId:this.markList[3].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		serverMark5(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[4].checkCode,
				checkName:this.list[4],
				checkId:this.markList[4].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		serverMark6(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[5].checkCode,
				checkName:this.list[5],
				checkId:this.markList[5].checkId,
				checkInfo:val
			}
			this.activeSaveNote(form)
		},
		serverMark7(val){
			let form = {
				actId:this.actId,
				checkCode:this.markList[6].checkCode,
				checkName:this.list[6],
				checkId:this.markList[6].checkId,
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
		},
	},
  mounted(){

  }
}
</script>

<style lang="less" scoped>
.server{
	width: 99%;
	margin: 10px auto 0;
	border: 1px solid #999;
}
.server-disable{
	width: 90%;
	margin-top: 10px;
	border: 1px solid #999;
}
.list-item{
	display: flex;
	font-size: 20px;
	height: 40px;
	line-height: 40px;
	.top-left{
		flex: none;
		width: 300px;
		border-right: 1px solid #ccc;
	}
	.top-right{
		width: 100%;
	}
}
.list-form{
	position: relative;
	display: flex;
	font-size: 20px;
	height: 150px;
	border-top: 1px solid #ccc;
	.form-left{
		flex: none;
		width: 300px;
		line-height: 150px;
		border-right: 1px solid #ccc;
	}
	.form-right{
		width: 100%;
		padding: 5px;
	}
	.area-form{
		width: 100%;
		height: 100%;
		font-size: 14px;
		line-height: 24px;
		border: none;
		outline: none;
	}
	.mark-box{
		position: absolute;
		right: -120px;
		top: 50px;
	}
}
</style>
