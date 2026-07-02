import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const visible = ref(false)
  let timer: number | null = null

  function show(msg: string, duration = 2000) {
    message.value = msg
    visible.value = true

    if (timer) {
      clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      visible.value = false
      message.value = ''
      timer = null
    }, duration)
  }

  function success(msg: string) {
    show(msg)
  }

  function error(msg: string) {
    show(msg, 3000)
  }

  return { message, visible, show, success, error }
})
