<template>
  <div class="app-container">
    <el-button @click="increment"> 点击 </el-button>
    <div>{{ obj.nested.count }}</div>
    <div>{{ getObjLength }}</div>
    ---------
    <div v-for="(value, key, index) in myObject" :key="index">
      {{ value }}
    </div>
    ----------
    <div v-for="(item, index) in myArr" :key="index">
      {{ item.message }}
    </div>
    -----------
    <slot> 默认的插槽</slot>
    <div>{{ message }}</div>
    ---------
    <div>主题色是:{{ sideTheme }}</div>
    <div>是否是深色系:{{ isDark }}</div>
    ---------hook测试
    <div>宽：{{ width }}</div>
    <div>高：{{ height }}</div>
  </div>
</template>
<script setup name="test">
import useSettingsStore from "@/store/modules/settings";
import { storeToRefs } from "pinia";
import { getCurrentInstance, onMounted, toRefs } from "vue";
import useEventListener from "@/hooks/useEventListener";

const { proxy } = getCurrentInstance();
console.info(proxy);
async function increment() {
  obj.value.nested.count++;
  obj.value.arr.push("baz");
}
const message = inject("message");
const settingsStore = useSettingsStore();
const width = ref(0);
const height = ref(0);

const obj = ref({
  nested: { count: 0 },
  arr: ["foo", "bar"],
});
const getObjLength = computed(() => {
  return obj.value.arr.length >= 5 ? "Yes" : "No";
});
const myArr = ref([
  {
    message: "Foo",
  },
  {
    message: "Bar",
  },
]);
const myObject = reactive({
  title: "vue学习",
  author: "nick",
  publishedAt: "2024-04-10",
});
const { title, author, publishedAt } = toRefs(myObject);

const { sideTheme, isDark } = storeToRefs(settingsStore);
onMounted(() => {
  // settingsStore.sideTheme = "theme-light";
  // 单个修改
  settingsStore.changeSetting("theme-light");
  // 批量修改
  settingsStore.$patch({
    title: "测试系统",
    theme: "#ff8b14",
  });
  console.info(proxy.$pinia);
});
useEventListener(window, "resize", handleResize);

function handleResize(e) {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
}
</script>
