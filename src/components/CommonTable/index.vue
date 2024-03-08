<template>
  <el-table
    :data="data"
    :height="height"
    v-loading="loading"
    :header-cell-style="headerStyle"
    @selection-change="handleSelectionChange"
    @mouseenter.native="mouseenter"
    @mouseleave.native="mouseleave"
    @row-click="handleRowClick"
    ref="table"
    :header-row-style="fixHeight"
    :row-style="fixHeight"
  >
    <el-table-column
      type="selection"
      width="80"
      align="center"
      v-if="isSelected"
    />
    <el-table-column label="序号" type="index" width="80" align="center">
      <template #default="scope">
        <!-- 有分页时-->
        <span v-if="queryParams">
          {{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}
          {{ log(queryParams, "if") }}
        </span>
        <!-- 无分页时 -->
        <span v-else>{{ scope.$index + 1 }}{{ log(queryParams, "else") }}</span>
      </template>
    </el-table-column>
    <template v-for="(col, index) in columns">
      <!-- 操作列/自定义列 -->
      <slot v-if="col.slot" :name="col.slot"></slot>
      <!-- 普通列 -->
      <el-table-column
        v-else
        :key="index"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :formatter="col.formatter"
        align="center"
        :show-overflow-tooltip="true"
        @click="handleColumnClick(col)"
      >
      </el-table-column>
    </template>
    <template #append>
      <div :style="{ height: `${scrollHeight}px` }"></div>
    </template>
  </el-table>
</template>

<script setup>
import { on, off, throttle } from "@/utils/ruoyi.js";
const emit = defineEmits(["columnClick","rowClick","select"]);
const currentIndex = ref(0);
const tableData = ref([]);
const scrollHeight = ref(0);
const isCheckedAll = ref(false);
let selectedRows = ref([]);
const { proxy } = getCurrentInstance();
const props = defineProps({
  // 是否加载显示
  loading: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
  },
  //是否可以勾选
  isSelected: {
    type: Boolean,
    default: false,
  },
  // 表格内数据
  data: {
    type: Array,
    default() {
      return []
    },
  },
  // 表格内列的名称
  columns: {
    type: Array,
    default() {
      return []
    },
  },
  // 查询的参数
  queryParams: {
    type: Object,
  },
  // 表格头部样式
  headerStyle: {
    type: Object,
    default() {
      return {};
    },
  },
  // 是否自动滚动
  isRoll: {
    type: Boolean,
    default: false,
  },
  //设置固定高度
  rowHeight: {
    type: Number,
    default: 45,
  },
  keyProp: {
    type: String,
    default: "id",
  },
  buffer: {
    type: Number,
    default: 500,
  },
  // 滚动事件的节流时间
  throttleTime: {
    type: Number,
    default: 10,
  },
});
onMounted(() => {
  nextTick(() => {
    mouseleave();
    // this.ele = this.$refs.table.bodyWrapper;
    // // 初次执行
    // this.handleScroll();
    // this.onScroll = !this.throttleTime
    //   ? this.handleScroll
    //   : throttle(this.handleScroll, this.throttleTime);
    // //可滚动的距离
    // this.getScrollHeight();
    // //开启监听
    // on(this.ele, "scroll", this.onScroll);
  });
});
onBeforeUnmount(() => {
  mouseenter();
  //   off(this.ele, "scroll", this.onScroll);
});

const fixHeight = () => {
  return { height: props.rowHeight + "px" };
};
function mouseenter() {
  props.isRoll && autoRoll(true);
}
function mouseleave() {
  props.isRoll && autoRoll();
}
function autoRoll(stop) {
  if (stop) {
    clearInterval(rolltimer);
    return;
  }
  const table = proxy.$refs.table;
  const bodyWrapper = table.bodyWrapper;
  // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果
  const rolltimer = setInterval(() => {
    // 判断是否滚动到此元素,并高亮显示
    let index = parseInt(bodyWrapper.scrollTop / (props.rowHeight / 2));
    table.setCurrentRow(props.data[index], true);
    if (currentIndex !== index) {
      //根据不同行做需要做的事情
      autoProcess(index);
    }
    // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
    if (
      bodyWrapper.clientHeight + Math.ceil(bodyWrapper.scrollTop) >=
      bodyWrapper.scrollHeight
    ) {
      bodyWrapper.scrollTop = 0;
    } else {
      bodyWrapper.scrollTop++;
    }
  }, 5 * 10);
}
function autoProcess(index) {
  currentIndex = index;
}
//列点击事件
function handleColumnClick(col) {
  console.info("列");
  emit("columnClick", col);
}
// 勾选框变化时,自定义了勾选框,此处不触发
function handleSelectionChange(selection) {
  selectedRows = [...selection];
  emit("select", selection);
}
// 点击某一行时触发
function handleRowClick(row) {
  emit("rowClick", row);
}
</script>

<style lang="scss" scoped>
::v-deep(.el-table__body-wrapper) {
  overflow-y: auto;
}
</style>
