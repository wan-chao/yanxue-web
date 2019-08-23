<template>
    <div class="content" @click="goReport">
        <ul class="list-title">
            <li class="title-icon" ref="icon"></li>
            <li class="title-txt">{{title}}</li>
        </ul>
        <div class="list-top">
            <ul class="list-content" :class="{anim:animate==true}">
                <li v-for='(item,index) in items' :key="index" @click.stop="goDetail(item)" v-if="title===TYPES.REPORT" class="list-item">
                    <ul class="item-msg">
                        <li class="item-title">{{item.msg}}
                            <span class="item-track" v-if="item.type==='alarm'" @click.stop="alarmClick(item)">查看轨迹</span>
                        </li>
                        <li class="txt-time">{{item.time}}</li>
                    </ul>
                </li>
                <li v-for='(item,index) in items' :key="index" v-if="title===TYPES.INFORMATION" class="list-item">
                    <div class="item-title">【{{item.newsTitle}}】</div>
                    <ul class="item-txt">
                        <li class="txt-detail" v-html="item.newsContent"></li>
                        <li class="txt-time">{{item.createDate}}</li>
                    </ul>
                </li>
                <li v-show="!items.length" class="not-txt">{{title===TYPES.INFORMATION?'暂无其他新闻':'暂无动态播报'}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import {isEmpty} from '@/util/common'
import {TYPE} from '@/config/config'
export default {
    props:{
        color:String,
        title:String,
        list:{
            type:Array,
            default:()=>[]
        },
        userType:{
            type:String,
            default:''
        },
    },
    data () {
        return {
            animate:false,
            TYPES:{
                REPORT:'动态播报',
                INFORMATION:'其他新闻'
            }
        }
    },
    computed:{
        items(){
            return this.list
        },
        markDisabled(){
            if(this.userType === TYPE.JG){
                return true
            }else{
                return false
            }
        },
    },
    mounted(){
        this.timer&&clearInterval(this.timer)
        this.$refs.icon.style.background=this.color;
    },
    watch:{
        items(newVal){
            if(newVal.length>6){
                if(isEmpty(this.timer)){
                    this.timer=setInterval(this.scroll,3000)
                }
            }else{
                this.timer&&clearInterval(this.timer)
            }
        }
    },
    methods: {
        alarmClick(data){
            console.log(data)
			this.$router.push({
                path: '/map',
                query: {
                    actId:data.actId,
                    alarmId:data.recordIdId
                }
            })
		},
        goReport(){
            if(this.title === this.TYPES.REPORT){
                this.$router.push('/report')
            }else if(this.title === this.TYPES.INFORMATION){
                this.$router.push('/information')
            }
        },
        goDetail(item){
            console.log(item)
            if(item.type === "notify"){
                if(this.markDisabled){
                    this.$router.push({
                        path: '/details',
                        query: {
                            id: item.actId
                        }
                    })
                }else{
                    this.$router.push({
                        path: '/create',
                        query: {
                            id: item.actId
                        }
                    })
                }
                
            }else{
                this.$router.push('/report')
            }
        },
        scroll(){
            this.animate=true;
            setTimeout(()=>{    
                this.items.push(this.items[0]);
                this.items.shift();       
                this.animate=false; 
            },500)
        }
    }

}
</script>

<style lang="less" scoped>
.content{
    width: 100%;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 10px;
    cursor: pointer;
}
.list-top{
    width: 100%;
    height: 370px;
    // max-height: 427px;
    padding-left: 30px;
    overflow: hidden;
}
.list-title{
    height: 30px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    .title-icon{
        width: 8px;
        height: 100%;
        border-radius: 4px;
    }
    .title-txt{
        font-size: 20px;
        color: #313f66;
        padding-left: 26px;
    }
}

.list-content{
    width: 95%;
    overflow: hidden;
}
.anim{
    transition: all 0.5s;
    margin-top: -70px;
}
.list-item{
    text-align: left;
    list-style: none;
    border-bottom: 1px solid #ededed;
    height: 70px;
    .item-title{
        width: 90%;
        line-height: 30px;
        font-size: 18px;
        padding: 10px 0;
        color: #313f66;
        overflow: hidden;
        .item-track{
            margin-left: 50px;
            padding: 5px 15px;
            font-size: 14px;
            color: #fff;
            background: #4b8dec;
            border-radius: 20px;
            cursor: pointer;
        }
    }
}
.item-txt{
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    margin-top: 6px;
    font-size: 14px;
    color: #939fbd;
}
.item-msg{
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    margin-top: 6px;
    font-size: 14px;
    color: #939fbd;
}
.txt-detail{
    width: 85%;
    height: 15px;
    overflow: hidden;
}
.txt-time{
    height: 15px;
    overflow: hidden;
}
.not-txt{
    padding-top: 50px;
}
</style>

