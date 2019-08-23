<template>
  <ul class="card" @click="cardInfo">
    <li class="title">{{card.newsTitle}}</li>
    <li class="detail" v-html="card.newsContent"></li>
    <ul class="footer">
      <li>关键词：<span>{{card.createBy}}</span></li>
      <li>{{card.createDate}}</li>
    </ul>
    <button class="btn" @click.stop="cardDetele" v-if="show">撤销</button>
  </ul>
</template>

<script>
import {cmsDelete} from '@/api/information'
export default {
  props:{
    card:Object,
    show:{
      type:Boolean,
      default:false
    }
  },
  components: {
  },
  data(){
    return {
    }
  },
  methods:{
    cardInfo(){
      this.$router.push({
        path: '/increase',
        query: {
          id: this.card.newsId
        }
      })
    },
    cardDetele(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cmsDelete(this.card.newsId).then(res=>{
          console.log(res)
          if(res.status===200){
            this.$notify({
              title: '成功',
              message: '撤销信息成功!',
              type: 'success',
              duration: 2000
            });
            this.$emit('detele')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.card{
  position: relative;
  width: 100%;
  height: 105px;
  margin-top: 20px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  &>li{
    padding-top: 15px;
  }
}
.title{
  width: 60%;
  font-size: 16px;
  color: #333;
  font-weight: bold;
}
.detail{
  width: 60%;
  height: 20px;
  font-size: 14px;
  text-overflow: ellipsis; //超出部分以省略号显示
 	white-space: nowrap;
	overflow: hidden;
  color: #777;
}
.footer{
  display: flex;
  margin-top: 15px;
  font-size: 14px;
  color: #666;
  &>li{
    margin-right: 20px;
  }
  span{
    color: #f4504e;
  }
}
.btn{
  position: absolute;
  right: 45px;
  top: 45px;
  font-size: 16px;
  color: #666;
  background: none;
  cursor: pointer;
}

</style>
