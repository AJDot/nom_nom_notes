<template>
  <div>
    <div
      class="flex group"
      @mouseenter="showControls"
      @mouseleave="hideControls"
    >
      <Ellipsis
        v-if="loading"
        class="mx-auto mb-4 rounded-2xl max-x-52 max-h-52 object-contain"
      />
      <img
        v-show="!loading"
        v-bind="imageAttrs"
        class="mx-auto mb-1 sm:mb-4 rounded-2xl x-52 h-52 object-cover"
        @load="onLoad"
      >
      <button
        v-if="editable && controlsVisible"
        type="button"
        class="absolute -top-2 right-6"
      >
        <label class="cursor-pointer">
          <i class="material-icons my-auto">add_a_photo</i>
          <input
            type="file"
            name="image"
            class="hidden"
            @change="onFileChange"
          >
        </label>
      </button>
      <button
        v-if="editable && controlsVisible"
        type="button"
        class="inline absolute -top-2 -right-2"
        @click="$emit('destroy')"
      >
        <i class="material-icons my-auto">delete</i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ImgHTMLAttributes } from 'vue'
import { Uploader } from 'Interfaces/imageInterfaces'
import Ellipsis from '../animations/ellipsis.vue'
import ImagePlaceholder from '/icons/image_placeholder.svg'

interface Data {
  tmpImage: Uploader
  loading: boolean
  controlsVisible: boolean
}

export default defineComponent({
  name: 'AImageUpload',
  components: {
    Ellipsis,
  },
  props: {
    modelValue: {
      type: Object as () => Uploader,
      default: null,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:modelValue': null,
    destroy: null,
  },
  data(): Data {
    return {
      tmpImage: {},
      loading: true,
      controlsVisible: false,
    }
  },
  computed: {
    imageAttrs(): ImgHTMLAttributes {
      if (this.modelValue.image) {
        return {
          src: this.modelValue.image.toString(),
          alt: this.modelValue.alt ?? 'Upload an Image',
          title: this.modelValue.alt ?? 'Upload an Image',
        }
      } else if (this.modelValue?.url) {
        return {
          src: this.modelValue.url,
          alt: this.modelValue.alt ?? 'Upload an Image',
          title: this.modelValue.alt ?? 'Upload an Image',
        }
      } else {
        return {
          id: 'image',
          class: 'img-placeholder',
          src: ImagePlaceholder,
          alt: 'Upload an Image',
          title: 'Upload an Image',
        }
      }
    },
  },
  watch: {
    'modelValue.url'(_newVal, _oldVal) {
      this.loading = true
    },
  },
  methods: {
    onFileChange(e: Event) {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (!files?.length) return
      this.loading = true
      this.createImage(files[0])
      this.$emit('update:modelValue', this.tmpImage)
    },
    createImage(file: File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.tmpImage.image = e.target?.result
      }
      this.tmpImage = {
        image: null,
        raw: file,
      }
      reader.readAsDataURL(file)
    },
    onLoad() {
      this.loading = false
    },
    showControls() {
      this.controlsVisible = true
    },
    hideControls() {
      this.controlsVisible = false
    },
  },
})
</script>
