<template>
  <TodoApp></TodoApp>
  <div @click="handleClick">{{ aas }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodoApp from '@/components/Todo.vue';

export default defineComponent({
  components: { TodoApp },
  setup() {
    const handleClick = () => {};
    return { aas: 1, handleClick };
  },
});
</script>
