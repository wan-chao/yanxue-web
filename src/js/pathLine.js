export default class PathLine {
    constructor(map,PathSimplifier){
        this.map = map
        this.PathSimplifier = PathSimplifier
    }
    //创建路书组件实例
    create(){
        let pathSimplifierIns = new this.PathSimplifier({
            zIndex: 100,
            map: this.map, //所属的地图实例
            getPath: function(pathData, pathIndex) {
                //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                return pathData.path;
            },
            getHoverTitle: function(pathData, pathIndex, pointIndex) {
                //返回鼠标悬停时显示的信息
                if (pointIndex >= 0) {
                    //鼠标悬停在某个轨迹节点上
                    return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
                }
                //鼠标悬停在节点之间的连线上
                return pathData.name + '，点数量' + pathData.path.length;
            },
            renderOptions: {
                //轨迹线的样式
                pathLineStyle: {
                strokeStyle: 'red',
                lineWidth: 6,
                dirArrowStyle: true
                }
            }
        });
        return pathSimplifierIns
    }
}