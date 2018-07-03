<template>
    <div id="advice-info">
        <myHeader :title="title"></myHeader>
        <div class="infoIndex">
            <el-row>
                <el-col :span="8">
                    <img class="infoImg" src="../images/itv-logo.png">
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
                                <el-tag :class="item.typeClass" class="typeIndex"  @click="selectType(index)">{{item.name}}</el-tag>
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="infoMobile">
                <div class="infoContent">
                    <span><i>*</i>请输入您的手机号码，以方便给您反馈</span>
                    <div @click="dialogMobile = true, warningCode = '', warningMobile = '', newMobile = '', countDown = 60, newCode = '', currentCode = '', mobileList = [], isDisabled = false">
                        <el-tag type="info" style="width:100%;backgroundColor:#fff">{{defaultMobile}}

                            <span class="editItem" v-if="isShow">修改</span>
                        </el-tag>
                    </div>
                </div>
            </div>
            <div class="bottomContent">
                <div class="infoContent">
                <span><i>*</i>请留下您的宝贵建议</span>
                <textarea v-model="infoParam.content" rows="6" class="adviceArea"></textarea>
                </div>
                <div  class="applyButton">
                    <el-button type="primary" @click="apply">提交</el-button>
                </div>
            </div>
        </div>

        <el-dialog v-if="dialogMobile" :visible.sync="dialogMobile" @close="closeDialog">
            <el-row>
                <el-col :span="5" class="mobileText">
                    <span>手机号：</span>
                </el-col>
                <el-col :span="18" type="text-align:left">
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
let mobileFilter = /^[1][3,4,5,7,8][0-9]{9}$/;
export default {
    name: 'app',
    data(){
        return {
            title: '优化建议',
            typeArray: [],
            formerType: undefined,
            baseInfo: {},
            mobiles: [],
            dialogMobile: false,
            isDisabled: false,
            codeButton: '获取验证码',
            countDown: 60,
            infoParam: {
                itvId: '',
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
            isShow: false
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
        getInfo() {
            getUserInfo(this.infoParam).then((response) => {
                let result = JSON.parse(response.data.data);
                if(result.realMoble) {
                    this.defaultMobile = result.realMoble;
                    this.infoParam.mobile = result.realMoble;
                    this.isShow = true;
                }
                this.baseInfo = result;
                for(let key in JSON.parse(result.activityPhone)) {
                    if(JSON.parse(result.activityPhone).hasOwnProperty(key)) {
                        let mobileItem = {};
                        mobileItem.number = key;
                        this.mobiles.push(mobileItem);
                    }
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
                collectProposal(this.infoParam).then((response) => {
                    if(response.data.code === '00001') {
                        this.$router.push({path:'/AdviceSuccess?itvId=' + this.infoParam.itvId});
                    }else {
                        this.$message({
                            message: response.data.message,
                            type: 'warning'
                        });
                    }
                }, (err) => {
                    console.log(err)
                })
            }
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
                this.setTime();
                collectProposal(this.infoParam).then((response) => {
                    this.currentCode = response.data.data;
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
    margin-top: 30px;
    text-align: left;
    line-height: 2.8;
    font-size: 32px;
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
    margin: 10px 70px;
}
.infoContent span i {
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
    margin-bottom: 195px;
}
.applyButton button {
    width: 240px;
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
/* .typeIndex {
    text-align: center;
    width: 190px;
}
.mobileIndex {
    text-align: center;
    width: 195px;
}
.el-autocomplete {
    display: inline;
    color: #505050;
}
.el-autocomplete-suggestion li {
    color: #aaaaaa;
}
.el-autocomplete-suggestion__list :first-child {
    pointer-events: none;
} */
</style>
