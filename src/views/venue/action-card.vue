<template>
  <div class="card" @click="editorActive">
    <img class="card-status" :src="statusImg">
    <ul class="card-top">
      <li class="top-left">
        <a>{{card.actName}}</a>
        <span>课程设计方案</span>
      </li>
    </ul>
    <ul>
      <li class="list-item">
        <span>主办方：</span>
        <a>{{card.organizerName}}</a>
      </li>
      <li class="list-item">
        <span>承办方：</span>
        <a>{{card.undertakeName}}</a>
      </li>
      <li class="list-item">
        <span>供应方：</span>
        <a>{{card.supplyName}}</a>
      </li>
      <li class="list-item">
        <span>时&ensp;&ensp;间：</span>
        <a>{{card.startTime |initDate}}--{{card.endTime|initDate}}</a>
      </li>
    </ul>
    
    <ul>
      <li>
        <button class="news-btn" v-if="card.actStatus==='11'">待审核 >></button>
        <button class="suggset-btn" v-if="card.actStatus==='0' || card.actStatus==='12'|| card.actStatus==='2'" @click.stop="goSuggestion">查看审核意见 >></button>
      </li>
    </ul>
    
  </div>
</template>

<script>
import {STATUS_TYPE} from '@/config/config'
export default {
  props:{
    card:Object,
  },
  components: {
  },
  data(){
    return {
    }
  },
  filters:{
    initDate(data){
      let list = data.split(':')
      return `${list[0]}:${list[1]}`
    }
  },
  computed:{
    avatarImg(){
      return require(`../../assets/images/avatar.png`)
    },
    statusImg(){
      if(!this.card.actStatus){
        return ''
      }else{
        return require(`../../assets/images/status${this.card.actStatus}.png`)
      }
    },
    showBtn(){
      return this.card.actStatus === STATUS_TYPE.REFUSE?true:false
    }
  },
  methods:{
    editorActive(){
      this.$router.push({
        path: '/details',
        query: {
          id: this.card.actId
        }
      })
    },
    goSuggestion(){
      this.$router.push({
        path: '/suggestion',
        query: {
          id: this.card.actId
        }
      })
    },
    startSuggestion(){
      this.$router.push({
        name: 'check',
        params: {
          actId: this.card.actId,
          actName:this.card.actName
        }
      })
    },
    newsInfo(){
      this.$router.push({
        path: '/information',
        query: {
          id: this.card.actId
        }
      })
    }
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.card{
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #fff;
  padding:20px 20px 20px 40px ;
  border-radius: 8px;
  box-shadow:0px 0px 3px #ddd;
  user-select:none;
  cursor: pointer;
}
.card-status{
  position: absolute;
  right: -10px;
  top: 10px;
}
.card-top{
  display: flex;
  margin-bottom: 20px;
  .avatar-img{
    flex: none;
    width: 50px;
    height: 50px;
    margin-right: 15px;
    border-radius: 25px;
  }
  .image-slot{
    font-size: 50px;
    color: #999;
  }
}
.top-left{
  width: 190px;
  text-align: left;
  a{
    display: block;
    font-size: 18px;
    margin-top: 5px;
    color: #313f66;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  span{
    margin-top: 10px;
    display: block;
    font-size: 14px;
    color: #939fbd;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
}
.list-item{
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  li{
    margin-bottom: 15px;
  }
  span{
    display: block;
    width: 60px;
    text-align: right;
    margin-right: 5px;
  }
  a{
    flex: none;
    display: block;
  }
}
.news-btn{
  position: absolute;
  bottom: 30px;
  left: 133px;
  height: 38px;
  width: 136px;
  color: #2459f0;
  background: none;
  font-size: 14px;
  border: 1px solid #2459f0;
  border-radius: 30px;
  cursor: pointer;
}
.suggset-btn{
  position: absolute;
  bottom: 30px;
  left: 133px;
  height: 38px;
  width: 136px;
  color: #fff;
  background: none;
  font-size: 14px;
  background: #2459f0;
  border-radius: 30px;
  cursor: pointer;
}

</style>
