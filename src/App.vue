<script setup lang="ts">
import Login from './views/Login.vue'
import Layout from './components/layout/Layout.vue'
import { useAuth } from './stores/auth'

const { isLoggedIn } = useAuth()

const handleLoginSuccess = () => {
  // 登录成功后的处理，store 已经更新了状态
}
</script>

<template>
  <Layout v-if="isLoggedIn" />
  <Login v-else @login-success="handleLoginSuccess" />
</template>
