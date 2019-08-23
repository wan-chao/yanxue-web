export default class User {
    constructor({jobNo,loginId,loginName,mobile,officeId,officeName,roleList,userName,userType}){
        this.jobNo = jobNo
        this.loginId = loginId
        this.loginName = loginName
        this.mobile = mobile
        this.officeId = officeId
        this.officeName = officeName
        this.roleList = roleList
        this.userName = userName
        this.userType = userType
    }
    formData(){
        return {
            loginId:this.loginId,
            loginName:this.loginName,
            openid:'',
            userName:this.userName,
            userType:this.userType,
            officeId:this.officeId,
            officeName:this.officeName,
            mobile:this.mobile,
            roleList:[],
            checkedRoles:this.initCheckedRoles(),
            jobNo:this.jobNo,
        }
    }
    initCheckedRoles(){
        let arr = this.roleList.map(v=>{
            return v.roleId
        })
        return arr.join('')
    }
}