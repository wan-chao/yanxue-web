<template>
  <div class="search">
    <el-form ref="form" label-position="left"  class="record-search" size="mini">
      <el-form-item label="班级 ：" class="form-type">
        <div class="base-input">
          <el-select v-model="classType"  clearable  placeholder="--所有班级--">
            <el-option
              v-for="item in classes"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="检索 ：" class="form-type">
        <div class="base-input">
          <el-input v-model="value" clearable placeholder="请输入关键字"></el-input>
        </div>
      </el-form-item>
    </el-form>
    <div class="add-btn" @click="search">
      <span>查询</span>
    </div> 
  </div>
</template>

<script>
import {STATUS_TYPE} from '@/config/config'
export default {
  props:{
  },
  components: {
  },
  data(){
    return {
      classes:[
        {name:"一年级",value:'1'},
        {name:"二年级",value:'2'},
        {name:"三年级",value:'3'},
        {name:"四年级",value:'4'},
        {name:"五年级",value:'5'},
        {name:"六年级",value:'6'},
        {name:"初一",value:'7'},
        {name:"初二",value:'8'},
        {name:"初三",value:'9'},
      ],
      classType:'',
      value:'',
    }
  },
  methods:{
    search(){
      this.$emit('search',this.classType,this.value)
    }
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.search{
  width: 100%;
  height: 65px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 5px;
  box-shadow:0px 0px 2px #ddd;
}
.add-btn{
  width: 82px;
  margin-left: 20px;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  color: #fff;
  background: #2459f0;
  cursor: pointer;
  a{
    padding-right: 6px;
  }
}
.record-search{
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
}
.form-type{
	flex: none;
	padding-left: 10px;
	margin-right: 20px;
	margin-top: 18px;
  width: 270px;
}
.base-input{
	flex: none;
	display: flex;
	align-items: center;
	width:150px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
</style>
