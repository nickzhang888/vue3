import { on, off } from "@/utils/ruoyi";

function useEventListener(target = window, event, callback) {
  const getOption = () => {
    let option;
    if (typeof target === 'string') {
      option = document.querySelector(target)
    } else if (isRef(target)) {
      option = target.value
    } else {
      option = target
    }
    return option
  }
  const element = getOption();
  onMounted(() => {
    element && on(element, event, callback)
  })
  onUnmounted(() => {
    element && off(element, event, callback)
  })
}

export default useEventListener
