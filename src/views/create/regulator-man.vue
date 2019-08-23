<template>

  <div class="base">
    <p>监管人
      <span>说明：移动地址围栏，即：以监管人为圆心，当活动主体（学生）离开移动电子围栏设置的半径后，即进行自动报警。</span>
    </p>

    <!-- <div class="person-list">
      <ul class="person-top">
        <li>历史记录人员</li>
      </ul>
      <el-radio-group v-model="checkedCities" class="person-group" @change="handleCheckedCitiesChange">
        <el-radio v-for="techer in techers" :label="techer" :key="techer.teacherId">{{techer.teacherName}}</el-radio>
      </el-radio-group>

    </div> -->

    <add-dele @add="addClick" @dele="batchDele" v-if="status"></add-dele>

    <el-table
      ref="multipleTable"
      :data="techers"
      tooltip-effect="dark"
      stripe
      @selection-change="handleSelectionChange"
      style="width: 100%;"
      :header-cell-style="{background:'#f5f5f5',color:'#333'}">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column
        label="监管人类型">
        <template slot-scope="scope">{{scope.row.teacherType |userType}}</template>
      </el-table-column>

      <el-table-column
        prop="teacherName"
        label="监管人姓名">
      </el-table-column>
      
      <el-table-column
        prop="mobileNum"
        label="手机号码">
      </el-table-column>

      <el-table-column
        prop="fenceBuffer"
        label="移动电子围栏设置">
      </el-table-column>

      <el-table-column
        prop="officeName"
        label="所属机构">
      </el-table-column>

      <el-table-column
        prop="cardSid"
        label="设备产品编号">
      </el-table-column>

      <el-table-column
        label="操作"
        width="150"
        v-if="status"
        align="center">
        <template slot-scope="scope">
          <span class="edtior-icon" @click="handleEdit(scope.$index, scope.row)"></span>
          <span class="dele-icon" @click="handleDelete(scope.$index, scope.row)"></span>
        </template>
      </el-table-column>

    </el-table>

    <transition name="move">
      <form-box ref="form" :officeList="officeList" v-show="showDailog"  @submit="addList" @close="closeDailog"></form-box>
    </transition>

    <!-- 删除提示框 -->
    <el-dialog
      :lock-scroll="false"
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>确定删除数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfimDelete">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>

</template>

<script>
import AddDele from '@/components/add-dele'
import FormBox from './form-box'
import {teacherSave,teacherDelete} from '@/api/active'
import {filterTeacherType} from '@/config/config'
export default {
  props:{
    status:{
      type:Boolean,
      default:true
    },
    actId:String,
    officeList:{
      type:Array,
      default:()=>[]
    },
    techers:{
      type:Array,
      default:()=>[]
    },
  },
  components: {
    AddDele,FormBox
  },
  filters:{
		userType(data){
			return filterTeacherType(data)
		},
	},
  data(){
    return {
      index:-1,
			action:'write',
      showDailog:false,
      centerDialogVisible:false,
			multipleSelection:[],
			deleList:[],

      checkedCities: [],
    }
  },
	methods:{
    // handleCheckedCitiesChange(value) {
    //   this.showDailog =true
    //   this.$refs.form.editForm(value)
    // },
    closeDailog(){
      this.showDailog=false
      this.checkedCities=[]
    },
    addClick(){
      this.showDailog=true
      this.$refs.form.getDeviceList()
    },
    
		addList(data){
      let list = Object.assign({},data,{actId:this.actId});
      teacherSave(list).then(res=>{
        console.log(res)
        if(res.status===200){
          // this.list.push(list)
          this.$emit('change')
        }
      })
		},

		batchDele(){
			this.deleList = []
			if(this.multipleSelection.length){
				this.centerDialogVisible=true;
				this.deleList.push(...this.multipleSelection);
			}else{
				this.$notify({
          title: '警告',
          message: '请先勾选要删除的数据',
					type: 'warning',
					duration:2000
        });
			}
		},
		//勾选改变时
		handleSelectionChange(val){
			this.multipleSelection=val
		},
		
		handleEdit(index,row){
			this.action="editor";
			this.index = index;
      this.$refs.form.editForm(row)
      this.$refs.form.getDeviceList()
			this.showDailog = true
		},
		handleDelete(index,row){
			this.deleList = []
			this.centerDialogVisible=true;
			this.deleList.push(row) 
		},
		comfimDelete(){
			this.centerDialogVisible=false;
      
			let list=this.deleList.map(v=>{
				return {
          teacherId:v.teacherId,
          actId:this.actId,
          cardSid:v.cardSid
        }
      })

      teacherDelete(list).then(res=>{
        console.log(res)
        if(res.status===200){
          this.$emit('change')
        }
      })
     
		},
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.base{
	width: 1400px;
	height: 100%;
	margin: 0 auto;
	&>p{
		text-align: left;
		font-size: 18px;
		padding: 18px 0;
    border-bottom: 1px dashed #ccc;
    &>span{
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }
	}
}
.move-enter-active, .regitWrap .move-leave-active {
  transition: all 0.3s linear;
  transform: translate3d(0, 0, 0);
}
.move-enter, .regitWrap .move-leave {
  transform: translate3d(100%, 0, 0);
}
.edtior-icon{
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0 5px;
  background: url('../../assets/images/bianji.png') no-repeat;
  background-size:100% 100%;
  cursor: pointer;
  &:hover{
    background: url('../../assets/images/bainji01.png') no-repeat;
    background-size:100% 100%;
  }
}
.dele-icon{
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0 5px;
  background: url('../../assets/images/dele.png') no-repeat;
  background-size:100% 100%;
  cursor: pointer;
  &:hover{
    background: url('../../assets/images/dele01.png') no-repeat;
    background-size:100% 100%;
  }
}
.person-list{
  padding-top: 20px;
}
.person-top{
  display: flex;
  align-items: center;
  li{
    margin-right: 10px;
  }
}
.person-group{
  display: flex;
  flex-flow: row wrap;
  margin-top: 20px;
}
</style>
