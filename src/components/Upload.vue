<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">上传</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dargover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dargover = false"
        @dragover.prevent.stop="is_dargover = true"
        @dragleave.prevent.stop="is_dargover = false"
        @dragenter.prevent.stop="is_dargover = true"
        @drop.prevent.stop="upload($event)"
      >
        <h5>拖拽你的文件到这里</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <div
        class="mb-4 transition-all"
        v-for="upload in uploads"
        :key="upload.name"
        :class="upload.sucess_close"
      >
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Upload',
  data() {
    return {
      is_dargover: false,
      uploads: []
    }
  },
  props: ['addSong'],
  methods: {
    nameWithUUID(filename) {
      function generateShortUUID() {
        return Math.random().toString(36).substring(2, 8)
      }

      const parts = filename.split('.')
      const name = parts[0]
      const ext = parts[1]

      const newFilename = `${name}_${generateShortUUID()}.${ext}`
      return newFilename
    },
    upload(e) {
      this.is_dargover = false
      this.is_show = true

      const files = e.dataTransfer ? [...e.dataTransfer.files] : [...e.target.files]

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          alert('Wrong file type!')
          return
        }

        const storageRef = storage.ref()
        const filename = this.nameWithUUID(file.name)
        const songsRef = storageRef.child(`songs/${filename}`)
        // task把音乐文件存入firebase的storage
        const task = songsRef.put(file)

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: '',
            sucess_close: ''
          }) - 1

        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploads[uploadIndex].current_progress = progress
          },
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400'
            this.uploads[uploadIndex].text_class = 'text-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-times'
            console.log(error)
          },
          // 若音乐文件上传成功，把创建的song对象（音乐文件对应的描述性信息）存入database
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0,
              singer: ''
            }

            song.url = await task.snapshot.ref.getDownloadURL()
            // 返回Reference对象，是引用对象，可读可写
            const songRef = await songsCollection.add(song)
            // 返回songSnapshot对象，是快照，只读
            const songSnapshot = await songRef.get()

            this.addSong(songSnapshot)

            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].text_class = 'text-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'

            const timeoutHidden = setTimeout(() => {
              this.uploads[uploadIndex].sucess_close = 'hidden'
            }, 1500)
            clearTimeout(timeoutHidden)
          }
        )
      })
    }
  },
  // 若未上传完毕就跳转页面，则取消上传
  onBeforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  }
}
</script>
