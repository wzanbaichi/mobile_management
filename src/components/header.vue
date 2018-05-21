<template>
    <div id="header">
        <div class="head">
            <span>{{title}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name:'app',
    data(){
        return{
        }
    },
    props:["title"],
    methods: {
    }
}
</script>

<style>
body {
    margin: 0;
    padding: 0;
}
.head {
    height: 120px;
    width: 100%;
    background: #1A9DE1;
}
.head span { 
    display: inline-block;
    margin-top: 35px;
    color:white;
    font-size: 34px;
}
</style>
