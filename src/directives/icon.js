export default {
  name: 'Icon',
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-2xl`

    if (binding.arg === 'full') {
      iconClass = binding.value
    }

    if (binding.modifiers.right) {
      iconClass += ' float-right'
    }

    if (binding.modifiers.green) {
      iconClass += ' text-green-400'
    } else {
      iconClass += ' text-yellow-400'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
