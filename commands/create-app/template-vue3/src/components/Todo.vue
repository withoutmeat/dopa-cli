<template>
  <div v-for="todo in todos" :key="todo.id" data-test="todo">{{ todo.text }}</div>

  <form data-test="form" @submit.prevent="createTodo">
    <input data-test="new-todo" v-model="newTodo" />
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';

export default defineComponent({
  setup() {
    const color = 'red';
    const state = reactive({
      todos: [
        {
          id: 1,
          text: 'Learn Vue.js 3',
          completed: false,
        },
      ],
      newTodo: ref('12'),
      createTodo() {
        state.todos.push({
          id: 2,
          text: state.newTodo,
          completed: false,
        });
      },
    });
    const a:number =1;
    return { color, ...toRefs(state), a };
  },
});
</script>

<style lang="postcss" module>
.hahah {
  color: red;
}
.testcss {
  background-color: blue;
  &:not(&) {
    color: blue;
  }
}
</style>
