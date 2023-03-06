<template>
  <div class="table">
    <h3>Lexems</h3>
    <div v-for="t in props.data" :key="t.id" class="row">
      <div class="item">type: {{ t.type }}</div>
      <div class="item">value: {{ t.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Token } from '@/core/Parser.ts'
import { defineProps } from 'vue'
interface IProp {
  data: Token[]
}
const props = defineProps<IProp>()
</script>

<style lang="sass" scoped>
.table
  max-width: 350px
  border: 1px solid black
  padding: 10px
.row
  display: flex
.item
  min-width: 150px
  text-align: left
</style>
