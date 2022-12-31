<template>
  <draggable :key="mode" :draggable="draggable" :droppable="droppableTest" class="relative flex self-stretch rounded-md basis-0 group" :hover-color="hoverColor" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop" @click.stop="blockListeners.click">
    <AImageUpload class="grow" :model-value="tmpImage" @update:model-value="save" :editable="isEditable" @destroy="destroy" />
  </draggable>
</template>

<script lang="ts">
import Draggable from "@/modules/draggable/draggable.vue"
import { defineComponent } from "vue"
import draggable from "vuedraggable"
import { ImageBlock } from "~/interfaces/blockInterfacesGeneral"
import { FileUpload } from "~/interfaces/fileUploadInterfaces"
import { Uploader as IUploader, Uploader } from "~/interfaces/imageInterfaces"
import blockListeners from "~/mixins/blockListeners"
import blockMixin from "~/mixins/blockMixin"
import AImageUpload from "../structure/a-image-upload.vue"

interface Data {
  tmpImage: Uploader
  attachment: FileUpload | null
}

export default defineComponent({
  name: "ImageBlock",
  components: {
    Draggable,
    AImageUpload
  },
  mixins: [
    blockMixin<ImageBlock>(),
    blockListeners,
  ],
  data(): Data {
    return {
      tmpImage: {},
      attachment: null,
    }
  },
  mounted() {
    this.updateAttachment()
  },
  methods: {
    updateAttachment() {
      const { attachment, url } = this.director.findAttachment({ id: this.block.content.attachmentId })
      if (url) {
        this.tmpImage = { url }
      } else {
        this.tmpImage = {}
      }
      this.attachment = attachment
    },
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    },
    destroy(event) {
      this.director.onDestroy({ block: this.block })
    },
    save(image: IUploader) {
      this.director.onImageUpload({ block: this.block, image })
    },
  },
  watch: {
    'block.content.attachmentId'(newVal) {
      this.updateAttachment()
    },
  }
})
</script>
