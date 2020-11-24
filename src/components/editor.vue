<template>
    <div :style="styleObject" style="word-break: break-all;">
        <div :id="id" ref="editor" :style="styleObject"></div>
    </div>
</template>

<script>
import Wangeditor from 'wangeditor'
import _ from "lodash"

export default {
    name: 'editor',
    props: ['id', 'value', 'width', 'height', 'uploadImgServer', 'disabled', 'menus', 'mapKey', 'menuFixed', 'pasteFilter', 'codeDefaultLang', 'hideLinkImg', 'uploadImgParams', 'uploadImgHeaders', 'isRealtime', 'disabledMenus', 'uploadFileName', 'uploadImgShowBase64'],
    data() {
        return {
            styleObject: {
                width: 'auto',
                height: 'auto'
            },
            editor: null
        }
    },
    methods: {
        // 设置尺寸
        initSize() {
            if (this.width) {
                this.styleObject.width = this.width + 'px'
            }
            if (this.height) {
                this.styleObject.height = this.height + 'px'
            }
        },
        // 创建编辑器
        createEditor() {
            this.editor = new Wangeditor(document.getElementById(this.id));
            this.initConfig();
            // console.log(this.editor);
            this.editor.create();
        },
        initConfig() {
            this.editor.customConfig.uploadFileName = this.uploadFileName ? this.uploadFileName : 'image[]';
            this.editor.customConfig.uploadImgServer = this.uploadImgServer;
            this.editor.customConfig.uploadImgShowBase64 = this.uploadImgShowBase64 ? this.uploadImgShowBase64 : false;
            // this.editor.customConfig.uploadImgFns.onload = (resultText, xhr) => {
            //     let originalName = this.editor.uploadImgOriginalName || '';
            //     this.$emit('load', originalName, resultText)
            // };
            // this.editor.customConfig.uploadImgFns.ontimeout = (xhr) => {
            //     this.$emit('timeout')
            // };
            // this.editor.customConfig.uploadImgFns.onerror = (xhr) => {
            //     this.$emit('error')
            // };
            this.editor.customConfig.uploadImgFileName = 'file';
            this.editor.customConfig.pasteFilter = false;
            if (this.mapKey != undefined) {
                // 配置地图key，默认空
                this.editor.customConfig.mapAk = this.mapKey
            }
            if (this.menus != undefined && this.menus instanceof Array && this.menus.length) {
                // 配置菜单，默认全部，对source进行过滤
                this.editor.customConfig.menus = this.filterMenu(this.menus)
            } else if (this.disabledMenus) {
                // 禁用菜单
                this.editor.customConfig.menus = this.filterDisabledMenu(this.editor.customConfig.menus, this.disabledMenus)
            } else {
                // this.editor.customConfig.menus = this.filterMenu(wangEditor.config.menus)
            }
            if (this.menuFixed != undefined) {
                // 配置菜单栏吸顶，默认true
                this.editor.customConfig.menuFixed = this.menuFixed
            }
            if (this.pasteFilter != undefined) {
                // 配置粘贴过滤，默认为false
                this.editor.customConfig.pasteFilter = this.pasteFilter
            }
            if (this.codeDefaultLang != undefined) {
                // 默认代码类型，默认javascript
                this.editor.customConfig.codeDefaultLang = this.codeDefaultLang
            }
            if (this.hideLinkImg != undefined) {
                // 隐藏添加网络图片功能，默认显示
                this.editor.customConfig.hideLinkImg = this.hideLinkImg
            }
            if (this.uploadImgParams != undefined && this.uploadImgParams instanceof Object) {
                // 上传图片自定义参数
                this.editor.customConfig.uploadImgParams = this.uploadImgParams
            }
            if (this.uploadImgHeaders != undefined && this.uploadImgHeaders instanceof Object) {
                // 上传图片自定义头部
                this.editor.customConfig.uploadImgHeaders = this.uploadImgHeaders
            }
            if (this.value) {
                this.setHtml(this.value)
            }
            if (this.disabled) {
                this.disable()
            }
            this.listenChange()
        },
        // 筛选编辑器菜单
        filterMenu(menus) {
            return _.map(menus, (item, key) => {
                if (item === 'source') {
                    return null
                }
                return item
            })
        },
        // 筛选不可用菜单
        filterDisabledMenu(menus, disabledMenus) {
            let menusToString = menus.join(',');
            _(disabledMenus).forEach((res) => {
                menusToString = menusToString.replace(res, '').replace(',,', ',')
            });
            if (menusToString.length && menusToString[0] == ',') {
                menusToString.substr(1, menusToString.length)
            }
            return menusToString.split(',')
        },
        insertImg(url) {
            this.editor.command(null, 'insertHtml', '<img src=' + url + ' style="max-width:100%;"/>')
        },
        // 获取内容(html)
        getHtml() {
            return this.editor.txt.html()
        },
        // 获取内容(纯文本)
        getText() {
            return this.editor.txt.text()
        },
        // 设置内容(html)
        setHtml(text) {
            this.editor.txt.html(text)
        },
        // 追加内容(html)
        appendHtml(text) {
            this.editor.txt.append(text)
        },
        // 清空内容
        clear() {
            this.editor.clear()
        },
        // 启用编辑器
        enable() {
            this.editor.enable()
        },
        // 禁用编辑器
        disable() {
            this.editor.disable()
        },
        // 销毁编辑器
        destroy() {
            this.editor.destroy()
        },
        // 恢复编辑器
        undestroy() {
            this.editor.undestroy()
        },
        // 监听内容改变
        listenChange() {
            this.editor.onchange = () => {
                this.$emit('change');
                let result = '';
                if (!this.getText()) {
                    result = this.getHtml()
                }
                if (this.isRealtime !== false) {
                    this.$emit('input', result)
                }
            }
        }
    },
    mounted() {
        this.initSize();
        setTimeout(() => {
            this.createEditor();
        }, 100);
    }
}
</script>
