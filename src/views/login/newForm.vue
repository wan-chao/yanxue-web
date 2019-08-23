<template>

  <el-form :model="loginForm"
    status-icon
    :rules="rules"
    ref="loginForm">
    <el-form-item prop="oldPwd"  required>
      <el-input v-model="loginForm.oldPwd" type="password" class="form-input" clearable  placeholder="请输入密码" autocomplete="off">
        <i slot="prefix" class="el-icon-goods user-icon"></i>
      </el-input>
    </el-form-item>

    <el-form-item prop="newPass" required> 
      <el-input v-model="loginForm.newPass" clearable class="form-input" type="password" placeholder="请输入新密码" autocomplete="off">
        <i slot="prefix" class="el-icon-goods user-icon"></i>
      </el-input>
    </el-form-item>

    <el-form-item>
      <button class="login-btn"  @click.prevent="submitForm('loginForm')">提交</button>
    </el-form-item>
  </el-form>

</template>

<script>
import {isEmpty} from '@/util/common'
import {resetPassword} from "@/api/user"
export default {
  name: 'loginForm',
  data () {
    return {
      loginForm: {
        oldPwd: '',
        newPass: '',
      },
      rules: {
        newPass: [
          {required: true,message: '请输入新密码'},
          { min: 2, max: 18, message: '密码长度为6-18位，包含数字、大小写字母'}
        ],
        oldPwd: [
          {required: true, message: '请输入密码'},
          { min: 2, max: 18, message: '密码长度为6-18位，包含数字、大小写字母'}
        ],
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.loginForm)
          let token = localStorage.eleToken
          resetPassword(token,this.loginForm.oldPwd,this.loginForm.oldPwd).then(res=>{
            if(res.status === 200){
              this.$notify({
                title: '成功',
                message: '修改成功!',
                type: 'success',
                duration: 2000
              });
              this.$emit('change')
            }else{
              this.$message.error('修改失败')
            }
          }).catch((err)=>{this.$message.error('修改失败')})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.login-btn{
  width: 100%;
  height: 60px;
  margin-top: 80px;
  color: #fff;
  font-size: 16px;
  background: #3b41e8;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}
.user-icon{
  vertical-align: middle;
  font-size: 20px;
  margin-top: 15px;
  padding: 0 15px;
}

.form-input{
  border-radius: 5px;
  height: 60px;
  margin-bottom: 20px;
  border-radius: 30px;
  padding-left: 20px;
  color: #999 !important;
  border: 1px solid #dddddd;
}

.go-password{
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>

