export default {
  formateTime(time) {
    const minutes = Math.floor(time / 60) || 0
    const seconds = Math.round(time % 60 || 0)
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
}
