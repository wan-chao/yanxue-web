<template>
  <ul class="main-bar">
    <li class="add-btn" @click="add">
      <a class="el-icon-plus"></a>
      <span>新增</span>
    </li>
    <li class="bar-btn" @click="dele">
      <a class="el-icon-delete" ></a>
      <span>批量删除</span>
    </li>
  </ul>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed:{

  },
  methods: {
    add(){
      this.$emit('add')
    },
    dele(){
      this.$emit('dele')
    }
  },
  mounted(){

  }
}
</script>

<style lang="less" scoped>
.main-bar{
  width: 100%;
  display: flex;
  align-items: center;
  margin:20px 0;
  font-size: 14px;
  color: #666;
}
.add-btn{
  width: 82px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  color: #fff;
  background: #2459f0;
  cursor: pointer;
  a{
    padding-right: 6px;
  }
}
.bar-btn{
  width: 104px;
  height: 36px;
  line-height: 36px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #878888;
  cursor: pointer;
  a{
    padding-right: 6px;
  }
}
</style>

