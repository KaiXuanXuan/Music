<template>
  <div
    class="text-white text-center font-bold p-4 rounder mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">邮箱</label>
      <vee-field
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="输入邮箱"
        name="email"
      />
      <error-message class="text-red-500" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">密码</label>
      <vee-field
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="密码"
        name="password"
      />
      <error-message class="text-red-500" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      提交
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|excluded:password'
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_msg: '请稍等，正在登录!',
      login_alert_variant: 'bg-blue-500'
    }
  },
  methods: {
    ...mapActions(useUserStore, { authentication: 'login' }),
    async login(values) {
      this.login_in_submission = true
      this.login_show_alert = true
      this.login_alert_variant = 'bg-blue-500'
      this.login_alert_msg = '请稍等，正在登录！'

      try {
        await this.authentication(values)
      } catch (error) {
        this.login_in_submission = false
        this.login_alert_variant = 'bg-red-500'
        this.login_alert_msg = '不合法的登录!'
        return
      }

      this.login_alert_variant = 'bg-green-500'
      this.login_alert_msg = '登录成功！'

      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped></style>
