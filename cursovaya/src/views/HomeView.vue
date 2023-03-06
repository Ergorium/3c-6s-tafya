<template>
  <div class="home">
    <AnalazerEditor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AnalazerEditor from '@/components/AnalazerEditor.vue' // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    AnalazerEditor,
  },
})
</script>
