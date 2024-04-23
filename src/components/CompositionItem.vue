<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_msg }}
      </div>
      <vee-form @submit="submitUpdate" :validation-schema="schema" :initial-values="song">
        <div class="mb-3">
          <label class="inline-block mb-2">歌名</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="输入歌名"
            @input="updateUnsavedFlag(true)"
          />
          <error-message name="modified_name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">歌手</label>
          <vee-field
            name="singer"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="输入作者"
            @input="updateUnsavedFlag(true)"
          />
          <error-message name="singer" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">类型</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="输入类型"
            @input="updateUnsavedFlag(true)"
          />
          <error-message name="genre" class="text-red-600" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          提交
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="showForm = false"
        >
          返回
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from '@/includes/firebase'

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      tyep: Function,
      required: true
    },
    updateUnsavedFlag: {
      type: Function
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'min:1|max:10|alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_msg: '请稍等，正在更新！'
    }
  },
  methods: {
    async submitUpdate(values) {
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_msg = '请稍等，正在更新！'

      // const storageRef = storage.ref()
      // const songsRef = storageRef.child(`songs/${values.original_name}`)

      try {
        // 由于name元属性不能写入，同步修改storage中的文件名的想法无疾而终
        // await originalSongsRef.moveTo(modifiedSongsRef)
        await songsCollection.doc(this.song.docId).update(values)
      } catch (error) {
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_msg = '更新失败！'
        console.log(error)
        return
      }

      //   更新Manage页面的显示
      this.updateSong(this.index, values)
      this.updateUnsavedFlag(false)

      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_msg = '更新成功！'

      setTimeout(() => {
        this.show_alert = false
        this.showForm = false
      }, 1000)
    },
    async deleteSong() {
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.original_name}`)

      await songRef.delete()
      await songsCollection.doc(this.song.docId).delete()

      this.removeSong(this.index)
    }
  }
}
</script>

<style lang="scss" scoped></style>
