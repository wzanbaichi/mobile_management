<template>
    <div id="advice-info">
        <myHeader :title="title"></myHeader>
        <div class="infoIndex">
            <el-row>
                <el-col :span="8">
                    <img class="infoImg" src="../images/tou.png">
                </el-col>
                <el-col :span="14" class="baseInfo">
                    <div>
                        <span>ITV账号：</span>
                        <span>{{baseInfo.itvaccount}}</span>
                    </div>
                    <div>
                        <span>MAC地址：</span>
                        <span>{{baseInfo.mac}}</span>
                    </div>
                    <div>
                        <span>机顶盒型号：</span>
                        <span>{{baseInfo.model}}</span>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="infoText" @click="getList">
            <span class="textItem"><i class="iconfont icon-xiaoxi selfMessage"></i>&nbsp;&nbsp;&nbsp;以往建议</span>
            <i class="iconfont icon-iconfontyoujiantou selfjiantou"></i>
        </div>

        <div class="infoText">
            <div class="infoContent">
                <span><i>*</i>您为我们提供一下哪些建议呢？</span>
                <div @click="handleType">
                    <el-row>
                        <el-col v-for="(item, index) in typeArray" :key="item.id" :span="8">
                            <span @click="selectType(index)">
                                <el-tag :class="item.typeClass"  @click="selectType(index)">{{item.name}}</el-tag>
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="infoMobile">
                <div class="infoContent">
                    <span><i>*</i>请输入您的手机号码，以方便给您反馈</span>
                    <span>您的手机号码可能是：</span>
                    <div @click="handleClick">
                        <el-row >
                            <el-col v-for="(item, index) in mobiles" :key="index" :span="8">
                                <span @click="selectMobile(index)">
                                    <el-tag :class="item.mobileClass">{{item.number}}</el-tag>
                                </span>
                            </el-col>
                        </el-row>
                    </div>
                    <span @click="dialogMobile = true">
                        <el-tag class="defaultTag">以上号码都不是，点击添加</el-tag>
                    </span>
                </div>
            </div>
            <div class="bottomContent">
                <div class="infoContent">
                <span><i>*</i>请留下您的宝贵建议</span>
                <textarea v-model="infoParam.content" rows="3" class="adviceArea"></textarea>
                </div>
                <div  class="applyButton">
                    <el-button type="primary" @click="apply">提交</el-button>
                </div>
            </div>
        </div>

        <el-dialog v-if="dialogMobile" :visible.sync="dialogMobile">
            <el-row>
                <el-col :span="5" class="mobileText">
                    <span>手机号：</span>
                </el-col>
                <el-col :span="18">
                    <el-input placeholder="请输入手机号" v-model="newMobile" @change="changeWarning"></el-input>
                </el-col>
            </el-row>

            <span class="pormpt">{{warningMobile}}</span>

            <el-row class="codeItem">
                <el-col :span="5" class="mobileText">
                    <span>验证码：</span>
                </el-col>
                <el-col :span="9">
                    <el-input placeholder="请输入验证码" v-model="newCode"></el-input>
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" @click="getCode" :disabled="isDisabled">{{codeButton}}</el-button>
                </el-col>
            </el-row>
            <span class="pormpt">{{warningCode}}</span>

            <div class="buttonGroup">
                <el-button type="primary" @click="addMobile">确定</el-button>
                <el-button type="info" @click="dialogMobile = false, warningCode = '', warningMobile = '', newMobile = '', countDown = 0, newCode = '', currentCode = ''">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import head from '../components/header.vue'
