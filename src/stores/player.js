import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    current_playing_url: '',
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    async playSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload()
      }

      this.current_song = song
      this.sound = new Howl({
        src: [song.url],
        html5: true
      })
      this.current_playing_url = song.url

      this.sound.play()

      this.sound.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    stopSong() {
      if (!(this.sound instanceof Howl)) {
        return
      }
      this.current_playing_url = ''
      this.sound.off('play')
      this.sound.unload()
      this.sound = {}
    },
    updateSeek(event) {
      const { width, x } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x

      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      this.sound.once('seek', this.progress)

      if (!this.sound.playing()) this.sound.play()
    },
    progress() {
      if (!(this.sound instanceof Howl)) return '0%'

      this.seek = helper.formateTime(this.sound.seek())
      this.duration = helper.formateTime(this.sound.duration())

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    }
  },
  getters: {
    playing: (state) => {
      if (!state.sound.playing) {
        return false
      }
      return state.sound.playing()
    },
    loaded: (state) => {
      if (state.sound instanceof Howl) {
        return true
      }
      return false
    }
  }
})
