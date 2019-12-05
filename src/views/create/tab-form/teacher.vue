<template>
  <div>
    <ul class="teacher-box" v-show="!hasSubmit">
      <li class="box-left">
        <h1>教师及工作人员</h1>
        <ul>
          <li class="tab-btn" :class="currentIndex===index?'btn-active':'btn-default'" v-for="(item,index) in typeList" :key="index" @click="typeChange(index)">{{item.officeName}}</li>
        </ul>
      </li>
      <li class="box-right">
        <el-table
          ref="multipleTable"
          :data="item.list"
          tooltip-effect="dark"
          stripe
          v-for="(item,index) in officeTeacherList" :key="index" v-show="currentIndex===index"
          @selection-change="handleSelectionChange"
          style="width: 100%;marginTop:20px;"
          :header-cell-style="{background:'#f5f5f5',color:'#333'}">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            align="center"
            label="类型">
            <template slot-scope="scope">{{scope.row.teacherType | userType}}</template>
          </el-table-column>

          <el-table-column
            prop="officeName"
            align="center"
            label="机构">
          </el-table-column>

          <el-table-column
            prop="teacherName"
            align="center"
            label="姓名">
          </el-table-column>

          <el-table-column
            align="center"
            label="联系方式">
            <template slot-scope="scope">{{scope.row.mobileNum | phoneHide}}</template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
    <el-table
      v-show="hasSubmit"
      :data="userSelect"
      tooltip-effect="dark"
      stripe
      style="width: 100%;marginTop:20px;"
      :header-cell-style="{background:'#f5f5f5',color:'#333'}">

      <el-table-column
        align="center"
        label="类型">
        <template slot-scope="scope">{{scope.row.teacherType | userType}}</template>
      </el-table-column>

      <el-table-column
        prop="officeName"
        align="center"
        label="机构">
      </el-table-column>

      <el-table-column
        prop="teacherName"
        align="center"
        label="姓名">
      </el-table-column>

      <el-table-column
        align="center"
        label="联系方式">
        <template slot-scope="scope">{{scope.row.mobileNum | phoneHide}}</template>
      </el-table-column>
    </el-table>
    <el-button :type="hasSubmit?'success':'primary'" @click="submitForm" class="form-sub">{{hasSubmit?'修 改':'确 定'}}</el-button>
  </div>
</template>

<script>
import {STATUS_TYPE} from '@/config/config'
import {saveActTeacher} from '@/api/active'
export default {
  props:{
    teacherList:{
      type:Array,
      default:[]
    }
  },
  components: {
  },
  data(){
    return {
      currentIndex:0,
      hasSubmit:false,
      userSelect:[],
      multipleSelection:[
        {type:'11',name:'',list:[]},
        {type:'12',name:'',list:[]},
        {type:'13',name:'',list:[]}
      ]
    }
  },
  filters:{
    userType(val){
      switch(val){
        case '11':
          return '主办方'
          break;
        case '12':
          return '承办方'
          break;
        case '13':
          return '供应方'
          break;
        default:
          return '无'
      }
    },
		phoneHide(tel){
			if(tel!='无'){
				return tel.substr(0, 3) + '****' + tel.substr(7);
			}else{
				return tel
			}
    }
	},
	computed:{
    typeList(){
      return this.$store.state.active.charge
    },
    officeTeacherList(){
      return this.initTeacherType(this.teacherList)
    },
	},
	methods:{
    submitForm(){
      if(this.hasSubmit){
        this.hasSubmit=false
        this.initTeacherType(this.userSelect).forEach((item,index)=>{
          this.toggleSelection(item.list,index)
        })
        this.multipleSelection = this.initTeacherType(this.userSelect)
      }else{
        this.userSelect = this.userSelectList(this.multipleSelection)
        let teacherList = this.userSelect.map(v=>{
          return {actId:this.actId,teacherId:v.teacherId}
        })
        this.saveUserSelectTeacher(teacherList)
      }
    },
    //保存活动老师
    saveUserSelectTeacher(actId,teacherId){
      saveActTeacher(actId,teacherId).then(res=>{
        console.log('保存老师',res)
        if(res.status===200){
          this.hasSubmit=true
          this.$notify({title: '成功',message: '保存老师成功',type: 'success'});
        }
      })
    },
    userSelectList(data){
      let list = []
      data.forEach(v=>{
        let select = v.list
        list.push(...select)
      })
      return list
    },
    initTeacherType(data){
      let list = this.typeList.map(v=>{
        return {
          type:v.officeType,
          name:v.officeName,
          officeId:v.officeId,
          list:[]
        }
      })
      if(data.length){
        data.forEach(v=>{
          let index = list.findIndex(item=>{
            return item.type === v.teacherType && item.officeId === v.officeId
          })
          if(index>=0){
            list[index].list.push(v)
          }
        })
      }
      return list
    },
    typeChange(index){
      this.currentIndex = index
    },
    toggleSelection(rows,index) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable[index].toggleRowSelection(row,true);
        })
      } else {
        this.$refs.multipleTable[index].clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection[this.currentIndex].list = val
    }
  },
  watch:{
    teacherList(newVal){
      if(newVal.length){
        let list = []
        newVal.forEach(v=>{
          if(v.isAttend===1){
            list.push(v)
          }
        })
        if(list.length){
          this.userSelect = list
          this.hasSubmit = true
        }
      }
    }
  },
  mounted(){
    let {id} = this.$route.query
    if(id) {
      this.actId = id
    }
  },
  destroyed(){
  }
}
</script>

<style lang="less" scoped>
.teacher-box{
  display: flex;
  width: 100%;
  margin-top: 20px;
  .box-left{
    width: 300px;
    margin-right: 50px;
    h1{
      font-size: 20px;
    }
  }
  .box-right{
    width: 100%;
  }
}
.tab-btn{
  width: 150px;
  height: 50px;
  line-height: 50px;
  margin: 20px auto;
  border-radius: 5px;
  cursor: pointer;
}
.btn-default{
  border: 1px solid #ccc;
}
.btn-active{
  background: rgb(46, 78, 236);
  color: #fff;
}
.form-sub{
  margin-top: 20px;
}
</style>
