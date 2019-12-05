<template>
  <div class="user-content">
    <div class="base-info">
      <div class="base">

        <div class="search-bar">
          <ul class="search-item">
            <li class="search-span"><span>筛选条件：</span></li>
            <li class="search-bot">
              <div class="search-all">
                <el-checkbox  class="search-box" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              </div>
              <el-checkbox-group class="search-list" v-model="checkboxGroup" size="mini" @change="handleCheckedGradeChange">
                <el-checkbox :label="item" v-for="(item,index) in topList" :key="index" class="search-box">{{item.gradeDesc+item.className}}</el-checkbox>
              </el-checkbox-group>
            </li>
          </ul>
          <ul class="search-item">
            <li class="search-span"><span>筛选条件：</span></li>
            <li class="search-bot">
              <el-checkbox-group class="search-list" v-model="checkboxGroup2" size="mini" @change="handleTypeChange">
                <el-checkbox :label="item.type" v-for="(item,index) in bottomList" :key="index" class="search-box">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </li>
          </ul>
          <div class="search-num">共计{{studentNum}}人</div>
        </div>

        <el-table
          ref="multipleTable"
          :data="studentList"
          tooltip-effect="dark"
          stripe
          style="width: 100%;marginTop:20px;"
          :header-cell-style="{background:'#f5f5f5',color:'#333'}">

          <el-table-column
            prop="studentName"
            align="center"
            label="学生姓名">
          </el-table-column>

          <el-table-column
            prop="studentCode"
            align="center"
            label="学籍号">
          </el-table-column>

          <el-table-column
            align="center"
            label="监护人1">
            <template slot-scope="scope">{{scope.row.guardianName.split(',')[0]?scope.row.guardianName.split(',')[0]:'无'}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            label="监护人1手机">
            <template slot-scope="scope">{{scope.row.guardianMobile.split(',')[0]?scope.row.guardianMobile.split(',')[0]:'无'|phoneHide}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            label="监护人2">
            <template slot-scope="scope">{{scope.row.guardianName.split(',')[1]?scope.row.guardianName.split(',')[1]:'无'}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            label="监护人2手机">
            <template slot-scope="scope">{{scope.row.guardianMobile.split(',')[1]?scope.row.guardianMobile.split(',')[1]:'无'|phoneHide}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            label="报名">
            <template slot-scope="scope">{{scope.row.signUp===0?'否':'是'}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            label="用车">
            <template slot-scope="scope">{{scope.row.useCar===0?'否':'是'}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            label="用餐">
            <template slot-scope="scope">{{scope.row.haveMeals===0?'否':'是'}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            label="住宿">
            <template slot-scope="scope">{{scope.row.livingHotel===0?'否':'是'}}</template>
          </el-table-column>

          <el-table-column
            align="center"
            label="备注">
            <template slot-scope="scope">{{scope.row.text?'无':'无'}}</template>
          </el-table-column>

        </el-table>

      </div>
    </div>
  </div>
</template>

<script>
import {selectActStudent} from '@/api/active'
export default {
  props:{
    class_ids:{
      type:String,
      default:''
    },
  },
  components: {
  },
  data(){
    return {
      studentData:[],
      studentList:[],
      topList:[],
      bottomList:[
        {name:'报名',type:'signUp'},
        {name:'用车',type:'useCar'},
        {name:'用餐',type:'haveMeals'},
        {name:'住宿',type:'livingHotel'},
      ],
      checkAll:true,
      checkboxGroup:[],
      checkboxGroup2:[]
    }
  },
  computed:{
    studentNum(){
      return this.studentList.length
    },
    classList(){
      return this.class_ids.split(',')
    }
  },
	filters:{
		phoneHide(tel){
			if(tel!='无'){
				return tel.substr(0, 3) + '****' + tel.substr(7);
			}else{
				return tel
			}
    }
	},
	methods:{
    handleCheckAllChange(val) {
      this.checkboxGroup = val ? this.topList : [];
      this.studentList = this.studentListFilter()
    },
    handleCheckedGradeChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.topList.length;
      this.studentList = this.studentListFilter()
    },
    handleTypeChange(value){
      this.studentList = this.studentListFilter()
    },
    setGradeList(data){
      let list = []
      data.forEach(v=>{
        let index = list.findIndex(item=>{
          return item.classId == v.classId && item.grade == v.grade
        })
        if(index<0) list.push({classId:v.classId,grade:v.grade,className:v.className,gradeDesc:v.gradeDesc})
      })
      return list
    },
    studentListFilter(){
      let list = []
      let form = [
        {name:'报名',type:'signUp',value:0},
        {name:'用车',type:'useCar',value:0},
        {name:'用餐',type:'haveMeals',value:0},
        {name:'住宿',type:'livingHotel',value:0},
      ]
      if(this.checkboxGroup.length){
        this.checkboxGroup.forEach(item=>{
          this.studentData.forEach(v=>{
            if(v.grade === item.grade && v.classId === item.classId){
              list.push(v)
            }
          })
        })
      }
      if(this.checkboxGroup2.length){
        this.checkboxGroup2.forEach(v=>{
          let index = form.findIndex(item=>{
            return item.type === v
          })
          if(index>=0) form[index].value = 1
        })
      }
      let lastList = []
      if(this.checkboxGroup2.length){
        this.checkboxGroup2.forEach(v=>{
          list.forEach(m=>{
            if(m[v]===1){
              let index = lastList.findIndex(i=>{
                return i.studentId === m.studentId
              })
              if(index<0) lastList.push(m)
            }
          })
        })
      }else{
        lastList = list
      }
      return lastList
    },
    seacrchStudentList(actId,classList){
      selectActStudent(actId,classList).then(res=>{
        console.log('查询活动学生',res)
        if(res.status===200){
          this.studentData = res.data
          this.topList = this.setGradeList(this.studentData)
          this.checkboxGroup = this.topList
          this.studentList = this.studentListFilter()
        }
      })
    },
  },
  watch:{
    classList(newVal){
      console.log('///',newVal)
    }
  },
  mounted(){
    let {id} = this.$route.query
    if(id) {
      this.actId = id
      this.seacrchStudentList(this.actId,this.classList)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../mainstay/style/mainstay.less';
.user-content{
	width: 100%;
}
.base-info{
	width: 100%;
}
.base{
	width: 100%;
}
.search-bar{
  font-size: 14px;
  color: #666;
  text-align: left;
  .search-item{
    display: flex;
    min-height: 40px;
    border-bottom: 1px dashed #999;
    .search-span{
      flex: none;
      width: 70px;
      height: 25px;
      margin-top: 15px;
      margin-right: 10px;
    }
    .search-bot{
      display: flex;
      min-height: 25px;
    }
    .search-box{
      width: 70px;
      height: 25px;
      color: #999;
      margin-bottom: 10px;
      padding-right: 10px;
      line-height: 25px;
      text-align: center;
      border-radius: 3px;
    }
    .search-all{
      flex: none;
      width: 63px;
      height: 35px;
      margin-top: 10px;
      margin-right: 40px;
      color: #999;
      font-size: 14px;
    }
    .search-list{
      display: flex;
      width: 1200px;
      height: 35px;
      margin-top: 10px;
      overflow: hidden;
      flex-flow: row wrap;
      align-items: center;
    }
  }
  .search-num{
    height: 40px;
    margin-top: 10px;
    padding-left: 20px;
    line-height: 40px;
    font-size: 16px;
    color: #3b6eff;
    border: 1px solid #3b6eff;
    background: #e6f7ff;
    font-weight: bold;
  }
}
</style>

