<template>
  <div id="app">
 
    <router-view/>
 
  </div>
</template>

<script>
export default {
  components: {
  },
  data(){
    return {
      scrollTop:0
    }
  },
  methods:{
    handleScroll() {
      window.addEventListener('scroll', () => {
        this.scrollTop = document.documentElement.scrollTop;
      })
    }
  },
  watch:{
    // scrollTop(newVal,oldVal){
    //   if(newVal>oldVal){
    //     this.$store.dispatch('setHeader',false)
    //   }else{
    //     this.$store.dispatch('setHeader',true)
    //   }
    // }
  },
  mounted() {
    // this.handleScroll();
  },
  beforeDestroy() {
    // window.removeEventListener('scroll');
  }
}
</script>

<style lang="less">
html,body{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  background: #f6f7fb;
}
body::-webkit-scrollbar {
	display:none
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
  height: 100%;
}
.container{
  width: 100%;
	padding-top: 80px;
}
.save-back{
	width: 120px;
	height: 36px;
	margin: 30px;
  line-height: 36px;
  border-radius: 4px;
  color: #fff;
  background: #2459f0;
  cursor: pointer;
}
</style>
