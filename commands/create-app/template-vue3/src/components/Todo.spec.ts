import { mount } from '@vue/test-utils';
import TodoApp from './Todo.vue';

test('render a todo', () => {
  const wrapper = mount(TodoApp);

  const todo = wrapper.get('[data-test="todo"]');

  expect(todo.text()).toBe('Learn Vue.js 3');
});

test('creates a todo', async () => {
  const wrapper = mount(TodoApp);

  await wrapper.get('[data-test="new-todo"]').setValue('New todo');
  await wrapper.get('[data-test="form"]').trigger('submit');

  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(2);
});
