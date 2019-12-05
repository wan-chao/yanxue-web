<template>
  <div class="header-top"  :class="$store.state.showHeader?'show-header':'hide-header'">
    <div class="header-left" @click="goHome">研学旅行安全管理后台</div>
    <ul class="header-right">
      <!-- <li class="ring-icon"></li> -->
      <li class="avatar-icon"><img src='../../assets/images/avatar.png'></li>
      <li class="name-txt">
        
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{user.loginName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
          <el-dropdown-item command="1">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </li>
    </ul>

  </div>
</template>

<script>
import {userinfo,logout} from '@/api/user'
import {urlList} from '@/config/config'
export default {
  name: 'myHeader',
  components: {
  },
  data () {
    return {
      type:0,
      user:{
        userName:'',
      }
    }
  },
  computed:{
    path(){
      return this.$route.path
    }
  },
  methods: {
    goHome(){
      this.$router.replace('/')
    },
    handleCommand(val) {
      this.type = val
      this.$alert('是否退出登录', '提示', {
        showCancelButton:true,
        cancelButtonText:'取消',
        confirmButtonText: '确定',
        callback: action => {
          if(action==="confirm") this.comfimDelete()
        }
      });
    },
    comfimDelete(){
      if(this.type === '1'){
        this.userLogout()
      }
    },
    userLogout(){
      let token = localStorage.eleToken
      logout(token).then(res=>{
        console.log(res)
        if(res.status === 200 ){
          this.$store.dispatch('setUserInfo',{});
          this.$store.dispatch('setLogin',false);
          localStorage.removeItem('eleToken');
          this.$router.push('/login')
        }
      })
    },
    authPath(data){
      let menus = data.menus
			let list = urlList(menus)
			let path = this.$route.path
			let index = list.findIndex(v=>{
				return v === path
			})
			if(index<0) {
        this.$router.push('/')
      }else{
        this.$emit('set',data)
      }
    },
    getUsrInfo(){
      let token = localStorage.eleToken
      let hasInfo = this.$store.state.userInfo.userName?true:false
      if(hasInfo) {
        this.user = this.$store.state.userInfo
        console.log('???',this.user)
        this.authPath(this.user)
      }else{
        userinfo(token).then(res=>{
          console.log(res)
          if(res.status===200){
            this.user=res.data
            this.authPath(this.user)
            this.$store.dispatch('setUserInfo',res.data)
          }
        })
      }
    }
  },
  mounted(){
    this.getUsrInfo()
  }
}
</script>

<style lang="less" scoped>
.header-top{
  position: fixed;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0 1px 5px #ddd;  
  box-sizing: border-box;
  transition: all 0.05s linear;
}
.dropdown-menu{
  top: 47px !important;
}
.show-header{
  top: 0;
  opacity: 1;
}
.hide-header{
  top: -80px;
  opacity: 0;
}
.header-left{
  flex: none;
  color: #2f76df;
  font-size: 26px;
  padding: 0 40px;
  cursor: pointer;
}
.header-right{
  flex: none;
  display: flex;
  align-items: center;
  padding: 0 40px;
}
.ring-icon{
  width: 30px;
  height: 30px;
  background: url('../../assets/images/ring.png') no-repeat;
  background-size:100% 100%;
}
.avatar-icon{
  width: 32px;
  height: 32px;
  margin-left: 30px;
  border-radius: 50%;
}
.name-txt{
  margin: 0 18px;
  font-size: 14px;
  color: #3c5175;
}
.dialog-footer{
  z-index: 1000;
}
</style>

