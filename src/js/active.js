export default class Active {
    constructor({actStatus,actId,actCode,actName,actDocUri,organizerId,undertakeId,supplyId,ossImg,ossCourse,ossEmergency,supplyName,undertakeName,organizerName,startTime,endTime,course,emergencyPlan,actServiceList,actSchedulesList,imgUrl,teacherList,studentList}){
        this.actId = actId
        this.actCode = actCode
        this.actStatus = actStatus
        this.actName = actName
        this.organizerId = organizerId
        this.actDocUri = actDocUri
        this.organizerName = organizerName
        this.undertakeId = undertakeId
        this.undertakeName = undertakeName
        this.supplyId = supplyId
        this.supplyName = supplyName
        this.startTime = startTime
        this.endTime = endTime
        this.course = course
        this.emergencyPlan = emergencyPlan
        this.actSchedulesList = actSchedulesList
        this.actServiceList = actServiceList
        this.imgUrl = imgUrl
        this.ossImg = ossImg
        this.ossCourse = ossCourse
        this.ossEmergency = ossEmergency
        this.teacherList = teacherList
        this.studentList = studentList
    }
    formData(){
        return {
            actId:this.actId,
            actName:this.actName,
            organizerId:this.organizerId,
            undertakeId:this.undertakeId,
            supplyId:this.supplyId,
            startTime:'',
            endTime:'',
            imgUrl:'',
            actStatus:this.actStatus,
            actDocUri:this.actDocUri,
            actSchedulesList:this.actSchedulesList,
            actServiceList:this.actServiceList,
            emergencyPlan:this.emergencyPlan,
            course:this.course,
        }
    }
    initStudent(){
        return this.studentList.map(item=>{
            let guardianMobile = item.guardianMobile.split(',')
            let guardianName = item.guardianName.split(',')
            return {
                cardSid:item.cardSid,
                guaMobileOne:guardianMobile[0],
                guaNameOne:guardianName[0],
                guaMobileTwo:guardianMobile[1]?guardianMobile[1]:'无',
                guaNameTwo:guardianName[1]?guardianName[1]:'无',
                schoolId:item.schoolId,
                studentName:item.studentName,
                studentCode:item.studentCode,
                studentId:item.studentId,
            }
        })
    }
    initSchedule(){
        return this.actSchedulesList.map(v=>{
            return {
                stepId:v.stepId,
                scheduleId:v.scheduleId,
                scheduleContent:v.scheduleContent,
                endTime:v.endTime,
                chargeOffice:v.chargeOffice,
                beginTime:v.beginTime,
                arrivePlaceName:v.arrivePlaceName,
                workList:v.workList,
            }
        })
    }
    initOffice(){
        return [
            {officeName:this.organizerName,officeId:this.organizerId,officeType:'11'},
            {officeName:this.undertakeName,officeId:this.undertakeId,officeType:'12'},
            {officeName:this.supplyName,officeId:this.supplyId,officeType:'13'},
        ]
    }
}