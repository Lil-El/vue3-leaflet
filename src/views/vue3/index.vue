<template>
  <div>
    <h3>{{ state.title }}</h3>
    <input type="text" v-model="state.name" />
    <child v-model="state.title" />
  </div>
</template>
<script>
import child from "./component";
import { watch, reactive, onMounted, toRef, provide } from "vue";
export default {
  props: ["title"],
  components: { child },
  setup(props, ctx) {
    let { attrs, emit, slots } = ctx;
    let state = reactive({
      name: "yxd",
      title: props.title,
    });
    let staticObj = { name: "1" };
    // provide 函数 或 对象；inject都可以响应
    provide("parent", () => state.name);
    provide("parent2", state);
    provide("parent3", staticObj);

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
        state.name = "ywd";
        staticObj.name = "2";
      }, 1000);
      // console.log("2onMounted");
    });
    return {
      state,
    };
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