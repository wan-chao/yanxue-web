<template>
  <div class="model" @click.stop>
    <div class="info">
      <div class="info-top">
        <span>评价</span>
        <a class="el-icon-close" @click="close"></a>
      </div>
      <div class="info-content">
        <p>评价人数：{{allStar}}；</p>
        <ul class="form-info">
          <li>评分</li>
          <li>数量</li>
          <li>占比</li>
        </ul>
        <ul class="form-info">
          <li class="info-star">
            <span>五星评价</span>
            <el-rate value="5" disabled></el-rate>
          </li>
          <li>{{actByStar.fiveStar?actByStar.fiveStar:'0'}}</li>
          <li>{{allStar!='0'?(actByStar.fiveStar*100/allStar).toFixed(2):'0'}}%</li>
        </ul>
        <ul class="form-info">
          <li class="info-star">
            <span>四星评价</span>
            <el-rate value="4" disabled></el-rate>
          </li>
          <li>{{actByStar.fourStar?actByStar.fourStar:'0'}}</li>
          <li>{{allStar!='0'?(actByStar.fourStar*100/allStar).toFixed(2):'0'}}%</li>
        </ul>
        <ul class="form-info">
          <li class="info-star">
            <span>三星评价</span>
            <el-rate value="3" disabled></el-rate>
          </li>
          <li>{{actByStar.threeStar?actByStar.threeStar:'0'}}</li>
          <li>{{allStar!='0'?(actByStar.threeStar*100/allStar).toFixed(2):'0'}}%</li>
        </ul>
      </div>
      <div class="info-title">最新评价</div>
      <div class="list-content">
        <ul class="info-list" v-for="(item,index) in list" :key="index">
          <li class="list-top">
            <el-rate :value="item.score" disabled></el-rate>
            <span>{{item.evaluateTime}}</span>
          </li>
          <li>{{item.feelDesc}}</li>
        </ul>
        <p v-if="!evaluateList.length">暂无评论</p>
      </div>
      <my-page :size="size" :total="pageLen" @change="pageChage" v-if="evaluateList.length"></my-page>
    </div>
  </div>
</template>

<script>
import MyPage from '@/components/my-page'
export default {
  props:{
    actByStar:{
      type:Object,
      default:{}
    },
    evaluateList:{
      type:Object,
      default:[]
    }
  },
  components: {
    MyPage
  },
  data(){
    return {
      list:[],
			size:6,
    }
  },
  computed:{
    allStar(){
      if(this.actByStar.actId){
        return this.actByStar.oneStar+this.actByStar.twoStar+this.actByStar.threeStar+this.actByStar.fourStar+this.actByStar.fiveStar
      }else{
        return '0'
      }
    },
    pageLen(){
			return this.evaluateList.length
		},
  },
  methods:{
    close(){
      this.$emit('close')
    },
    pageChage(val){
			this.list = this.evaluateList.slice((val-1)*this.size,val*this.size)
		}
  },
  mounted(){
    this.list = this.evaluateList.slice(0,this.size)
  }
}
</script>

<style lang="less" scoped>
.model{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, .2);
}
.info{
  width: 632px;
  height: 743px;
  background: #fff;
  border-radius: 5px;
  .info-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 20px;
    font-size: 18px;
    color: #fff;
    background: #2c51ed;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .info-content{
    padding: 20px;
    font-size: 14px;
    color: #333;
    text-align: left;
  }
}
.form-info{
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  &>li{
    width: 32%;
    text-align: center;
  }
  .info-star{
    display: flex;
    align-items: center;
    &>span{
      margin-right: 5px;
    }
  }
}
.info-title{
  padding: 20px;
  font-size: 18px;
  color: #313f66;
  text-align: left;
}
.list-content{
  width: 100%;
  height: 320px;
}
.info-list{
  padding: 0 20px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
  text-align: left;
  .list-top{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    &>span{
      color: #999;
      font-size: 14px;
    }
  }
}
</style>
