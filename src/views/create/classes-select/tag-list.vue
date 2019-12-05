<template>
  <div class="tag">
    <el-checkbox-group v-model="checkboxGroup" size="small">
      <el-checkbox class="class-tag" border v-for="classes in classList" :label="classes" :key="classes.classId" @change="tageChange">{{classes.className}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  props:{
    classList:{
      type:Array,
      default:[]
    },
    grade:{
      type:String,
      default:''
    },
  },
  data(){
    return {
      checkboxGroup:[]
    }
  },
  computed:{
  },
  methods: {
    tageChange(){
      // this.$emit('change',this.grade,this.checkboxGroup)
    },
    deleteTag(tag){
      this.checkboxGroup.splice(this.checkboxGroup.findIndex(v=>{
        return v.classId === tag.classId
      }), 1)
    },
    editorSelect(classes){
      let index = this.checkboxGroup.findIndex(v=>{
        return v.classId === classes.classId
      })
      if(index<0) this.checkboxGroup.push(classes)
    },
  },
  watch:{
    checkboxGroup(newVal){
      this.$emit('change',this.grade,newVal)
    }
  },
  mounted(){
  }
}
</script>

<style scoped lang="less">
.tag{
  text-align: left;
  font-size: 14px;
  min-height: 52px;
  color: #333;
  padding-bottom: 20px;
}
.class-tag{
  text-align: center;
  height: 28px;
  margin-right: 15px;
}
</style>