import Encrypt from '../assets/js/encrypt'
import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
export default {
    name: 'app',
    data(){
        return {
            title: '优化建议',
            typeArray: [],
            formerType: undefined,
            baseInfo: {},
            mobiles: [],
            formerMobile: undefined,
            dialogMobile: false,
            isDisabled: false,
            codeButton: '获取验证码',
            countDown: 60,
            urlHeader: 'interactive',
            infoParam: {
                itvId: '',
                timestamp: new Date().getTime(),
                mobile: '',
                content: '',
                classifyId: ''
            },
            newMobile: '',
            newCode: '',
            currentCode: '',
            warningMobile: '',
            warningCode: ''
        }
    },
    components:{
        "myHeader":head
    },
    mounted: function() {
        this.infoParam.itvId = this.$route.query.itvId;
        this.getInfo();
        this.getType();
    },
    methods: {
        selectType(index) {
            if(this.typeArray[index].typeClass === 'defaultTag') {
                if(this.formerType >= 0 && this.formerType != index) {
                    this.typeArray[this.formerType].typeClass = 'defaultTag';
                    Vue.set(this.typeArray,this.formerType,this.typeArray[this.formerType])
                }
                this.typeArray[index].typeClass = 'activeTag';
                this.formerType = index;
                Vue.set(this.typeArray,index,this.typeArray[index]);
                return;
            }
            if(this.typeArray[index].typeClass === 'activeTag') {
                this.typeArray[index].typeClass = 'defaultTag';
                Vue.set(this.typeArray,index,this.typeArray[index]);
                return;
            }
        },
        selectMobile(index) {
            if(this.mobiles[index].mobileClass === 'defaultTag') {
                if(this.formerMobile >= 0 && this.formerMobile != index) {
                    this.mobiles[this.formerMobile].mobileClass = 'defaultTag';
                    Vue.set(this.mobiles,this.formerMobile,this.mobiles[this.formerMobile])
                }
                this.mobiles[index].mobileClass = 'activeTag';
                this.formerMobile = index;
                Vue.set(this.mobiles,index,this.mobiles[index])
                return;
            }
            if(this.mobiles[index].mobileClass === 'activeTag') {
                this.mobiles[index].mobileClass = 'defaultTag';
                Vue.set(this.mobiles,index,this.mobiles[index])
                return;
            }
        },
        getInfo() {
            let timestamp = Encrypt.encryptStr('timestamp=' + this.infoParam.timestamp);
            axios.get(this.urlHeader + '/home/getUserInfo',{params:this.infoParam,headers:{
                "Authorization": timestamp
            }})
            .then(response=> {
                let result = JSON.parse(response.data.data);
                
                this.baseInfo = result;
                for(let key in JSON.parse(result.activityPhone)) {
                    if(JSON.parse(result.activityPhone).hasOwnProperty(key)) {
                        let mobileItem = {};
                        mobileItem.number = key;
                        mobileItem.mobileClass = 'defaultTag';
                        this.mobiles.push(mobileItem);
                    }
                }
            })
            .catch(response=> {
            });
        },
        getType() {
            let timestamp = Encrypt.encryptStr('timestamp=' + this.infoParam.timestamp);
            axios.get(this.urlHeader + '/proposal/getProposalTypes',{params:{timestamp:this.infoParam.timestamp},headers:{
                "Authorization": timestamp
            }})
            .then(response=> {
                this.typeArray = response.data.data;
                for(let i=0; i<this.typeArray.length; i++) {
                    this.typeArray[i].typeClass = 'defaultTag'
                }
            })
            .catch(response=> {
            });
        },
        apply() {
            if(!this.infoParam.mobile) {
                this.$message({
                    message: '警告，手机号不能为空!',
                    type: 'warning'
                });
                return false;
            }
            if(!this.infoParam.classifyId) {
                this.$message({
                    message: '警告，分类不能为空!',
                    type: 'warning'
                });
                return false;
            }
            if(!this.infoParam.content) {
                this.$message({
                    message: '警告，建议内容不能为空!',
                    type: 'warning'
                });
                return false;
            }
            if(this.infoParam.mobile && this.infoParam.classifyId && this.infoParam.content) {
                let timestamp = Encrypt.encryptStr('timestamp=' + this.infoParam.timestamp);
                axios.post(this.urlHeader + '/proposal/collect',qs.stringify(this.infoParam),{
                    headers:{
                        "Authorization": timestamp
                    }
                })
                .then(response=> {
                    if(response.data.message === '成功') {
                        this.$router.push({path:'/AdviceSuccess'});
                    }
                })
                .catch(response=> {
                });
            }
        },
        changeWarning() {
            if(this.newMobile) {
                this.warningMobile = '';
            }
        },
        addMobile() {
            if(!this.newCode) {
                this.warningCode = '*验证码不能为空！'
            }
            if(this.newCode && this.newCode != this.currentCode) {
                this.warningCode = '*验证码不正确！'
            }
            if(this.newCode && this.newCode === this.currentCode) {
                this.dialogMobile = false;
                this.warningCode = '';
                if(this.formerMobile >= 0) {
                    this.mobiles[this.formerMobile].mobileClass = 'defaultTag';
                    Vue.set(this.mobiles,this.formerMobile,this.mobiles[this.formerMobile])
                }
                this.formerMobile = this.mobiles.length;
                this.infoParam.mobile = this.newMobile;
                this.mobiles.push({number:this.newMobile, mobileClass: 'activeTag'});
                this.warningCode = '';
                this.warningMobile = '';
                this.newMobile = '';
                this.countDown = 0;
                this.newCode = '';
                this.currentCode = '';
            }
        },
        getCode() {
            let hasNumber = false;
            for (var i=0; i<this.mobiles.length; i++) {
                if(this.mobiles[i].number === this.newMobile) {
                    hasNumber = true;
                    this.warningMobile = '*该手机号已存在！'
                    break;
                }
            }
            if(this.newMobile && !hasNumber) {
                this.warningMobile = '';
                this.setTime();
                let timestamp = Encrypt.encryptStr('timestamp=' + this.infoParam.timestamp);
                axios.post(this.urlHeader + '/message/sendMsg',qs.stringify({mobile:this.newMobile,timestamp:this.infoParam.timestamp}),{
                    headers:{
                        "Authorization": timestamp
                    }
                })
                .then(response=> {
                    this.currentCode = response.data.data;
                })
                .catch(response=> {
                });
            }else if(!this.newMobile) {
                this.warningMobile = '*手机号不能为空！'
            }
            
        },
        setTime() {
            if(this.countDown === 0) {
                this.isDisabled = false;
                this.codeButton = '获取验证码';
                this.countDown = 60;
                return false;
            }else {
                this.isDisabled = true;
                this.codeButton = '重新发送' + this.countDown;
                this.countDown --;
            }

            setTimeout(() => {
                this.setTime();
            },1000);
        },
        getList() {
            this.$router.push({path:'/AdviceList'});
        },
        handleClick(e) {
            if(this.infoParam.mobile != e.target.innerText) {
                this.infoParam.mobile = e.target.innerText;
            }else {
                this.infoParam.mobile = '';
            }
            
        },
        handleType(e) {
            for(let i=0; i<this.typeArray.length; i++) {
                if(e.target.innerText === this.typeArray[i].name) {
                    this.infoParam.classifyId = Number(this.typeArray[i].id);
                }
            }
        }
    }
}
</script>

