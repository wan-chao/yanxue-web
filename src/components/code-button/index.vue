<template>
  <div class="button-code">
    {{msg}}
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      msg:'获取验证码',
      canClick:true,
      num:60
    };
  },
  mounted() {
  },
  methods:{
    getCode:_.debounce(function(phone){
      if(this.canClick){
        this.canClick=false
        this.msg=`${this.num} s`;
        this.countInterval = setInterval(() => {
          this.num--;
          this.msg=`${this.num} s`
          if(this.num==0){
            this.intervalEnd()
          }
        }, 1000);
      }
    },100),
    intervalEnd(){
      clearInterval(this.countInterval);
      this.canClick=true
      this.msg='获取验证码'
      this.num=60
    }
  },
  mounted(){
    this.intervalEnd()
  },
  destroyed(){
    this.intervalEnd()
  }
}
</script>

<style scoped lang="less">
.button-code{
  width: 100px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  background: #2c51ed;
  border: 1px solid #48a7ff;
  cursor: pointer;
}
</style>
