<template>
  <el-upload
    ref="upload"
    :multiple="multiple" 
    :accept="accept"
    :limit="limit"
    :show-file-list="false"
    :file-list="fileList"
    :auto-upload="false"
    :on-change="handleChange" 
    :before-upload="beforeUpload" 
    :on-success="handleSuccess"
    :on-error="handleError"
    action="https://jsonplaceholder.typicode.com/posts/">
    <slot></slot>
  </el-upload>
</template>

<script>

export default {
  props:{
    multiple:{
      type:Boolean,
      default:false
    },
    limit:{
      type:Number,
      default:1
    },
    accept:{
      type:String,
      default:"image/png, image/jpeg, image/gif, image/jpg"
    }
  },
  components: {
  },
  data () {
    return {
      fileList:[]
    }
  },
  computed:{
  },
  methods: {
    clearFile(){
      this.fileList=[]
    },
    //删除要上传的图片
    deleteFile(file){
      let index = this.fileList.findIndex(v=>{
        return v.name === file
      })
      this.fileList.splice(index,1)
    },
    //选择的图片发生变化是
    handleChange(file, fileList){
      console.log('56',fileList)
      this.fileList = fileList
      const isLt2M = fileList[0].size / 1024 / 1024 < 50  //这里做文件大小限制
      if(!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 50MB!',
          type: 'warning'
        });
        return
      }
      let urlList = this.fileList.map(v=>{
        return {
          name: v.name,
          url : URL.createObjectURL(v.raw),
          file: v.raw
        }
      })
      this.$emit('preview',urlList)
    },
    //图片上传前
    beforeUpload(file){
      console.log(file,file.size)
    },
    //图片上传成功
		handleSuccess(res, file,fileList){
			console.log(res,file)
    },
    //图片上传错误
		handleError(err, file, fileList){
			console.log(err)
    },
    //上传图片
		submitUpload() {
			this.$refs.upload.submit();
		},
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
</style>

