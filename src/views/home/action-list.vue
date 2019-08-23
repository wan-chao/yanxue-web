<template>
    <el-carousel height="190px" direction="vertical" :autoplay="true">
        <el-carousel-item v-for="(item,index) in list" :key="index">
            <div class="list-top">{{item.actName}}</div>
            <ul class="action-list">
                <li class="list-item" v-for="(v,index) in item.scheduleList" :key="index">
                    <img src="../../assets/images/chufa.png">
                    <span>{{v.beginTime.split(' ')[1]}}</span>
                    <span>出发</span>
                    <span>——</span>
                    <span>{{v.endTime.split(' ')[1]}}</span>
                    <span>结束</span>
                </li>
            </ul>
        </el-carousel-item>
        <el-carousel-item v-if="!list.length">
          <div class="not-txt">暂无活动安排</div>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
export default {
  props:{
    list:{
      type:Array,
      default:()=>[]
    },
  },
  components: {
  },
  data () {
    return {
    }
  },
  computed:{
  },
  methods: {
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.action-list{
  padding-left: 30px;
  padding-top: 10px;
}
.list-top{
  padding-top: 20px;
  font-size: 18px;
  color: #fff;
}
.list-item{
  text-align: left;
  margin-bottom: 10px;
  font-size: 16px;
  color: #fff;
  &>span,img{
    vertical-align: middle;
    margin-right: 8px;
  }
}
.not-txt{
  font-size: 20px;
  color: #fff;
  line-height: 150px;
}
</style>

