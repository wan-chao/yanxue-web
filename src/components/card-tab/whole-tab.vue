<template>
	<div class="whole">
		<div class="whole-tab" v-if="!disable&&!planNotEditor">
			<my-upload ref="planUpload" accept="application/pdf" @preview="planPreview" v-show="!planFile.length">
				<div class="edit-btn">上传整体活动方案</div>
				<div class="warn-txt">仅支持PDF格式文档，大小不能超过50MB</div>
			</my-upload>
			<span class="file-ok" v-for="(item,index) in planFile" :key="index" v-show="planFile.length" @click="deletePlan(item.name)">{{item.name.split('_')[1]}}</span>
		</div>
		<iframe class="my-iframe" v-show="planNotEditor&&wholeList!=''" :src='wholeList'></iframe>
	</div>
</template>

<script>
import MyUpload from '@/components/my-upload'
import {STATUS_TYPE} from '@/config/config'
import {uploadFiles} from '@/api/active'
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
		wholeList:{
      type:String,
      default:''
    },
  },
  components: {
		MyUpload
  },
  data(){
    return {
			planFile:[]
    }
	},
	computed:{
		planNotEditor(){
			return this.actStatus===STATUS_TYPE.CHECK || this.actStatus===STATUS_TYPE.PASS || this.actStatus===STATUS_TYPE.BEGIN || this.actStatus===STATUS_TYPE.END
		},
		wholeData(){
			return this.$store.state.exercise.wholeData
		}
	},
	methods:{
		planPreview(list){
			let os = list[0].file
			uploadFiles(os).then(res=>{
				console.log(res)
				if(res.status === "0"){
					this.planFile=list
					console.log(res.datas)
					this.$store.dispatch('exercise/setWholeData',res.datas)
				}
			}).catch(()=>{
				this.$refs.planUpload.clearFile()
			})
		},
		deletePlan(name){
			let index = this.planFile.findIndex(v=>{
				return v.name === name
			})
			this.$store.dispatch('exercise/setWholeData','')
			this.planFile.splice(index,1)
			this.$refs.planUpload.deleteFile(name)
		},
	},
	watch:{
		wholeData(val){
			if(val!=''){
				this.planFile=[{
					name:val
				}]
			}
		}
	},
  mounted(){
		if(this.wholeData!=''){
			this.planFile=[{
				name:this.wholeData
			}]
		}
  },
  destroyed(){
  }
}
</script>

<style lang="less" scoped>
.whole{
	margin-top: 10px;
	width: 100%;
}
.whole-tab{
	display: flex;
	align-items: center;
	justify-content: center;
  width: 100%;
  height: 200px;
}
.edit-btn{
	width: 200px;
	height: 50px;
	margin-left: 15px;
	font-size: 16px;
	font-weight: bold;
	color: #fff;
	line-height: 50px;
	border-radius: 5px;
	background: #2459f0;
}
.warn-txt{
	font-size: 12px;
	margin-top: 10px;
	color: red;
}
.file-ok{
	display: inline-block;
	width: 200px;
	height: 50px;
	font-size: 14px;
	line-height: 50px;
	border-radius: 5px;
	text-overflow: ellipsis; //超出部分以省略号显示
 	white-space: nowrap;
	overflow: hidden;
	color: #fff;
	background: #42b983;
	cursor: pointer;
}
.my-iframe{
	width: 60%;
	height: 500px;
	margin: 30px auto;
}
</style>
