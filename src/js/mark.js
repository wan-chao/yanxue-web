export default class Marker {
    constructor(map,position,data){
        this.map = map
        this.imageBlue = require('../assets/images/icon.png'),
        this.imageRed = require('../assets/images/red.png'),
        this.data =data,
        this.position = position
    }
    //创建路书组件实例
    create(){
        var startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(25, 30),
            // 图标的取图地址
            image: this.data.alarm?this.imageRed:this.imageBlue,
            // 图标所用图片大小
            imageSize: new AMap.Size(25, 30),
        });
        this.marker=new AMap.Marker({
            map: this.map,
            position: this.position,
            icon:startIcon,
            offset: new AMap.Pixel(-12, -30)
        })
    }
    setTile(){
        this.marker.setTitle(this.data.locateTime)
    }
    setLabel(){
        this.marker.setLabel({
            offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
            content: "<div class='info'>我是 marker 的 label 标签</div>", //设置文本标注内容
            direction: 'right' //设置文本标注方位
        });
    }
}