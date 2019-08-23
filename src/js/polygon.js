export default class Polygon {
    constructor(map,path){
        this.map = map
        this.path =path
    }
    create(){
        this.polygon = new AMap.Polygon({
            path: this.path,
            strokeColor: "#FF33FF", 
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            fillColor: '#1791fc',
            zIndex: 50,
        })
        this.map.add(this.polygon)
    }
}