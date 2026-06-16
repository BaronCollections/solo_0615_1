import { ref, computed } from 'vue'
import type { MockUser } from '../types'
import { validateLogin } from '../utils/auth'

const STORAGE_KEY = 'smart_campus_user'

const currentUser = ref<MockUser | null>(null)

const initUser = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      currentUser.value = JSON.parse(stored)
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

initUser()

export function useAuth() {
  const isLoggedIn = computed(() => !!currentUser.value)
  const userRole = computed(() => currentUser.value?.role)
  const userName = computed(() => currentUser.value?.name)

  const login = (username: string, password: string) => {
    const result = validateLogin(username, password)
    if (result.success && result.user) {
      currentUser.value = result.user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user))
      return { success: true, message: '登录成功' }
    }
    return { success: false, message: result.message }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    currentUser,
    isLoggedIn,
    userRole,
    userName,
    login,
    logout
  }
}
