<template>
    <div id="advice-success">
        <myHeader :title="title"></myHeader>
        <div class="successContent">
            <div>
                <span class="iconfont icon-yanzhengchenggong imgIcon"></span>
            </div>
            <div>
                <h3>感谢您对安徽电信的支持！</h3>
                <span>{{message}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import head from '../components/header.vue'
import Vue from 'vue'
export default {
    data(){
        return {
            title: '反馈结果',
            message: '(4s)',
            countDown: 4
        }
    },
    components:{
        "myHeader":head
    },
    mounted: function() {
        this.returnInfo();
        
    },
    methods: {
        returnInfo() {
            if(this.countDown === 0) {
                this.$router.push({path:'/'});
                return false;
            }else {
                this.countDown --;
                this.message = '(' + this.countDown + 's)'
            }
            setTimeout(() => {
                this.returnInfo();
            },1000)
        }
    }
}
</script>
body {
    background-color: #F1F1F1;
}
<style>
.successContent {
    margin-top: 180px;
}
.imgIcon {
    font-size: 80px;
    color: #39B350;
}
</style>
