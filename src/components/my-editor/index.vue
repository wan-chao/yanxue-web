<template>
  <quill-editor ref="myTextEditor"
    class="quill-editor"
    v-model="content"
    :options="editorOption"
    @change="onEditorChange($event)"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)">
  </quill-editor>
</template>

<script>
export default {
  props:{
    height:{
      default :100,
      type:Number
    },
    text:{
      default : '',
      type:String
    }
  },
  components: {
  },
  data () {
    return {
      content: '',
      editorOption: {
        // something config
        modules:{
          toolbar:[
            ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'],     //引用，代码块

            [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
            [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
            [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
            [{ 'direction': 'rtl' }],             // 文本方向

            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题

            [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
            [{ 'font': [] }],     //字体
            [{ 'align': [] }],    //对齐方式

            ['clean'],    //清除字体样式
            ['image','video']    //上传图片、上传视频
          ]
        },
        placeholder:'请输入内容...',
        theme:'snow'
      }
    }
  },
  watch : {
    text(newVal){
      console.log('777777',newVal)
      this.content = newVal
    } 
  },
  computed:{
    editor() {
      return this.$refs.myTextEditor.quillEditor
    }
  },
  methods: {
    onEditorBlur(editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
    },
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.content = html
      this.$emit('change',this.content)
    },
    changeContent(data){
      this.content = data
    }
  },
  mounted(){
    // console.log(this.editor)
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  height: 80%;
 }
</style>

