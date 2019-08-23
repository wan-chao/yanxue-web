<template>
	<el-calendar v-model="value" >
		<template
			slot="dateCell"
			slot-scope="{date, data}">
			<div class="data-day" :class="{'is-selected':data.isSelected}" @click="select(data)">
				{{ data.day.split('-')[2] }} 
				<a class="action-point" v-show="list.findIndex(v=>v==data.day)>=0"></a>
			</div>
		</template>
	</el-calendar>

</template>

<script>
import {formatDate} from '@/util/common'
export default {
  props:{
    list:{
      type:Array,
      default:()=>[]
    }
  },
  components: {

  },
  data () {
    return {
      value:''
    }
  },
  computed:{
		today(){
			let date = new Date().getTime()
			return formatDate(date,'day')
		}
  },
  methods: {
    select(data){
      // console.log(data.day,this.today)
			if(this.today === data.day){
				this.$store.dispatch('setWeather',true)
			}else{
				this.$store.dispatch('setWeather',false)
			}
    },
  },
  watch:{
    value(newVal,oldVal){
      let newtime = formatDate(newVal,'month')
      let oldtime = formatDate(oldVal,'month')
      let val = formatDate(newVal,'day')
      this.$emit('date',val)
      if(newtime === oldtime) return
      this.$emit('change',newtime)
    }
  },
  mounted(){
    this.value = this.today
  }
}
</script>

<style lang="less" scoped>
.data-day{
    position: relative;
    text-align: center;
    width: 100%;
    height: 100%;
    line-height: 70px;
}
.action-point{
    position: absolute;
    top: 5px;
    right: 5px;
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff0000;
}
.is-selected {
    background: #2459f0;
    color: #fff;
}
</style>

