import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
import {
  required,
  min,
  max,
  alpha_spaces,
  email,
  min_value,
  max_value,
  confirmed,
  not_one_of
} from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alpha_spaces)
    defineRule('email', email)
    defineRule('min_value', min_value)
    defineRule('max_value', max_value)
    defineRule('passwords_mismatch', confirmed)
    defineRule('excluded', not_one_of)
    defineRule('country_excluded', not_one_of)

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `当前字段是必须的`,
          min: `当前字段太短`,
          max: `当前字段太长`,
          alpha_spaces: `当前字段必须只包含字母和空格`,
          email: `当前字段必须是合法的邮箱`,
          min_value: `当前字段的值太低`,
          max_value: `当前字段的值太高`,
          passwords_mismatch: `确认密码与密码不一致`,
          excluded: `您不允许在当前字段使用这个值 `,
          country_excluded: `由于相关规定，这个国家的注册不被允许`,
          tos: `您必须先同意服务条款`
        }

        const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : '字段不合法'
        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    })
  }
}
