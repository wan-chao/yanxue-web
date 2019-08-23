export default class Organization {
    constructor({address,master,officeCode,id,officeName,startTime,endTime,officeType,telephone,parentId,parentName}){
        this.address = address
        this.master = master
        this.officeCode = officeCode
        this.officeId = id
        this.parentId = parentId
        this.officeName = officeName
        this.officeType = officeType
        this.telephone = telephone
        this.startTime = startTime
        this.parentName = parentName
        this.endTime = endTime
    }
    formData(){
        return {
            officeId:this.officeId,
            officeName:this.officeName ,
            startTime:this.startTime,
            endTime:this.endTime,
            parentId:this.parentId,
            officeType:this.officeType,
            address:this.address,
            master:this.master,
            phone:this.telephone
        }
    }
}