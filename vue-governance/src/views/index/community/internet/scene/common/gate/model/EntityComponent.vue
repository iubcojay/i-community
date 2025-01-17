<template>
  <entity-man-component
    v-if="entityInfo.type === 'man'"
    :entityInfo="entityInfo"
  ></entity-man-component>
</template>

<script>
import EntityManComponent from "./EntityManComponent";
export default {
  name: "EntityComponent",
  props: ["entityInfo"],
  components: {
    EntityManComponent,
  },
};
</script>

<style lang="less" scoped></style>
