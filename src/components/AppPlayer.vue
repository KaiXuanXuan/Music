<template>
  <!-- Player -->
  <div
    class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16"
    v-if="loaded"
  >
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button" @click.prevent="toggleAudio">
          <i
            class="fa text-gray-500 text-xl"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left h-7 leading-3 text-gray-400 text-lg w-14 ml-5 mt-1">
        <span class="player-currenttime">{{ seek }}</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info">
          <span class="song-title font-bold">{{ current_song.modified_name }}</span> -by
          <span class="song-artist text-base">{{
            current_song.singer == '' ? 'anonymous' : current_song.singer
          }}</span>
        </div>
        <span
          @click.prevent="updateSeek"
          class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer"
        >
          <span class="absolute -top-2 text-gray-800 text-lg" :style="{ left: playerProgress }">
            <i class="fas fa-circle"></i>
          </span>
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          ></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left h-7 leading-3 text-gray-400 text-lg w-14 ml-8 mt-1">
        <span class="player-duration">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import usePlayerStore from '@/stores/player'

export default {
  name: 'AppPlayer',
  computed: {
    ...mapState(usePlayerStore, [
      'playing',
      'seek',
      'duration',
      'playerProgress',
      'current_song',
      'loaded'
    ])
  },
  methods: {
    ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek'])
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 32) {
        this.toggleAudio()
      }
    })
  }
}
</script>

<style lang="scss"></style>
