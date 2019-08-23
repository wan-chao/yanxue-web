<template>
  <ul class="search">
    <li class="search-select">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{type.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in types" :key="index" :command="index">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </li>
    <li class="search-input">
      <el-input
        class="form-input"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="value">
      </el-input>
    </li>  
    <li class="add-btn" @click="search">
      <span>搜索</span>
    </li> 
  </ul>
</template>

<script>
import {STATUS_TYPE} from '@/config/config'
export default {
  components: {
  },
  data(){
    return {
      types:[
        {name:'全部',value:''},
        {name:'审核中',value:STATUS_TYPE.CHECK},
        {name:'被驳回',value:STATUS_TYPE.REFUSE},
        {name:'通过',value:STATUS_TYPE.PASS},
      ],
      type:{name:'全部',value:''},
      value:'',
    }
  },
  methods:{
    handleCommand(index) {
      this.type = this.types[index]
    },
    search(){
      console.log(this.type)
      this.$emit('search',this.type.value,this.value)
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
.search-select{
  margin:0 30px;
}
.search-input{
  width: 210px;
  height: 36px;
  margin-left: 20px;
  border-radius: 18px;
  background: #f2f2f2;
}
.form-input{
  height: 36px;
  margin-bottom: 20px;
  border-radius: 30px;
  color: #999 !important;
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
</style>
