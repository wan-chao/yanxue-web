<template>
  <div class="org-detail">
    <ul>
      <li class="info-item">
        <span>机构类型：</span>
        <a>{{detail.officeType | typeOffice}}</a>
      </li>
      <li class="info-item">
        <span>机构名称：</span>
        <a>{{detail.officeName}}</a>
      </li>
      <li class="info-item">
        <span>上级机构：</span>
        <a>{{detail.parentName | notInfo}}</a>
      </li>
      <li class="info-item">
        <span>机构地址：</span>
        <a>{{detail.address | notInfo}}</a>
      </li>
      <li class="info-item">
        <span>生效时间：</span>
        <a>{{detail.startTime | notInfo}}</a>
      </li>
      <li class="info-item">
        <span>失效时间：</span>
        <a>{{detail.endTime | notInfo}}</a>
      </li>
      <li class="info-item">
        <span>联系人：</span>
        <a>{{detail.master | notInfo}}</a>
      </li>
      <li class="info-item">
        <span>手机：</span>
        <a>{{detail.telephone | notInfo}}</a>
      </li>
      <li class="info-item" v-if="enableEditor">
        <span>操作：</span>
        <a class="save-btn" @click="editor">修改</a>
        <a class="save-del" @click="detele">删除</a>
      </li>
    </ul>
  </div>

</template>

<script>
import {organizationType} from '@/config/config'
export default {
  props:{
    detail:{
      type:Object,
      default:()=>({})
    },
    enableEditor:{
      type:Boolean,
      default:false
    },
  },
  data(){
    return {
    }
  },
  filters:{
    notInfo(val){
      return val?val:'无'
    },
    typeOffice(val){
      return organizationType(val)
    }
  },
  computed:{
  },
  methods: {
    editor(){
      this.$emit('editor',this.detail)
    },
    detele(){
      this.$emit('detele',this.detail)
    }
  },
  mounted(){
  }
}
</script>

<style scoped lang="less">
.org-detail{
  width: 100%;
  height: 100%;
  color: #666;
  font-size: 16px;
  padding: 30px 0;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.info-item{
  padding-left: 20px;
  text-align: left;
  line-height: 40px;
  margin-bottom: 10px;
  &>span{
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  &>a{
    margin-left: 10px;
  }
}
.save-btn{
  display: inline-block;
	width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
	background: #2459f0;
	font-size: 14px;
	color: #fff;
	border-radius: 3px;
	margin: 0 10px;
	cursor: pointer;
}
.save-del{
  display: inline-block;
	width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
	background: red;
	font-size: 14px;
	color: #fff;
	border-radius: 3px;
	margin: 0 10px;
	cursor: pointer;
}
</style>
