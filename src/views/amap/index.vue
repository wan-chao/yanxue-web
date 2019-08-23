<template>
  <div class="map">
		<my-header></my-header>
    <div class="map-content">
      <div id="allmap"></div>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header'
import {MAP_OPTS} from '@/config/config'
import PathLine from '@/js/pathLine'
import {trace} from '@/api/report'
import Marker from '@/js/mark'
import Polygon from '@/js/polygon'
export default {
  name: 'amap',
  components: {
		MyHeader
  },
  data(){
    return {
      points:[],
      fences:[],
      lines:[
        {
          name: '学生轨迹',
          path: []
        }, 
      ]
    }
	},
	computed:{
    linePoint(){
      let list = []
      this.points.forEach(point=>{
        list.push([
          point.locateX,
          point.locateY
        ])
      })
      return list
    }
	},
	methods:{
    getTrace(){
      let {actId,alarmId} = this.$route.query
      if(!alarmId) return;
      trace(actId,alarmId).then(res=>{
        console.log(res)       
        if(res.status===200){
          this.points = res.data.locates
          this.fences = res.data.fences
          this.initMapData()
        }
			})
    },
    //地图初始化
    initMapData(){
      this.map.on("complete", this.mapComplete);
      if(!this.points.length){
        this.$message.error('未查到轨迹点!');
        return
      }
      this.drawPoints()
      this.drawPolygon()
      AMapUI.load(['ui/misc/PathSimplifier'],this.uiPathSimplifier);
    },
    //初始化轨迹组件
    uiPathSimplifier(PathSimplifier){
      if (!PathSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！');
        return;
      }
      //启动页面
      this.initPage(PathSimplifier);
    },
    initPage(PathSimplifier){
      //创建组件实例
      let pathSimplifierIns = new PathLine(this.map,PathSimplifier).create()

      this.lines[0].path = this.linePoint

      //这里构建两条简单的轨迹，仅作示例
      pathSimplifierIns.setData(this.lines);

      //创建一个巡航器 ,关联第1条轨迹
      let navg0 = pathSimplifierIns.createPathNavigator(0, {
        loop: true, //循环播放
        speed: 100
      });

      navg0.start();
    },
    //绘制多个点
    drawPoints(){
      this.points.forEach(point=>{
        let position = [point.locateX,point.locateY]
        let marker = new Marker(this.map,position,point)
        marker.create()
        marker.setTile()
      })
      // 地图自适应显示到合适的范围内
      this.map.setFitView()
    },
    //绘制电子围栏
    drawPolygon(){
      this.fences.forEach(fence=>{
        let point = fence.shapePoints
        let polygon = new Polygon(this.map,point)
        polygon.create()
      })
    },
    mapComplete(){
      console.log('地图加载完成')
    }
	},
  mounted(){
    this.getTrace()
    this.map = new AMap.Map('allmap',MAP_OPTS);
  },
  destroyed(){
    this.map&&this.map.destroy();
  }
}
</script>

<style lang="less" scoped>
.map{
  width: 100%;
  height: 100%;
}
.map-content{
  width: 100%;
  height: 100%;
}
#allmap{
  width: 100%;
  height: 100%;
}
</style>
