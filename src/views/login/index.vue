<template>
  <el-container style="height:100%">

    <el-main style="padding:0;height:100%;" class="login-main">
      <div class="middle-header">
        <img class="icon-bg" src="../../assets/images/loginIcon.png">
        <div class="login-box">

          <div class="form-top">研学旅行安全管理后台</div>

          <div class="login-form" v-if="!next">
            <div class="form-box">
              <login-form @forget="forgetPass"></login-form>
            </div>
          </div>

          <div class="login-form" v-if="next">
            <div class="form-box">
              <new-form @change="pwdChange"></new-form>
            </div>
          </div>

        </div>
      </div>
    </el-main>

  </el-container>
</template>

<script>
import LoginForm from './loginForm'
import NewForm from './newForm'
export default {
  name: 'login',
  data(){
    return {
      next:false
    }
  },
  components: {
    LoginForm,NewForm
  },
  methods:{
    forgetPass(){
      this.next=true
    },
    pwdChange(){
      this.next=false
    }
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.content{
  height: 100%;
  color: #fff;
}
.login-main{
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background: url('../../assets/images/background.png') no-repeat;
  background-size:100% 100%;
}
.title{
  font-size: 40px;
  font-weight: 700;
}
.header-top{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  background: #fff;
}
.middle-header{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1472px;
  height: 808px;
  background: #fff;
  border-radius: 8px;
  &>img{
    width: 260px;
    height: 45px;
  }
  &>.icon-bg{
    width: 678px;
    height: 631px;
  }
}
.login-box{
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  margin-left: 80px;
  padding: 50px;
  width: 486px;
  height: 550px;
}
.login-form{
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 486px;
  height: 450px;
  margin-top: 60px;
}
.form-box{
  width: 100%;
  height: 300px;
}
.icon{
  width: 47px;
  height: 42px;
  margin-left: 30px;
}
.form-top{
  margin-top: 30px;
  font-size: 38px;
  color: #2459f0;
}

</style>