<style>
body {
    background-color: #F1F1F1;
}
.bottomContent {
    height: 100%;
    width: 100%;
    background-color: #ffffff;
}
.infoIndex {
    background-color: #ffffff;
}
.infoImg {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    margin: 15px 0;
}
.baseInfo {
    margin: 15px 0;
    text-align: left;
    line-height: 1.6;
}
.infoText {
    margin-top: 30px;
    text-align: left;
    line-height: 2.8;
    font-size: 32px;
    background-color: #ffffff;
}
.textItem {
    margin-left: 70px;
}
.selfMessage {
    color: #1AAAF3;
}
.selfjiantou {
    float: right;
    margin-right: 30px;
}
.infoContent {
    margin: 10px 70px;
}
.infoContent span i {
    color: #FF0000;
    margin-right: 15px;
}
.infoMobile {
    border-top: 1px solid #DDDDDD;
    border-bottom: 1px solid #DDDDDD;
}
.adviceArea {
    width: 100%;
    background-color: #F1F1F1;
}
.applyButton {
    text-align: center;
    margin-bottom: 195px;
}
.applyButton button {
    width: 240px;
}
.defaultTag {
    color: #000000;
    background-color: #ffffff;
}
.activeTag {
    color: #ffffff;
    background-color: #1A9DE1;
}
.selfSpan {
    padding: 0 10px;
    height: 50px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 4px;
    border: 3px solid rgba(64,158,255,.2);
    display: inline-block;
}
.el-dialog {
    width: 95%;
}
.mobileText {
    line-height: 2.5;
}
.buttonGroup {
    margin-top: 40px;
}
.buttonGroup button {
    width: 230px;
}
.codeItem {
    margin-top: 20px;
}
.mobileButton {
    height: 64px;
    padding: 0 10px;
}
.typeButton {
    width: 180px;
    height: 64px;
    padding: 0 10px;
}
.pormpt {
    width: 300px;
    height: 20px;
    margin-top: 5px;
    margin-right: 160px;
    font-size: 12px;
    line-height: 20px;
    overflow: hidden;
    color:#909399;
    text-align: left;
}
</style>
