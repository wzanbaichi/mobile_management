<template>
    <div id="advice-list">
        <myHeader :title="title"></myHeader>

        <div class="adviceContent">
            <el-tabs v-model="activeName" @tab-click="handleTab">
                <el-tab-pane v-for="item in indexArray" :key="item.id" :label="item.label">
                    <div v-if="contentArray.length === 0" class="warningContent">暂无数据</div>
                    <div class="box-content">
                        <el-card v-for="item in contentArray" :key="item.id" class="box-card">
                            <div class="itemIndex">
                                <el-row>
                                    <el-col class="indexDate" :span="12"><span >{{item.proposal.createDate}}</span></el-col>
                                    <el-col class="indexStatus" :span="12">
                                        <span v-if="item.reply" class="backItem"><i class="iconfont icon-pinglun3-copy"></i>已回复</span>
                                        <span v-if="!item.reply" class="applyItem"><i class="el-icon-success"></i>已提交</span>
                                    </el-col>
                                </el-row>
                            </div>
                            <div>
                                <div>
                                    <div class="indexDate">
                                    <span>{{item.proposal.createDate}}&nbsp;&nbsp;{{item.proposal.proposeName}}的反馈：</span>
                                    </div>
                                    <div :class="!item.isCollapsed ? 'indexContent collapseContent':'indexContent uncollapseContent'">{{item.proposal.content}}</div>
                                </div>
                                <div v-if="item.reply">
                                    <div class="indexDate"> 
                                    <span>{{item.reply.replyDate}}&nbsp;&nbsp;{{item.reply.replyName}}的回复：</span>
                                    </div>
                                    <div :id="item.id" :class="!item.isCollapsed ? 'indexContent collapseContent':'indexContent uncollapseContent'">{{item.reply.replyContent}}</div>
                                </div>
                            </div>
                            
                            <div class="collapseItem">
                                <span v-if="!item.isCollapsed" @click="item.isCollapsed = true"><i class="iconfont icon-zhankai selfIcon"></i>&nbsp;展开</span>
                                <span v-if="item.isCollapsed" @click="item.isCollapsed = false"><i class="iconfont icon-shouqi selfIcon"></i>&nbsp;收起</span>
                            </div>
                        </el-card>
                    </div>
                    
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import head from '../components/header.vue'
import Encrypt from '../assets/js/encrypt'
import axios from 'axios'
import qs from 'qs'
export default {
    name: 'app',
    data(){
        return {
            title:'建议列表',
            activeName: '',
            listParam: {
                itvId: 'zuoying9241',
                typeId: '',
                timestamp: new Date().getTime()
            },
            indexArray: [
                {
                    id: 0,
                    label: '全部'
                },
                {
                    id: 1,
                    label: '近7天'
                },
                {
                    id: 2,
                    label: '近30天'
                },
                {
                    id: 3,
                    label: '更久'
                }
            ],
            contentArray: [],
            isCollapsed: false,
            urlHeader: 'interactive'
        }
    },
    components:{
        "myHeader":head
    },
    mounted: function() {
        this.getListData();
    },
    methods: {
        getListData() {
            let timestamp = Encrypt.encryptStr('timestamp=' + this.listParam.timestamp);
            axios.get(this.urlHeader + '/proposal/getProposalList',{params:this.listParam,headers:{
                "Authorization": timestamp
            }})
            .then(response=> {
                let result = response.data.data;
                for(let i=0; i<result.length; i++) {
                    result[i].isCollapsed = false;
                }
                this.contentArray = result;
            })
            .catch(response=> {
            });
        },
        handleTab(tab, event) {
            if(tab.index === '0') {
                this.listParam.typeId = '';
            }
            if(tab.index === '1') {
                this.listParam.typeId = 7;
            }
            if(tab.index === '2') {
                this.listParam.typeId = 30;
            }
            if(tab.index === '3') {
                this.listParam.typeId = -1;
            }
            this.getListData();
        }
    }
}
</script>

<style>
body {
    background-color: #F1F1F1;
}
.el-tabs__header {
    background-color: #ffffff;
}
.adviceContent div .el-tabs__header {
    margin: 0;
}
.box-content {
    text-align: center; 
}
.box-content div .el-card__body {
    padding: 0;
}
.box-card {
    display: inline-block;
    width: 90%;
    margin: 30px 0;
}
.itemIndex {
    width: 100%;
    border-bottom: 1px solid #DDDDDD;
}
.indexDate {
    text-align: left;
    font-size: 28px;
    margin: 10px 0;
}
.indexDate span {
    margin-left: 30px;
}
.indexStatus {
    text-align: right;
    line-height: 1.8;
}
.indexStatus span {
    margin-right: 30px;
}
.backItem {
    color: #FFAF04;
    font-size: 28px;
    margin: 10px 0;
}
.applyItem {
    color: #1AA75F;
    font-size: 28px;
}
.indexContent {
    text-align: left;
    width: 90%;
    margin: 0 30px;
    line-height: 1.4;
}
.collapseContent {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
}
.uncollapseContent {
    word-break: break-all;
    word-wrap: break-word;
}
.collapseItem {
    width: 100%;
    margin: 10px 0;
    border-top: 1px solid #DDDDDD;
}
.collapseItem span {
    line-height: 1.6;
    color: #DDDDDD;
}
.el-tabs__nav {
    margin-left: 18%;
}
.warningContent {
    margin-top: 150px;
}
</style>
