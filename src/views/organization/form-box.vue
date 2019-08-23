<template>
  <div class="add-info">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      label-width="120px"
      size="small"
      class="demo-ruleForm">

      <el-form-item label="机构类型：" prop="officeType" required>
        <div class="base-input">
          <el-select v-model="taskForm.officeType"  clearable  placeholder="请选择机构类型" @change="officeChange">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="机构名称：" prop="officeName" required>
        <div class="base-input">
          <el-input v-model="taskForm.officeName" placeholder="请输入机构名称"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="上级机构：" v-show="hide" prop="parentId" required>
        <div class="base-input">
          <tree-select ref="tree" @getValue="treeChangeSelect" :value="taskForm.parentId" :props="propData" :options="options"></tree-select>
        </div>
      </el-form-item>

      <el-form-item label="机构地址：" prop="address" required>
        <div class="base-input">
          <el-input v-model="taskForm.address" placeholder="请输入地址"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="生效时间：" prop="startTime" required>
        <div class="base-input">
          <el-date-picker v-model="taskForm.startTime" format="yyyy-MM -dd  HH:mm" type="datetime" placeholder="选择生效日期"></el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="失效时间：" prop="endTime" required>
        <div class="base-input">
          <el-date-picker v-model="taskForm.endTime" format="yyyy-MM -dd  HH:mm" type="datetime" placeholder="选择失效日期"></el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="联系人：" prop="master" required>
        <div class="base-input">
          <el-input v-model="taskForm.master" placeholder="请输入联系人"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="联系电话：" prop="phone" required>
        <div class="base-input">
          <el-input v-model="taskForm.phone" placeholder="请输入手机或座机号"></el-input>
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
  import {OFFICE_LIST} from '@/config/config'
  import {officeSave,officeTree} from '@/api/organization'
  import {formatDate} from '@/util/common'
  import Organization from '@/js/organization'
  import TreeSelect from '@/components/tree-select'
  export default {
    props:{
      treeData:{
        type:Array,
        default:()=>[]
      },
      educationTree:{
        type:Array,
        default:()=>[]
      },
    },
    components:{
      TreeSelect
    },
    data(){
      return {
        types:OFFICE_LIST,
        taskForm: {
          officeId:'',
          officeName:'',
          startTime:'',
          endTime:'',
          parentId:'',
          officeType:'',
          address:'',
          master:"",
          phone:''
        },
        parentName:'',
        options:[],
        propData:{
          checkStrictly: true,
          value:'id',
          label:'officeName',
          children:'children'
        },
        hide:true,
        rules: {
          officeType: [
            { required: true, message: '请选择机构类型'}
          ],
          officeName: [
            { required: true, message: '请输入机构名称'},
          ],
          parentId: [
            { required: true, message: '请选择上级机构'},
          ],
          startTime: [
            { required: true, message: '请选择生效时间'},
          ],
          endTime: [
            { required: true, message: '请选择失效时间'},
          ],
          address: [
            { required: true, message: '请输入地址'},
          ],
          master: [
            { required: true, message: '请输入联系人'},
          ],
          phone: [
            {required: true, message: '请输入手机号码'},
          ],
        }
      }
    },
    computed:{
			undertakeTree(){ //承办方列表
        if(this.treeData.length){
          return this.treeData.filter(v=>{
            return v.officeType === '12'
          })
        }else{
          return []
        }
      },
			supplyTree(){ //供应方列表
        if(this.treeData.length){
          return this.treeData.filter(v=>{
            return v.officeType === '13'
          })
        }else{
          return []
        }
      },
			regulatorTree(){ //运营
        if(this.treeData.length){
          return this.treeData.filter(v=>{
            return v.officeType === '15'
          })
        }else{
          return []
        }
      },
    },
    methods: {
      closeDetail(){
        this.clearForm()
        this.$emit('close')
      },
      treeChangeSelect(val){
        // console.log('????',val)
        this.taskForm.parentId=val?val:''
      },
      searchParentName(arr,val){
        arr.forEach(element => {
          if(element.parentId === val){
            // console.log('??',element)
            this.parentName=element.parentName
          }else{
            return this.searchParentName(element.children,val)
          }
        });
      },
      searchOffice(type){
        officeTree(type).then(res=>{
          console.log('99',res)
          if(res.status===200){
            if(res.data.length){
              this.options = res.data
            }
          }
        })
      },
      officeChange(val){
        this.$refs.tree.clearHandle()
        if(val === "11"){
          this.hide =true
          this.options = this.educationTree
        } else if(val === "12"){
          this.hide =false
          this.options = this.undertakeTree
          this.$nextTick(()=>{
            this.taskForm.parentId = '2'
          })
        } else if(val === '13'){
          this.hide =false
          this.options = this.supplyTree
          this.$nextTick(()=>{
            this.taskForm.parentId = '3'
          })
        } else if(val === "14"){
          this.hide =true
          this.options = this.educationTree
        } else if(val === '15'){
          this.hide =false
          this.options = this.regulatorTree
          this.$nextTick(()=>{
            this.taskForm.parentId = '4'
          })
        } else{
          this.options = []
        }
      },
      editForm(data){
        console.log('编辑',data)
        let organization =new Organization(data)
        this.officeChange(organization.officeType)
        this.$nextTick(()=>{
          this.taskForm = organization.formData();
        })
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // console.log(this.taskForm)
            this.taskForm.startTime = formatDate(this.taskForm.startTime,'second')
            this.taskForm.endTime = formatDate(this.taskForm.endTime,'second')
            officeSave(this.taskForm).then(res=>{
              if(res.status===200){
                this.$notify({
                  title: '成功',
                  message: '保存机构成功!',
                  type: 'success',
                  duration: 2000
                });
                this.searchParentName(this.options,this.taskForm.parentId)
                let data = {
                  id:this.taskForm.officeId,
                  officeType:this.taskForm.officeType,
                  officeName:this.taskForm.officeName,
                  startTime:this.taskForm.startTime,
                  endTime:this.taskForm.endTime,
                  parentId:this.taskForm.parentId,
                  parentName:this.parentName,
                  address:this.taskForm.address,
                  telephone:this.taskForm.phone,
                  master:this.taskForm.master,
                }
                this.$emit('addSucc',data)
                this.closeDetail()
              }
            })
          }
        })
      },
      clearForm(){
        this.$refs.taskForm.resetFields();
        this.taskForm.parentId =''
        this.taskForm.officeId =''
        this.parentName=''
        this.options=[]
        this.$refs.tree.clearHandle()
      }
    },
    mounted(){
    }
  }
</script>

<style scoped lang="less">
.add-info{
  width: 100%;
  height: 100%;
  color: #666;
  font-size: 16px;
  padding: 30px 0;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
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
</style>
