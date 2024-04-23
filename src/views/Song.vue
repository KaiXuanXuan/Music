<template>
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <button
        v-if="atPlayingPage"
        @click.prevent="stopSong"
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-stop"></i>
      </button>
      <button
        v-else
        @click.prevent="playSong(song)"
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>

      <div class="z-50 text-left ml-8">
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.gener }}</div>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">
          {{ song.comment_count > 0 ? song.comment_count + ' 条' : '没有' }}评论</span
        >
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-field
            as="textarea"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
            name="comment"
          ></vee-field>
          <error-message name="comment" class="text-red-600 block" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600"
            :disabled="comment_in_submission"
          >
            上传评论
          </button>
        </vee-form>
        <select
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          v-model="sort"
        >
          <option value="1">最新</option>
          <option value="2">最旧</option>
        </select>
      </div>
    </div>
  </section>
  <ul class="container mx-auto mt-6" id="comments">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in sortedComments"
      :key="comment.docId"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>
      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</template>

<script>
import { songsCollection, commentsCollection, auth } from '@/includes/firebase'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comments: [],
      sort: '1',
      schema: {
        comment: 'required|min:3'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: '请稍等，评论正在上传！'
    }
  },
  async created() {
    const snapshot = await songsCollection.doc(this.$route.params.id).get()
    if (!snapshot.exists) {
      this.$router.push({ name: '404' })
      return
    }

    const { sort } = this.$route.query
    this.sort = sort === '1' || sort === '2' ? sort : '1'

    this.song = snapshot.data()
    this.getComments()
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['current_playing_url']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        } else {
          return new Date(a.datePosted) - new Date(b.datePosted)
        }
      })
    },
    atPlayingPage() {
      return this.current_playing_url === this.song.url
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['playSong', 'stopSong']),

    async addComment(values) {
      if (!this.userLoggedIn) return

      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_message = '请稍等，评论正在上传！'

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      }

      try {
        await commentsCollection.add(comment)
        this.getComments()
        this.comment_in_submission = false
        this.comment_show_alert = true
        this.comment_alert_variant = 'bg-green-500'
        this.comment_alert_message = '评论上传成功！'

        this.song.comment_count += 1
        await songsCollection.doc(this.$route.params.id).update(this.song)
      } catch (error) {
        this.comment_in_submission = false
        this.comment_show_alert = true
        this.comment_alert_variant = 'bg-red-500'
        this.comment_alert_message = '意外的错误发生了，请稍后再试！'
        console.log(error)
      }
    },
    async getComments() {
      const snapshot = await commentsCollection.where('sid', '==', this.$route.params.id).get()

      this.comments = []

      snapshot.forEach((doc) => {
        this.comments.push({
          ...doc.data(),
          docId: doc.id
        })
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) return

      this.$router.push({ query: { sort: newVal } })
    }
  }
}
</script>
