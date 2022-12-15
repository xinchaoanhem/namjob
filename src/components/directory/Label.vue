<template>
  <div class="tag" :style="{background: label.color }"> {{ label.name }}</div>
</template>

<script>
export default {
  name: "MyLabel",
  props: ['label'],
}
</script>

<style scoped lang="scss">
.tag {
  border-radius: 5px;
  padding: 2px 10px;
  margin-right: 4px;
  margin-bottom: 4px;
  font-size: 12px;
  color: white;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>