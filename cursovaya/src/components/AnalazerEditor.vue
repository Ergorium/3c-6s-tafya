<template>
  <div class="flex">
    <div class="hello">
      <div class="editor-box">
        <code-editor
          class=""
          :languages="[['pascal', 'PASCAL']]"
          v-model="code"
          font_size="14px"
          min_height="300px"
          wrap_code
          @keyup.ctrl.enter="onStartSyntaxParse"
          @keyup.meta.enter="onStartSyntaxParse"
        />
      </div>
      <p v-if="syntaxError !== '' && errors.length === 0" class="errors">
        syntax Errors: {{ syntaxError }}
      </p>
      <div v-if="errors.length > 0" class="errors">
        lexical {{ errors.join(', ') }}
      </div>
      <!-- <button @click="onClick" class="button mb">test</button> -->
      <button @click="onStartSyntaxParse" class="button mb">
        SyntaxParser
      </button>
    </div>
    <div class="table-box">
      <TableToken :data="table" v-if="table.length > 0" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Token, LexicalParser } from '@/core/Parser'
import { reactive, ref } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CodeEditor from 'simple-code-editor'
import TableToken from '@/components/TableToken.vue'
import { SyntaxParser, SyntaxError } from '@/core/SyntaxParser'

const code = ref('')
// список токенов по результату работы лексического парсера
const table = reactive<Token[]>([])
// ошибки лексического разбора
const errors = reactive<string[]>([])
// ошибка синтаксического разбора
const syntaxError = ref<string>('')
// Вызов парсеров
const onClick = () => {
  const parser = new LexicalParser()
  parser.init(code.value)
  errors.splice(0, errors.length, ...parser.errors)
  table.splice(0, table.length, ...parser.table)
}
const onStartSyntaxParse = () => {
  onClick()
  const parser = new SyntaxParser([...table])
  try {
    parser.start()
    syntaxError.value = ''
  } catch (e) {
    const err = e as SyntaxError
    console.error(err)
    syntaxError.value = err.message
  }
}
</script>

<style scoped lang="sass">
.flex
  display: flex
  justify-content: center
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
.errors
  color: #ff0000
  margin-bottom: 20px
</style>
