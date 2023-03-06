<template>
  <div class="hello">
    <div class="editor-box">
      <code-editor
        class=""
        :languages="[['pascal', 'PASCAL']]"
        v-model="code"
        font_size="12px"
        min_height="250px"
        wrap_code
        @keyup.ctrl.enter="onClick"
        @keyup.meta.enter="onClick"
      />
    </div>
    <div v-if='errors.length > 0'>{{errors.join(', ')}}</div>
    <button @click="onClick" class="button mb">test</button>
    <div class="table-box" v-if='table.length > 0'>
      <TableToken :data="table" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Token, LexicalParser } from '@/core/Parser.ts'
import { reactive, ref, watch } from 'vue'
import CodeEditor from 'simple-code-editor'
import TableToken from '@/components/TableToken.vue'

const code = ref('')
const table = reactive<Token[]>([])
const errors = reactive<string[]>([])
const onClick = () => {
  const parser = new LexicalParser()
  parser.init(code.value)
  errors.splice(0, errors.length, ...parser.errors)
  table.splice(0, table.length, ...parser.table)
}
</script>

<style scoped lang="sass">
.editor-box
  display: flex
  justify-content: center
  align-items: center
  margin-bottom: 20px
.button
  outline: none
  padding: 10px 30px
  font-size: 15px
  cursor: pointer
  border: 0
  background: #282c34
  border-radius: 5px
  color: white
  transition: all .1s
  &:active
    transform: scale(.95)
.mb
  margin-bottom: 20px
.table-box
  display: flex
  justify-content: center
</style>
