<template>
    <div id="advice-content">
        <myHeader :title="title"></myHeader>
        <div class="infoTitle">
            <span>请选择你想反馈的问题点（必选）</span>
        </div>
        <div class="infoIndex">
            <div class="infoItem">
                <div v-for="(item,index) in typeArray" :key="index">
                    <div class="infoCotent">
                        <el-radio v-model="radio" :label="item.id">{{item.name}}</el-radio>
                    </div>
                    <div class="bottomLine"></div>
                </div>
                
                <!-- <div class="infoCotent">
                    <el-radio v-model="radio" label="2">功能类：播放无声音、黑屏、无记忆播放功能等</el-radio>
                </div>
                <div class="bottomLine"></div>
                <div class="infoCotent">
                    <el-radio v-model="radio" label="3">网络类：播放卡顿等</el-radio>
                </div>
                <div class="bottomLine"></div>
                <div class="infoCotent">
                    <el-radio v-model="radio" label="4">其他问题</el-radio>
                </div> -->
            </div>
            <!-- <el-row>
                <el-col :span="8">
                    <img class="infoImg" src="../images/itv-logo.png">
                </el-col>
                <el-col :span="14" class="baseInfo">
                    <div>
                        <span>ITV账号：</span>
                        <span>{{itvaccount}}</span>
                    </div>
                    <div>
                        <span>MAC地址：</span>
                        <span>{{mac}}</span>
                    </div>
                    <div>
                        <span>机顶盒型号：</span>
                        <span>{{model}}</span>
                    </div>
                </el-col>
            </el-row> -->
        </div>

        <div class="infoTitle">
            <span>请补充详细问题和意见</span>
        </div>
        <div class="infoArea">
            <textarea v-on:input="changeText" v-model="infoText" placeholder="请在此输入详细问题" rows="5"></textarea>
            <div class="limitText">{{limitText}}</div>
        </div>
        

        <!-- <div class="infoText" @click="getList">
            <span class="textItem"><i class="iconfont icon-xiaoxi selfMessage"></i>&nbsp;&nbsp;&nbsp;以往建议</span>
            <i class="iconfont icon-iconfontyoujiantou selfjiantou"></i>
        </div> -->

        <div class="infoText">
            <div class="infoTitle">
                <span>请输入或选择您的手机号码<i>*</i></span>
            </div>
            
            <!-- <div class="infoContent">
                <span><i>*</i>您为我们提供一下哪些建议呢？</span>
                <div @click="handleType">
                    <el-row>
                        <el-col v-for="(item, index) in typeArray" :key="item.id" :span="8">
                            <span @click="selectType(index)">
                                <el-tag :class="item.typeClass" class="typeIndex"  @click="selectType(index)">{{item.name}}</el-tag>
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </div> -->
            <div class="infoMobile">
                <div class="infoContent">
                    
                    <div @click="dialogMobile = true, warningCode = '', warningMobile = '', newMobile = '', countDown = 60, newCode = '', currentCode = '', mobileList = [], isDisabled = false">
                        <el-tag type="info" style="width:100%;backgroundColor:#fff">{{defaultMobile}}

                            <span class="editItem" v-if="isShow">修改</span>
                        </el-tag>
                    </div>
                </div>
            </div>
            <!-- <div class="bottomContent">
                <div class="infoContent">
                <span><i>*</i>请留下您的宝贵建议</span>
                <textarea v-model="infoParam.content" rows="6" class="adviceArea"></textarea>
                </div>
                <div  class="applyButton">
                    <el-button type="primary" @click="apply">提交</el-button>
                </div>
            </div> -->
        </div>

        <div  class="applyButton">
            <el-button type="primary" @click="apply">提交</el-button>
        </div>

        <el-dialog v-if="dialogMobile" :visible.sync="dialogMobile" @close="closeDialog">
            <el-row>
                <el-col :span="5" class="mobileText">
                    <span>手机号：</span>
                </el-col>
                <el-col :span="19" type="text-align:left">
                    <el-autocomplete
                    class="inline-input"
                    v-model="newMobile"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入手机号"
                    @change="changeWarning"
                    @input="limitNumber" 
                    @blur="filterNumber"
                    ></el-autocomplete>
                </el-col>
            </el-row>
            <span class="pormpt">{{warningMobile}}</span>

            <el-row class="codeItem">
                <el-col :span="5" class="mobileText">
                    <span>验证码：</span>
                </el-col>
                <el-col :span="10">
                    <el-input placeholder="请输入验证码" v-model="newCode"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button class="codeButton" type="primary" @click="getCode" :disabled="isDisabled">{{codeButton}}</el-button>
                </el-col>
            </el-row>
            <span class="pormpt">{{warningCode}}</span>

            <div class="buttonGroup">
                <el-button type="primary" @click="addMobile">确定</el-button>
                <el-button type="info" @click="dialogMobile = false, countDown = 0">取消</el-button>
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
import {getUserInfo, getProposalTypes, collectProposal, sendMsg} from '../service/getData.js'
let mobileFilter = /^[1][3,4,5,7,8,9][0-9]{9}$/;
export default {
    name: 'app',
    data(){
        return {
            title: '我要吐槽',
            typeArray: [],
            formerType: undefined,
            itvaccount: '',
            mac: '',
            model: '',
            mobiles: [],
            dialogMobile: false,
            isDisabled: false,
            codeButton: '获取验证码',
            countDown: 60,
            infoParam: {
                itvId: 'zuoying9241',
                timestamp: new Date().getTime(),
                mobile: '',
                content: '',
                classifyId: ''
            },
            defaultMobile: '请输入或选择您的手机号码...',
            newMobile: '',
            newCode: '',
            currentCode: '',
            warningMobile: '',
            warningCode: '',
            mobileList: [],
            isShow: false,
            radio: '',
            infoText: '',
            limitText: '0/75',
            stbVersion: '',
            programCode: '',
            programName: '',
            programGenre: ''
        }
    },
    components:{
        "myHeader":head
    },
    mounted: function() {
        var currentUrl = window.location.href;
        if(currentUrl.indexOf("?") > 0) {
            if(currentUrl.split("?")[1].indexOf("&") > 0) {
                let tempArray = currentUrl.split("?")[1].split("&");
                let obj = {};
                for(let i=0; i<tempArray.length; i++) {
                    var subArr = tempArray[i].split('=');
                    obj[subArr[0]] = subArr[1];
                }
                this.infoParam.itvId = obj.itvId;
                this.stbVersion = obj.stbVersion;
                this.programCode = obj.programCode;
                this.programName = decodeURI(obj.programName);
                this.programGenre = decodeURI(obj.programGenre);
            }
        }
        
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
        getInfo() {
            getUserInfo(this.infoParam).then((response) => {
                let result = JSON.parse(response.data.data);
                if(result.realMoble) {
                    this.defaultMobile = result.realMoble;
                    this.infoParam.mobile = result.realMoble;
                    this.isShow = true;
                }
                
                if(result.activityPhone) {
                    for(let key in JSON.parse(result.activityPhone)) {
                        if(JSON.parse(result.activityPhone).hasOwnProperty(key)) {
                            let mobileItem = {};
                            mobileItem.number = key;
                            this.mobiles.push(mobileItem);
                        }
                    }
                }else {
                    this.mobiles = [];
                }
                
            }, (err) => {
                console.log(err)
            })
        },
        getType() {
            getProposalTypes(this.infoParam).then((response) => {
                this.typeArray = response.data.data;
                for(let i=0; i<this.typeArray.length; i++) {
                    this.typeArray[i].typeClass = 'defaultTag'
                }
            }, (err) => {
                console.log(err)
            })
        },
        apply() {
            let applyParam = {};
            if(!this.radio) {
                this.$message({
                    message: '警告，反馈的问题不能为空!',
                    type: 'warning'
                });
                return false;
            }else {
                applyParam.classifyId = Number(this.radio);
            }
            // if(!this.infoText) {
            //     this.$message({
            //         message: '警告，建议内容不能为空!',
            //         type: 'warning'
            //     });
            //     return false;
            // }else {
            //     applyParam.content = this.infoText;
            // }
            applyParam.content = this.infoText;
            if(!this.infoParam.mobile) {
                this.$message({
                    message: '警告，手机号不能为空!',
                    type: 'warning'
                });
                return false;
            }else {
                applyParam.mobile = this.infoParam.mobile;
            }
            applyParam.itvId = this.infoParam.itvId;
            applyParam.stbVersion = this.stbVersion;
            applyParam.programCode = this.programCode;
            applyParam.programName = this.programName;
            applyParam.programGenre = this.programGenre;
            collectProposal(applyParam).then((response) => {
                if(response.data.code === '00001') {
                    this.$router.push({path:'/AdviceSuccess?itvId=' + this.infoParam.itvId + '&stbVersion=' + this.stbVersion + '&programCode=' + this.programCode + '&programName=' + this.programName + '&programGenre=' + this.programGenre});
                }else {
                    this.$message({
                        message: response.data.message,
                        type: 'warning'
                    });
                }
            }, (err) => {
                console.log(err)
            })
        },
        changeWarning() {
            if(this.newMobile) {
                this.warningMobile = '';
            }
        },
        limitNumber(e) {
            this.mobileList = [];
            for(var i=0; i<this.mobiles.length; i++) {
                if(this.mobiles[i].number && (this.mobiles[i].number).indexOf(e) === 0) {
                    this.mobileList.push(this.mobiles[i]);
                }
            }
            this.mobileList.unshift({value:"你可能的手机号是："})
            if(!e.match(mobileFilter) && e.length >10){
                this.warningMobile = '*手机号码格式不正确';
            }else {
                this.warningMobile = '';
            }
        },
        filterNumber() {
            if(!this.newMobile.match(mobileFilter)){
                this.warningMobile = '*手机号码格式不正确';
            }else {
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
                this.$message({
                    message: '手机号码验证成功',
                    type: 'success'
                });
                this.dialogMobile = false;
                this.warningCode = '';
                this.infoParam.mobile = this.newMobile;
                this.defaultMobile = this.newMobile;
                let hasMobile = false;
                for (var i=0; i<this.mobiles.length; i++) {
                    if(this.mobiles[i].number === this.newMobile) {
                        hasMobile = true;
                        break;
                    }
                }
                if(!hasMobile) {
                    this.mobiles.push({number:this.newMobile});
                }
                this.warningMobile = '';
                this.newMobile = '';
                this.countDown = 0;
                this.newCode = '';
                this.currentCode = '';
            }
        },
        getCode() {
            if(this.newMobile) {
                this.warningMobile = '';
                let aesParam = {};
                aesParam.timestamp = this.infoParam.timestamp;
                aesParam.mobile = this.newMobile;
                aesParam.mobile = Encrypt.encryptStr(aesParam.mobile);

                sendMsg(aesParam.mobile, aesParam.timestamp).then((response) => {
                    if(response.data.code === "00001") {
                        this.setTime();
                        this.currentCode = response.data.data;
                    }else {
                        this.warningCode = '*' + response.data.message;
                    }
                }, (err) => {
                    console.log(err)
                })
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
        closeDialog() {
            this.countDown = 0;
        },
        getList() {
            this.$router.push({path:'/AdviceList?itvId=' + this.infoParam.itvId});
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
        },
        querySearch(queryString, cb) {
            if(this.mobileList.length > 0) {
                cb(this.mobileList);
            }else {
                var results=this.mobiles;
                for(var i=0; i<results.length; i++) {
                    results[i].value = results[i].number;
                }
                results.unshift({value:"你可能的手机号是："});
                cb(results);
            }
        },
        changeText() {
            if(this.infoText.length > 75) {
                this.infoText = this.infoText.substring(0,75);
            }else {
                this.limitText = this.infoText.length + '/75';
            }
        }
    }
}
</script>

<style lang="less" scoped>
body {
    background-color: #F1F1F1;
}
.bottomContent {
    height: 100%;
    width: 100%;
    background-color: white;
}
.infoIndex {
    background-color: white;
}
.infoImg {
    width: 110px;
    height: 110px;
    border-radius: 100%;
    margin: 15px 0;
}
.baseInfo {
    margin: 15px 0;
    text-align: left;
    line-height: 1.6;
}
.infoText {
    // margin-top: 40px;
    text-align: left;
    line-height: 2.8;
    font-size: 30px;
    background-color: white;
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
    margin: 20px 70px;
    margin-left: 30px;
    margin-bottom: 40px;
}
.infoTitle span i {
    color: red;
    margin-right: 15px;
}
.infoMobile {
    border-top: 1px solid #DDDDDD;
    border-bottom: 1px solid #DDDDDD;
}
.adviceArea {
    width: 100%;
    background-color: white;
}
.applyButton {
    text-align: center;
    margin-top: 70px;
    button {
        width: 240px;
    }
}
.defaultTag {
    color: black;
    background-color: white;
}
.activeTag {
    color: white;
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
    text-align: center; 
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
    color: red;
    text-align: left;
}
.editItem {
    position: absolute;
    text-align: center;
    width: 100px;
    right: 70px;
    color: #1A9DE1;
    border-radius: 0.1rem;
    border: 0.014rem solid #1A9DE1;
    display: inline-block;
}

.infoTitle {
    height: 80px;
    background-color: #f1f1f1;
    color: #9b9b9b;
    font-size: 28px;
    line-height: 80px;
    span {
        margin-left: 30px;
    }
}

.infoItem {
    font-size: 30px;
    line-height: 100px;
    .infoCotent {
        margin-left: 35px;
    }
    .bottomLine {
        border: 1px solid #dddddd;
        margin-left: 30px;
    }
}

.infoArea {
    background-color: white;
    textarea {
        margin-top: 30px;
        margin-left: 30px;
        width: 94%;
        border: none;
    }
}

.limitText {
    text-align: right;
    margin-right: 30px;
    font-size: 28px;
    color: #9b9b9b;
}

.codeButton {
    margin-left: 10px;
}
</style>
