<template>
  <el-popover
    placement="left-start"
    v-model="visible"
    trigger="manual">
    <textarea class="area-mark" v-model="value"></textarea>
    <div style="text-align: right; margin: 0">
      <el-button type="primary" size="mini" @click="submit">确定</el-button>
    </div>
    <el-button slot="reference" :icon="show?'el-icon-check':'el-icon-edit'"  :type="show?'success':'primary'" @click="showBox">{{show?'查看':'写批注'}}</el-button>
  </el-popover>
</template>

<script>
export default {
  props:{
    text:{
      type:String,
      default:''
    }
  },
  components: {
  },
  data () {
    return {
      value:'',
      show:false,
      visible: false,
    }
  },
  computed:{

  },
  methods: {
    showBox(){
      this.visible = true
    },
    submit(){
      this.visible = false
      if(this.value){
        this.show = true
        this.$emit('submit',this.value)
      }
    }
  },
  watch:{
    value(newVal){
      if(!newVal){
        this.show = false
      }else{
        this.show =true
      }
    },
    text(newVal){
      this.value = newVal
    }
  },
  mounted(){

  }
}
</script>

<style lang="less" scoped>
.area-mark{
  width: 150px;
  height: 100px;
}
</style>

