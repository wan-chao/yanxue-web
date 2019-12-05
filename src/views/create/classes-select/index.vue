<template>
  <div class="select">
    <ul class="select-top">
      <li class="top-list">
        <span>已选中：</span>
        <div class="tag-list">
          <el-tag v-for="tag in userSelect" :key="tag.classId" class="tag-top" @close="deleteSelectClass(tag)" :closable="!disabled" :type="tag">{{`${tag.gradeDesc}${tag.className}`}}</el-tag>
        </div>
      </li>
      <li>共<span class="top-span">{{studentNum}}</span>人</li>
    </ul>
    <el-tabs v-model="activeName" v-show="!disabled">
      <el-tab-pane v-for="(item,index) in lists" :key="index" :label='item.name' :name="item.name">
        <tag-list ref='grade' :classList='item.lists' :grade="item.type" @change="selectChange"></tag-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {searchClass} from '@/api/classes'
import TagList from './tag-list'
export default {
  props:{
    userType:{
      type:String,
      default:''
    },
    disabled:{
      type:Boolean,
      default:false
    },
    class_ids:{
      type:String,
      default:''
    },
  },
  data(){
    return {
      activeName:'一年级',
      allGrade:[],
      lists:[
				{type:'1',name:'一年级',lists:[]},
				{type:'2',name:'二年级',lists:[]},
				{type:'3',name:'三年级',lists:[]},
				{type:'4',name:'四年级',lists:[]},
				{type:'5',name:'五年级',lists:[]},
				{type:'6',name:'六年级',lists:[]},
				{type:'7',name:'初一',lists:[]},
				{type:'8',name:'初二',lists:[]},
				{type:'9',name:'初三',lists:[]},
			],
      selectList:[
        {type:'1',name:'一年级',lists:[]},
				{type:'2',name:'二年级',lists:[]},
				{type:'3',name:'三年级',lists:[]},
				{type:'4',name:'四年级',lists:[]},
				{type:'5',name:'五年级',lists:[]},
				{type:'6',name:'六年级',lists:[]},
				{type:'7',name:'初一',lists:[]},
				{type:'8',name:'初二',lists:[]},
				{type:'9',name:'初三',lists:[]},
      ],
    }
  },
  components:{
    TagList
  },
  computed:{
    userSelect(){
      let list = []
      this.selectList.forEach(item=>{
        list.push(...item.lists)
      })
      return list
    },
    studentNum(){
      let num = 0
      this.selectList.forEach(item=>{
        item.lists.forEach(v=>{
          num+=v.total
        })
      })
      return num
    }
  },
  methods: {
    deleteSelectClass(classes){
      let grade = classes.grade
      let index = grade-1
      this.$refs.grade[index].deleteTag(classes)
    },
    selectChange(grade,data){
      let index = this.selectList.findIndex(v=>{
        return v.type===grade
      })
      this.selectList[index].lists=data
    },
    //编辑班级
    eidtorGrade(data){
      let classIds = this.class_ids.split(',')
      let list = []
      classIds.forEach(v=>{
        let grade = data.find(item=>{
          return item.classId === v
        })
        list.push(grade)
      })
      if(list.length){
        list.forEach(classes=>{
          let index = this.selectList.findIndex(v=>{
            return classes && v.type === classes.grade
          })
          if(index>=0) this.$refs.grade[index].editorSelect(classes)
        })
      }
    },
    //搜索班级
    searchClassList(schoolId,grade){
			searchClass(schoolId,grade).then(res=>{
				console.log('班级列表',res)
				if(res.status===200){
          Object.assign(this.$data, this.$options.data())
          this.allGrade = res.data
          this.classesForGrade(res.data)
          if(this.class_ids) this.eidtorGrade(this.allGrade)
				}
			})
    },
    //班级列表按年级分类
		classesForGrade(data){
			data.forEach(e => {
				this.lists.forEach(v=>{
					if(v.type===e.grade) v.lists.push(e);
				})
			});
		}
  },
  watch:{
    userSelect(newVal){
      this.$emit('select',newVal)
    },
    class_ids(newVal){
      if(newVal) this.eidtorGrade(this.allGrade)
    },
    userType(newVal){
      if(newVal) this.searchClassList(newVal,'')
    }
  },
  mounted(){
  }
}
</script>

<style scoped lang="less">
.select{
  width: 100%;
}
.select-top{
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 30px;
  color: #333;
  border-bottom: 1px solid #ddd;
  .top-list{
    display: flex;
    min-height: 42px;
  }
  .tag-list{
    flex: none;
    width: 1000px;
    display: flex;
    flex-flow: row wrap;
  }
  .tag-top{
    margin: 0 10px;
    margin-bottom: 10px;
  }
  .top-span{
    font-size: 18px;
  }
}
</style>
