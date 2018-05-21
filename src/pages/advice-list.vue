<template>
    <div id="advice-list">
        <myHeader :title="title"></myHeader>

        <div class="adviceContent">
            <el-tabs v-model="activeName">
                <el-tab-pane v-for="item in indexArray" :key="item.id" :label="item.label">
                    <div class="box-content">
                        <el-card v-for="item in contentArray" :key="item.id" class="box-card">
                            <div class="itemIndex">
                                <el-row>
                                    <el-col class="indexDate" :span="12"><span >{{item.indexDate}}</span></el-col>
                                    <el-col class="indexStatus" :span="12">
                                        <span v-if="item.status === 0" class="backItem"><i class="iconfont icon-pinglun3-copy"></i>已回复</span>
                                        <span v-if="item.status === 1" class="applyItem"><i class="el-icon-success"></i>已提交</span>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="indexDate">
                                <span>{{item.indexDate}}您的反馈：</span>
                            </div>
                            <div class="indexContent">
                                22222222222222222222222222222222222222222222222222222222222222222222222222222222222222
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
export default {
    data(){
        return {
            title:'建议列表',
            activeName: '',
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
            contentArray: [
                {
                    id: 0,
                    indexDate: '2018-05-10 16:19',
                    status: 0
                },
                {
                    id: 1,
                    indexDate: '2018-05-09 16:19',
                    status: 1
                }
            ]
        }
    },
    components:{
        "myHeader":head
    }
}
</script>

<style>
.adviceContent div .el-tabs__header {
    margin: 0;
}
.box-content {
    text-align: center;
    background-color: #F1F1F1;
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
}
.indexDate span {
    margin-left: 30px;
}
.indexStatus {
    text-align: right;
}
.indexStatus span {
    margin-right: 30px;
}
.backItem {
    color: #FFAF04;
}
.applyItem {
    color: #1AA75F;
}
.indexContent {
    text-align: left;
    width: 90%;
    margin: 0 30px;
    text-overflow: ellipsis;
}
.indexContent span {
    
}
</style>
