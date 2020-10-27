<template>
  <div>
    <h3>{{ state.title }}</h3>
    <input type="text" v-model="state.name" />
  </div>
</template>
<script>
import { watch, reactive, onMounted, toRef } from "vue";
export default {
  props: ["title"],
  setup(props, ctx) {
    let { attrs, emit, slots } = ctx;
    let state = reactive({
      name: "yxd",
      title: props.title,
    });
    watch(
      () => {
        return { name: state.name, title: props.title };
      },
      (newVal, oldVal) => {
        state.title = newVal.title;
        emit("parFn", "name change");
      }
    );
    onMounted(() => {
      // 修改父组件的属性，子组件发生变化
      setTimeout(() => {
        emit("update:title", "Vue3 Title Change");
      }, 1000);
      // console.log("2onMounted");
    });
    return { state };
  },
  created() {
    // console.log("1create");
  },
  mounted() {
    // console.log("3mounted");
    console.log(this);
  },
  methods: {
    fn() {
      console.log("fn");
    },
  },
};
</script>