<template>
  <div class="add-info">
    <img src="../../assets/images/close.png" class="close-icon" @click="closeDetail">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      label-width="120px"
      size="small"
      class="demo-ruleForm">

      <el-form-item label="机构类型：" prop="userType" required>
        <div class="base-input">
          <el-select v-model="taskForm.userType"  @change="typeChange">
            <el-option
              v-for="item in officeList"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="机构名称：" prop="officeName" required>
        <div class="base-input">
          <el-autocomplete
            class="inline-input"
            v-model="taskForm.officeName"
            :fetch-suggestions="querySearch" 
            value-key="officeName"
            placeholder="请选择机构"
            @select="nameChange"
          ></el-autocomplete>
          <!-- <el-select v-model="taskForm.officeName"  clearable  placeholder="请选择机构"  @change="nameChange">
            <el-option
              v-for="item in nameList"
              :key="item.name"
              :label="item.officeName"
              :value="item.officeName">
            </el-option>
          </el-select> -->
        </div>
      </el-form-item>

      <el-form-item label="登录名：" prop="loginName" required>
        <div class="base-input">
          <el-input v-model="taskForm.loginName" placeholder="请输入登录名"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="姓名：" prop="userName" required>
        <div class="base-input">
          <el-input v-model="taskForm.userName" placeholder="请输入姓名"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="手机号：" prop="mobile" required>
        <div class="base-input">
          <el-input v-model="taskForm.mobile" placeholder="手机号"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="权限：" prop="checkedRoles" required>
        <div class="base-input">
          <el-select v-model="taskForm.checkedRoles"  clearable  placeholder="请选择权限">
            <el-option
              v-for="item in typeList"
              :key="item.name"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

    </el-form>

    <div class="footer-btn">
      <el-button @click="closeDetail">取 消</el-button>
      <el-button type="primary" @click="submitForm('taskForm')">确 定</el-button>
    </div>
  </div>

</template>

<script>
  import {OFFICE_LIST,TYPE} from '@/config/config'
  import {saveUser,exsitUsername} from '@/api/user'
  import {officeList} from '@/api/organization'
  import User from '@/js/user'
  export default {
    data(){
      return {
        checkAll:false,
        officeList:OFFICE_LIST,
        nameList:[],
        typeList:[],
        taskForm: {
          loginId:'',
          loginName:'',
          openid:'',
          userName:'',
          userType:'',
          officeId:'',
          officeName:"",
          mobile:"",
          roleList:[],
          checkedRoles:'',
          jobNo:'',
        },
        rules: {
          userType: [
            { required: true, message: '请选择机构类型'}
          ],
          officeName: [
            { required: true, message: '请输入机构名称'},
          ],
          loginName: [
            { required: true, message: '请输入登录名'},
            { min: 2, max: 20, message: '长度在 2 到 20 个字符'}
          ],
          userName: [
            { required: true, message: '请输入姓名'},
            { min: 2, max: 20, message: '长度在 2 到 20 个字符'}
          ],
          checkedRoles: [
            { required: true, message: '请选择角色权限职务'},
          ],
          mobile: [
            {required: true, message: '请输入手机号码',},
            {pattern:/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,message:"请输入合法的手机号"}
          ],
        }
      }
    },
    methods: {
      querySearch(queryString, cb) {
        var restaurants = this.nameList;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.officeName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      typeChange(val){
        this.setTypeList(val)
        this.taskForm.officeName =''
        this.searchOffice(val)
      },
      setTypeList(val){
        let index = OFFICE_LIST.findIndex(v=>{
          return v.value === val
        })
        if(index>=0) this.typeList = OFFICE_LIST[index].typeList
      },
      nameChange(val){
        // let index = this.nameList.findIndex(v=>{
        //   return v.officeName == val
        // })
        this.taskForm.officeId = val.officeId
      },
      searchOffice(type=''){
        officeList(type).then(res=>{
          // console.log(res)
          if(res.status===200){
            if(type===TYPE.CB){
              this.nameList = res.data.filter(v=>{
                return v.officeName!='承办方'
              })
            }else if(type===TYPE.GY){
              this.nameList = res.data.filter(v=>{
                return v.officeName!='供应方'
              })
            }else if(type===TYPE.YY){
              this.nameList = res.data.filter(v=>{
                return v.officeName!='运营方'
              })
            }else{
              this.nameList = res.data
            }
          }
        })
      },

      closeDetail(){
        this.resetForm();
        this.$emit('close')
      },
      
      editForm(data){
        console.log('编辑',data)
        let user = new User(data)
        let val = user.userType
        this.setTypeList(val)
        this.$nextTick(()=>{
          this.taskForm = user.formData()
        })
      },

      //保存用户
      addUserSave(){
        saveUser(this.taskForm).then(res=>{
          // console.log(res)
          if(res.status===200){
            this.$notify({
              title: '成功',
              message: '保存用户成功!',
              type: 'success',
              duration: 2000
            });
            this.$emit('sucssce')
            this.closeDetail()
          }
        })
      },

      //提交表单
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.taskForm.roleList = [{
              "roleId":this.taskForm.checkedRoles
            }]
            // console.log(this.taskForm)
            if(this.taskForm.loginId){
              this.addUserSave()
              return
            }
            exsitUsername(this.taskForm.loginName).then(res=>{
              if(res.status===200){
                if(res.data==="0"){
                  this.addUserSave()
                }else{
                  this.$notify({
                    title: '警告',
                    message: '该登录名已存在',
                    type: 'warning',
                    duration:2000
                  });
                }
              }
            })
          }
        })
      },
      //重置表单
      resetForm() {
        this.checkAll=false
        this.taskForm.loginId="";
        this.taskForm.openid="";
        this.taskForm.userType="";
        this.taskForm.roleList=[];
        this.taskForm.jobNo="";
        this.taskForm.checkedRoles=""
        this.$refs['taskForm'].resetFields();
      }
    },
    mounted(){
      this.searchOffice()
    }
  }
</script>

<style scoped lang="less">
.add-info{
  position: fixed;
  top: 81px;
  right: 0;
  bottom: 0;
  width: 420px;
  background: #fff;
  box-shadow:0px 0px 1px #999;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
}
.close-icon{
  position: absolute;
  right: 15px;
  top: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.demo-ruleForm{
  margin-top: 40px;
}
.footer-btn{
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  &>button{
    margin: 0 30px;
  }
}
.base-input{
	flex: none;
	display: flex;
	align-items: center;
	width:200px;
	border-radius: 2px;
	border: 1px solid #ccc;
}
.base-check{
	flex: none;
  display: flex;
  flex-flow: column;
	align-items: flex-start;
	width:200px;
}
.checkbox-group{
  text-align: left;
}
</style>
