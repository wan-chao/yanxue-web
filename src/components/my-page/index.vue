<template>
	<el-pagination
		class="my-page"
		@current-change="handleCurrentChange"
		:page-size="size"
		layout="prev, pager, next, jumper"
		:total="total">
	</el-pagination>
</template>

<script>
export default {
	props:{
		size:{
			type:Number,
			default:100
		},
		total:{
			type:Number,
			default:1000
		},
	},
  components: {
  },
  data () {
    return {
			totalNum:0
    }
  },
  computed:{
  },
  methods: {
		handleCurrentChange(val) {
			this.$emit('change',val)
		}
	},
  mounted(){
		
  }
}
</script>

<style lang="less" scoped>
.my-page{
  margin: 20px 0; 
}
</style>

