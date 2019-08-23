<template>
  <div class="container">
    <my-header @set="setUserList"></my-header>
    <div class="home-content">

      <div class="user-list">
        <router-link class="router-link" v-for="(item,index) in tabList" :key="index" :to="item.url">
          <img :src="item.pic" class="link-img">
          <span>{{item.name}}</span>
        </router-link>
      </div>

      <div class="tab-list">
        <div class="info-list">
          <list-scroll color="#f02454" :userType='userType' title="动态播报" :list="items"></list-scroll>
          <list-scroll color="#2459f0" :userType='userType' title="其他新闻" :list="cmsData"></list-scroll>
        </div>
        <div class="date-info">
          <ul class="list-title">
            <li class="title-icon"></li>
            <li class="title-txt">日历</li>
          </ul>
          <my-calendar @change="timeChange" @date="dateChange" :list="timeList"></my-calendar>
          <div class="date-bottom">
            <div class="weather-item" v-show="$store.state.showWeather">
              <my-weather></my-weather>
            </div>
            <div class="action-item" :class="{'active-action':!$store.state.showWeather}">
              <action-list :list="activeDay"></action-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import ListScroll from '@/components/list-scroll'
import MyWeather from '@/components/my-weather'
import ActionList from './action-list'
import MyCalendar from '@/components/my-calendar'
import {activeTime,cms} from '@/api/home'
import {cmsList} from '@/api/information'
import {notify} from '@/api/home'
import {TYPE,activeEnableEditor} from '@/config/config'
import {formatDate} from '@/util/common'

export default {
  name: 'home',
  components: {
    MyHeader,ListScroll,MyWeather,ActionList,MyCalendar
  },
  data(){
    return {
      tabList:[
      ],
      cmsData:[],
      items:[],
      activeMonth:[],
      activeDay:[],
      currentDay:'',
      timeList:[],
      userType:''
    }
  },
  methods:{
    setUserList(data){
      let end = new Date().getTime();
      this.tabList = []
      this.userType = data.userType
      let menus = data.menus
      this.searchNotify(null,end,this.userType);
      // console.log('****',data)
      menus.forEach(v=>{
        if(v.name === "活动管理"){
          this.tabList.push({pic:require('../../assets/images/huodong.png'),name:'活动管理',url:activeEnableEditor(this.userType)?'/actions':'/venue'})
        }else if(v.name === "部门管理"){
          this.tabList.push({pic:require('../../assets/images/jigou.png'),name:'机构管理',url:'/organization'})
        } else if(v.name === "用户管理"){
          this.tabList.push({pic:require('../../assets/images/user.png'),name:'用户管理',url:'/user'})
        } else if(v.name === "电子围栏"){
          this.tabList.push({pic:require('../../assets/images/weilan.png'),name:'电子围栏',url:'/fence'})
        } else if(v.name === "设备管理"){
          this.tabList.push({pic:require('../../assets/images/shebei.png'),name:'设备管理',url:'/device'})
        } else if(v.name === "信息发布"){
          this.tabList.push({pic:require('../../assets/images/xinxi.png'),name:'信息发布',url:'/information'})
        } else if(v.name === "统计分析"){
          this.tabList.push({pic:require('../../assets/images/tongji.png'),name:'统计分析',url:'/statistics'})
        }
      })
    },
    timeChange(time){
      let start = `${time}-01 00:00:00`
      let end = `${time}-31 23:59:59`
      this.getActiveTime(start,end)
    },
    dateChange(val){
      this.currentDay = val
      if(!this.activeMonth) return
      let list = this.activeMonth.filter(v=>{
        if(v.scheduleList.length){
          let item = v.scheduleList[0]
          return item.beginTime.split(' ')[0] === val
        }
      })
      this.activeDay = list
    },
    getActiveTime(start,end){
      activeTime(start,end).then(res=>{
        // console.log('安排',res)
        if(res.status === 200 ){
          this.timeList=this.initTimeList(res.data)
          this.activeMonth = res.data
          let list = this.activeMonth.filter(v=>{
          if(v.scheduleList.length){
              let item = v.scheduleList[0]
              return item.beginTime.split(' ')[0] === this.currentDay
            }
          })
          this.activeDay = list
        }
      })
    },
    initTimeList(list){
      let time = []
      list.forEach((v,i)=>{
        let item = v.scheduleList
        if(item.length){
          let schedule = item[0]
          if(schedule.beginTime){
            time.push(schedule.beginTime.split(' ')[0])
          }
        }
      })
      return time
    },
    searchNotify(start,end,userType){
			notify(start,end,userType).then(res=>{
				// console.log('报警',res)
				if(res.status === 200){
					this.items = res.data?res.data:[]
				}
			})
		},
  },
  async mounted(){
    let cms = await cmsList();
    // console.log('cms',cms)
    if(cms.status === 200){
      this.cmsData = cms.data
    }
  }
}
</script>

<style lang="less" scoped>
.home-content{
  width: 1600px;
  margin: 0 auto;
  padding-bottom: 20px;
}
.tab-list{
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
.user-list{
  margin-top: 30px;
  display: flex;
  justify-content: flex-start;
}
.router-link{
  flex: none;
  position: relative;
  width: 216px;
  height: 108px;
  margin-right: 10px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  .link-img{
    position: absolute;
    left: 0;
  }
  span{
    position: absolute;
    top: 43px;
  }
}
.info-list{
  width: 1000px;
  flex: none;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.date-info{
  flex: none;
  width: 574px;
  display: flex;
  flex-flow: column;
  border-radius: 10px;
  justify-content: flex-start;
  align-items: flex-start;
  background: #fff;
}
.date-bottom{
  display: flex;
  width: 100%;
  height: 190px;
}
.weather-item{
  flex: none;
  width: 148px;
  height: 100%;
  background: #83b9f8;
  border-bottom-left-radius: 10px;
}
.action-item{
  width: 100%;
  height: 100%;
  background: #64a7f7;
  border-bottom-right-radius: 10px;
}
.active-action{
  border-bottom-left-radius: 10px;
}
.list-title{
  height: 30px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  .title-icon{
    width: 8px;
    height: 100%;
    border-radius: 4px;
    background: #4b8dec;
  }
  .title-txt{
    font-size: 20px;
    color: #313f66;
    padding-left: 26px;
  }
}
</style>
