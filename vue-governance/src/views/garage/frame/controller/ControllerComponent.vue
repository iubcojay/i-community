<template>
    <div class="controller_panel">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "ControllerComponent"
    }
</script>

<style scoped>
    .controller_panel {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        pointer-events: none;
        z-index: 9;
    }
</style>