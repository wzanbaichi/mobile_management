<template>
    <div id="advice-list">
        <myHeader :title="title"></myHeader>

        <div class="adviceContent">
            <el-tabs v-model="activeName" @tab-click="handleTab">
                <el-tab-pane v-for="item in indexArray" :key="item.id" :label="item.label">
                    <div v-if="loadingText" class="warningContent">{{loadingText}}</div>
                    <div class="box-content">
                        <el-card v-for="item in contentArray" :key="item.id" class="box-card">
                            <div class="itemIndex">
                                <el-row>
                                    <el-col class="indexDate" :span="12"><span class="indexName">{{item.classfyName}}</span></el-col>
                                    <el-col class="indexStatus" :span="12">
                                        <span v-if="item.reply" class="backItem"><i class="iconfont icon-pinglun3-copy"></i>&nbsp;&nbsp;已回复</span>
                                        <span v-if="!item.reply" class="applyItem"><i class="el-icon-success"></i>&nbsp;&nbsp;已提交</span>
                                    </el-col>
                                </el-row>
                            </div>
                            <div>
                                <div>
                                    <el-row>
                                        <el-col class="indexDate" :span="12">
                                            <span>您的反馈：</span>
                                        </el-col>
                                        <el-col class="indexStatus" :span="12">
                                            <span>{{item.proposal.createDate}}</span>
                                        </el-col>
                                    </el-row>
                                    <div :class="!item.isCollapsed ? 'indexContent collapseContent':'indexContent uncollapseContent'">{{item.proposal.content}}</div>
                                </div>
                                <div v-if="item.reply">
                                    <el-row>
                                        <el-col class="indexDate" :span="12">
                                            <span>客服回复：</span>
                                        </el-col>
                                        <el-col class="indexStatus" :span="12">
                                            <span>{{item.reply.replyDate}}</span>
                                        </el-col>
                                    </el-row>
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
import Loading from 'element-ui'
export default {
    name: 'app',
    data(){
        return {
            title:'建议列表',
            activeName: '',
            listParam: {
                itvId: '',
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
            urlHeader: 'interactive',
            loadingText: ''
        }
    },
    components:{
        "myHeader":head
    },
    mounted: function() {
        this.listParam.itvId = this.$route.query.itvId;
        this.getListData();
    },
    methods: {
        getListData() {
            this.loadingText = '';
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let timestamp = Encrypt.encryptStr('timestamp=' + this.listParam.timestamp);
            
            axios.get(this.urlHeader + '/proposal/getProposalList',{params:this.listParam,headers:{
                "Authorization": timestamp
            }})
            .then(response=> {
                let result = response.data.data;
                if (result.length > 0) {
                    setTimeout(()=> {
                        this.$loading().close();
                    },1000)
                    for(let i=0; i<result.length; i++) {
                        result[i].isCollapsed = false;
                    }
                }else {
                    setTimeout(()=> {
                        this.$loading().close();
                        this.loadingText = '暂无数据';
                    },1000)
                }
                this.contentArray = result;
            })
            .catch(response=> {
                setTimeout(()=> {
                    this.$loading().close();
                    this.loadingText = '暂无数据';
                },1000)
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

<style lang="less" scoped>
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
.indexName {
    line-height: 2.2;
    font-size: 30px;
    color: #505050;
}
.indexStatus {
    text-align: right;
    line-height: 2.8;
}
.indexStatus span {
    margin-right: 30px;
}
.backItem {
    color: #FFAF04;
    font-size: 30px;
    margin: 10px 0;
}
.applyItem {
    color: #1AA75F;
    font-size: 30px;
    margin: 10px 0;
}
.indexContent {
    text-align: left;
    width: 90%;
    margin: 0 30px;
    line-height: 1.4;
    color: #808080;
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
    padding-top: 10px;
    margin: 10px 0;
    border-top: 1px solid #DDDDDD;
}
.collapseItem span {
    line-height: 1.6;
    color: #DDDDDD;
}
.el-tabs__nav {
    margin-left: 15%;
}
.warningContent {
    margin-top: 150px;
}
.selfIcon {
    vertical-align: middle;
}
</style>
