<template>
  <div class="weather">
    <ul class="info">
      <li class="weather-city">天气</li>
      <li class="weather-num">{{weather.tmp}}℃</li>
      <li class="weather-img">
        <img :src="picUrl">
        <span>{{weather.condTxt}}</span>
      </li>
      <li class="weather-denger">{{weather.windDir}}</li>
    </ul>
  </div>
</template>

<script>
import {weather} from '@/api/home'
export default {
  components: {
  },
  data () {
    return {
      weather:{}
    }
  },
  computed:{
    picUrl(){
      if(this.weather.condCode){
        return require(`../../assets/images/${this.weather.condCode}.png`);
      }else{
        return ''
      }
    }
  },
  methods: {
    getWeather(){
      let time = new Date().getTime();
      weather(time).then(res=>{
        this.weather=res.data
        console.log(res)
      })
    }
  },
  mounted(){
    this.getWeather()
  }
}
</script>

<style lang="less" scoped>
.weather{
  width: 100%;
  height: 100%;
}
.info{
  width: 100%;
  color: #fff;
}
.weather-city{
  padding-top: 15px;
}
.weather-num{
  font-size: 49px;
  padding: 14px 0;
}
.weather-img{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  img{
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
}
.weather-denger{
  font-size: 16px;
  padding: 14px 0;
}
</style>

