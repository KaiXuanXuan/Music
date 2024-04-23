<template>
  <div
    class="text-white text-center font-bold p-4 rounder mb-4"
    v-if="reg_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form :validation-schema="schema" :initial-values="userData" @submit="register">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">昵称</label>
      <vee-field
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="输入昵称"
        name="name"
      />
      <error-message class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">邮箱</label>
      <vee-field
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="输入邮箱"
        name="email"
      />
      <error-message class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">年龄</label>
      <vee-field
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="age"
      />
      <error-message class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">密码</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="密码"
          v-bind="field"
        />
        <div class="text-red-600" v-for="(error, index) in errors" :key="index">
          {{ error }}
        </div>
      </vee-field>
      <!-- <error-message class="text-red-600" name="password" /> -->
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">确认密码</label>
      <vee-field
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="确认密码"
        name="confirm_password"
      />
      <error-message class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">国家</label>
      <vee-field
        as="select"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="country"
      >
        <option value="USA">美国</option>
        <option value="China">中国</option>
        <option value="Germany">德国</option>
        <option value="Mexico">墨西哥</option>
      </vee-field>
      <error-message class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        name="tos"
        value="1"
      />
      <label class="inline-block">同意服务条款</label>
      <error-message class="text-red-600 block" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      提交
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:9|max:100|excluded:password',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required|country_excluded:Antarctica',
        tos: 'tos'
      },
      userData: {
        country: 'USA'
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_msg: '请稍等，账户正在创建！',
      reg_alert_variant: 'bg-blue-500'
    }
  },
  methods: {
    ...mapActions(useUserStore, { createUser: 'register' }),
    async register(values) {
      this.reg_in_submission = true
      this.reg_show_alert = true
      this.reg_alert_msg = '请稍等，账户正在创建！'
      this.reg_alert_variant = 'bg-blue-500'

      try {
        await this.createUser(values)
      } catch (error) {
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500'
        this.reg_alert_msg = '意外的错误发生了，请稍后再试！'
        console.log(error)
        return
      }

      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = '账户创建成功！'

      window.location.reload()
    }
  }
}
</script>
