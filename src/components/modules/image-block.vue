<template>
  <draggable
    :key="mode"
    :draggable="draggable"
    :droppable="droppableTest"
    class="relative flex self-stretch rounded-md basis-0 group"
    :hover-color="hoverColor"
    :item="block"
    data-test-block="image"
    @drop="onDrop"
    @click.stop="onClick"
  >
    <AImageUpload
      class="grow"
      :model-value="tmpImage"
      :editable="isEditable"
      @update:model-value="save"
      @destroy="destroy"
    />
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { ImageBlock } from 'Interfaces/blockInterfacesGeneral'
import { FileUpload } from 'Interfaces/fileUploadInterfaces'
import { Uploader as IUploader, Uploader } from 'Interfaces/imageInterfaces'
import blockMixin from '~/mixins/blockMixin'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import AImageUpload from '../structure/a-image-upload.vue'

interface Data {
  tmpImage: Uploader
  attachment: FileUpload | null
}

export default defineComponent({
  name: 'ImageBlock',
  components: {
    Draggable,
    AImageUpload,
  },
  mixins: [
    blockMixin<ImageBlock>(),
  ],
  data(): Data {
    return {
      tmpImage: {},
      attachment: null,
    }
  },
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
  },
  watch: {
    'block.content.attachmentId'(_newVal) {
      this.updateAttachment()
    },
  },
  mounted() {
    this.updateAttachment()
  },
  methods: {
    ...mapActions(StoreModulePath.Interfaces + StoreModulePath.Choice, { unsetCurrentChoice: ChoiceActionTypes.UNSET }),
    updateAttachment() {
      const { attachment, url, alt } = this.director.findAttachment({ id: this.block.content.attachmentId })
      if (url) {
        this.tmpImage = { url, alt }
      } else {
        this.tmpImage = {}
      }
      this.attachment = attachment
    },
    onDrop(payload) {
      const { dragItemId: moveId, dropItemId: toId } = payload
      this.director.onMove({ moveId, toId })
      this.director.onSave()
    },
    onClick(event) {
      if (!this.isEditable && !this.isChooseMode) return

      if (this.currentChoice) {
        const captain = this.director.captainFor(this.block)
        captain.onChoose({ event, choice: this.currentChoice })
        this.unsetCurrentChoice()
      }
    },
    destroy(_event) {
      this.director.destroy(this.block, 'down')
      this.director.onDestroyAttachments({ block: this.block })
    },
    save(image: IUploader) {
      this.director.onImageUpload({ block: this.block, image })
    },
  },
})
</script>
