<template>
    <div class="outer_panel">
        <folder-panel-component position="right" title="车位列表" height="400px">
            <template slot="content">
                
            </template>
        </folder-panel-component>
    </div>
</template>

<script>
import FolderPanelComponent from '@/views/common/InfoPanel/sidepanel/FolderPanelComponent'
export default {
    name: 'GarageGovernanceFacilityParkingSpaceRightComponent',
    components:{FolderPanelComponent}
}
</script>

<style lang="less" scoped>
.outer_panel {
    height: 100%;
    width: 100%;
    pointer-events: none;
    @lightBlue: rgb(33, 194, 237);
    @darkBlue: rgb(2, 77, 137);
    



}
</style>