<template>
  <div :style="styleObject">
    <div :id="id" :style="styleObject"></div>
  </div>
</template>

<script>
  import Wangeditor from 'wangeditor'
  export default {
    props: ['id', 'value', 'width', 'height', 'uploadImgUrl', 'disabled', 'menus', 'mapKey', 'menuFixed', 'pasteFilter', 'codeDefaultLang', 'hideLinkImg', 'uploadParams', 'uploadHeaders', 'isRealtime', 'disabledMenus'],
    data() {
      return {
        styleObject: {
          width: '600px',
          height: '400px'
        },
        editor: null
      }
    },
    methods: {
      // 设置尺寸
      initSize() {
      },
      // 创建编辑器
      createEditor() {
        this.editor = new Wangeditor('#editor')
        console.log(this.editor)
        this.editor.create()
      },
    },
    mounted() {
//      this.initSize()
//      this.createEditor()
    }
  }
</script>