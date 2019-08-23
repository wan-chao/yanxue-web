<template>
  <vxe-table
    :data.sync="treeData"
    :tree-config="{children: 'children'}">
    <vxe-table-column type="index" title="序号" tree-node></vxe-table-column>
    <vxe-table-column field="officeName" title="机构名称"></vxe-table-column>
    <vxe-table-column field="id" title="机构ID"></vxe-table-column>
    <vxe-table-column field="startTime" title="生效时间" :formatter="formatTime"></vxe-table-column>
    <vxe-table-column field="endTime" title="失效时间" :formatter="formatTime"></vxe-table-column>
  </vxe-table>
</template>

<script>
export default {
  props:{
    treeData:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return {
    }
  },
  computed:{
  },
  methods: {
    formatTime ({ cellValue, row, column }) {
			return cellValue?cellValue:'无'
		},
  },
  mounted(){
  }
}
</script>

<style scoped lang="less">

</style>
