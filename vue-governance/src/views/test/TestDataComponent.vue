<template>
    <div class="test_data_outer_panel">
        <div v-for="item of list" :key="item.id">{{item.name}}</div>
    </div>
</template>

<script>
    export default {
        name:'TestDataComponent',
        props:['list']
    }
</script>

<style lang="less" scoped>
    .test_data_outer_panel{
        width: 100%;
        height: 100%;
    }
</style>