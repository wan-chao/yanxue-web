<template>

  <el-table
    ref="multipleTable"
    :data="list"
    tooltip-effect="dark"
    stripe
    style="width: 100%;"
    :header-cell-style="{background:'#f5f5f5',color:'#333'}">
    <el-table-column
      type="index"
      label="序号"
      align="center"
      width="80">
    </el-table-column>

    <el-table-column
      width="350"
      align="center"
      label="学生姓名">
      <template slot-scope="scope">{{scope.row.studentName}}</template>
    </el-table-column>

    <el-table-column
      prop="studentCode"
      align="center"
      label="学籍号">
    </el-table-column>
    
    <el-table-column
      prop="cardSid"
      align="center"
      label="定位终端编号">
    </el-table-column>

    <el-table-column
      prop="guaNameOne"
      align="center"
      label="监护人1">
    </el-table-column>

    <el-table-column
      prop="guaMobileOne"
      align="center"
      label="监护人1手机">
    </el-table-column>

    <el-table-column
      prop="guaNameTwo"
      align="center"
      label="监护人2">
    </el-table-column>

    <el-table-column
      prop="guaMobileTwo"
      align="center"
      label="监护人2手机">
    </el-table-column>

  </el-table>

</template>

<script>
export default {
  props:{
    list:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return {
    }
	},
  mounted(){
  }
}
</script>

<style lang="less" scoped>

</style>
