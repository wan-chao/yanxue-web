<template>
	<el-tree 
    class="tree"
    ref="tree"
		:data="list" 
		:props="defaultProps"
    node-key="id"
    :default-expand-all="true" 
    :highlight-current="true" 
    :default-checked-keys="checkKeys"
		@node-click="handleNodeClick" 
		:render-content="renderContent">
	</el-tree>
</template>

<script>
export default {
  props:{
    list:{
      type:Array,
      default:()=>[]
    },
    checkKeys:{
      type:Array,
      default:()=>[]
    }
  },
  components: {
  },
  data () {
    return {
			defaultProps: {
				children: 'children',
        label: 'officeName',
      },
    }
  },
  computed:{
  },
  methods: {
		handleNodeClick(data,node) {
      this.$emit('edit',data)
      console.log(data,node);
    },
    renderContent(h, { node, data, store }) {
      if(data.children.length){
        return (
          <span class="custom-tree-node">
            <span class="el-icon-folder"></span>
            <span style="padding:5px">{node.label}</span>
          </span>
        )
      } else {
        return (
          <span class="custom-tree-node">
            <span class="el-icon-document"></span>
            <span style="padding:5px">{node.label}</span>
          </span>
        )
      }
    }
	},
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.tree{
  width: 100%;
  color: #333;
  background: transparent;
}
</style>

