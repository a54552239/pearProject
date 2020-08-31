<template>
  <div class="project-space-files" :class="project.task_board_theme">
    <a-row class="project-navigation" align="middle" justify="center">
      <a-col class="project-nav-header" :span="8" :xs="24" :sm="10" :md="8" :lg="8">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a @click="toHome">
              <a-icon type="home" />首页
            </a>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <project-select class="nav-title" style="display: inline-block" :code="code"></project-select>
            <span class="actions">
              <a-tooltip
                :mouseEnterDelay="0.3"
                :title="project.collected ? '取消收藏' : '加入收藏'"
                @click="collectProject"
              >
                <a-icon
                  type="star"
                  theme="filled"
                  style="color: grey;"
                  v-show="!project.collected"
                />
                <a-icon
                  type="star"
                  theme="filled"
                  style="color: #ffaf38;"
                  v-show="project.collected"
                />
              </a-tooltip>
            </span>
            <span class="label label-normal" v-if="project.private === 0">
              <a-icon type="global" />公开
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
      <a-col class="nav-body" :span="8" :xs="24" :sm="14" :md="8" :lg="8">
        <ul class="nav-wrapper nav nav-underscore">
          <li class data-app="tasks" @click="$router.push('/project/space/task/' + code)">任务</li>
          <li class="actives" data-app="works" @click="getFiles">文件</li>
          <li class data-app="build" @click="$router.push('/project/space/overview/' + code)">概览</li>
          <li class data-app="build" @click="$router.push('/project/space/features/' + code)">版本</li>
        </ul>
      </a-col>
    </a-row>
    <wrapper-content :showHeader="false">
      <div class="content-wrapper">
        <div class="content-item files-list">
          <div class="header">
            <span class="title">我的文件</span>
            <div class="header-actions">
              <!--<a><a-icon type="upload"></a-icon> 上传文件</a>-->
              <a-button id="upload-file" icon="up-circle" type="dashed" size="small">上传</a-button>
            </div>
          </div>
          <div class="list-content">
            <a-list :loading="loading">
              <a-list-item class="list-item-title">
                <a-list-item-meta>
                  <div class="muted" slot="title">名称</div>
                </a-list-item-meta>
                <div class="other-info muted">
                  <div class="info-item">
                    <span>大小</span>
                  </div>
                  <div class="info-item">
                    <span>创建日期</span>
                  </div>
                  <div class="info-item">
                    <span>创建人</span>
                  </div>
                </div>
                <span slot="actions">
                  <a-tooltip :mouseEnterDelay="0.5">
                    <template slot="title">
                      <span>移上显示</span>
                    </template>
                    操作
                  </a-tooltip>
                </span>
              </a-list-item>
              <a-list-item class="list-item" :key="index" v-for="(item, index) in files">
                <a-list-item-meta>
                  <a-avatar slot="avatar" shape="square" icon="link" :src="item.file_url" />
                  <div slot="title">
                    <a-tooltip :mouseEnterDelay="0.3">
                      <template slot="title">
                        <span>{{item.fullName}}</span>
                      </template>
                      <a-input
                        :ref="`inputTitle${index}`"
                        :auto-focus="true"
                        v-model="item.title"
                        v-show="item.editing"
                        @pressEnter="onCellChange(item)"
                        @blur="onCellChange(item)"
                      ></a-input>
                      <a
                        class="text-default"
                        target="_blank"
                        :href="item | showPreviewUrl"
                        :title="item.fullName"
                        v-show="!item.editing"
                      >{{item.fullName.length>30?item.fullName.substr(0,30)+'...':item.fullName}}</a>
                    </a-tooltip>
                  </div>
                </a-list-item-meta>
                <div class="other-info muted">
                  <div class="info-item">
                    <span>{{(formatSize(item.size))}}</span>
                  </div>
                  <div class="info-item">
                    <a-tooltip :title="item.create_time">
                      <span>{{ formatTime(item.create_time) }}</span>
                    </a-tooltip>
                  </div>
                  <div class="info-item">
                    <span>{{item.creatorName}}</span>
                  </div>
                </div>
                <span slot="actions">
                  <a-tooltip title="下载">
                    <a class="muted" target="_blank" :href="item.file_url">
                      <a-icon type="download" />
                    </a>
                  </a-tooltip>
                </span>
                <!-- <span slot="actions">
                                     <a-tooltip title="更新">
                                         <a-icon type="upload"/>
                                     </a-tooltip>
                </span>-->
                <span slot="actions" @click="editFile(item,index)">
                  <a-tooltip title="编辑">
                    <a-icon type="edit" />
                  </a-tooltip>
                </span>
                <a class="muted" slot="actions">
                  <a-dropdown :trigger="['click']" placement="bottomRight">
                    <a-tooltip :mouseEnterDelay="0.5">
                      <template slot="title">
                        <span>更多操作</span>
                      </template>
                      <a class="action-item muted">
                        <a-icon type="down" />
                      </a>
                    </a-tooltip>
                    <a-menu
                      class="field-right-menu"
                      v-clipboard="item.file_url"
                      @click="doFile($event,item.code)"
                      slot="overlay"
                    >
                      <a-menu-item key="copy">
                        <a-icon type="link" />
                        <span>复制链接</span>
                      </a-menu-item>
                      <a-menu-item key="delete">
                        <a-icon type="delete" />
                        <span>移到回收站</span>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </a>
              </a-list-item>
              <div
                v-if="showLoadingMore"
                slot="loadMore"
                :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
              >
                <a-spin v-if="loadingMore" />
                <a-button v-else @click="onLoadMore">查看更多文件</a-button>
              </div>
            </a-list>
          </div>
        </div>
      </div>
    </wrapper-content>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { read as getProject } from "../../../api/project";
import { collect } from "../../../api/projectCollect";
import { checkResponse } from "../../../assets/js/utils";
import { relativelyTime } from "../../../assets/js/dateTime";
import { edit, list, recycle } from "../../../api/file";
import pagination from "@/mixins/pagination";
import { notice } from "../../../assets/js/notice";
import projectSelect from "@/components/project/projectSelect";

export default {
  name: "project-space-files",
  mixins: [pagination],
  data() {
    return {
      code: this.$route.params.code,
      loading: true,
      showLoadingMore: false,
      loadingMore: false,
      project: { task_board_theme: "simple" },
      currentFileIndex: {},
      files: [],
    };
  },
  components: {
    projectSelect,
  },
  computed: {
    ...mapState({
      uploader: (state) => state.common.uploader,
    }),
  },
  watch: {
    uploader: {
      handler(newVal, oldVal) {
        //监听是否有上传文件行为
        const files = newVal.fileList;
        const index = files.findIndex(
          (item) => item.projectName == this.project.name
        );
        if (index !== -1) {
          this.getFiles();
        }
      },
      deep: true,
    },
  },
  created() {
    this.getProject();
    this.getFiles();
  },
  mounted() {
    setTimeout(() => {
      this.uploader.assignBrowse(document.getElementById("upload-file"));
    }, 500);
  },
  methods: {
    getProject() {
      this.loading = true;
      getProject(this.code).then((res) => {
        this.loading = false;
        this.project = res.data;
        this.$store.dispatch("setTempData", {
          projectCode: this.project.code,
        });
      });
    },
    getFiles(reset = true) {
      let app = this;
      if (reset) {
        this.pagination.page = 1;
        this.pagination.pageSize = 50;
        this.showLoadingMore = false;
      }
      app.requestData.projectCode = this.code;
      app.requestData.deleted = 0;
      list(app.requestData).then((res) => {
        if (reset) {
          this.files = [];
        }
        res.data.list.forEach((v) => {
          v.editing = false;
        });
        app.files = app.files.concat(res.data.list);
        app.pagination.total = res.data.total;
        app.showLoadingMore = app.pagination.total > app.files.length;
        app.loading = false;
        app.loadingMore = false;
      });
    },
    onLoadMore() {
      this.loadingMore = true;
      this.pagination.page++;
      this.getFiles(false);
    },
    collectProject() {
      const type = this.project.collected ? "cancel" : "collect";
      collect(this.project.code, type).then((res) => {
        if (!checkResponse(res)) {
          return;
        }
        this.project.collected = !this.project.collected;
      });
    },
    editFile(file, index) {
      let app = this;
      this.files.forEach((v) => {
        v.editing = false;
      });
      this.files[index].editing = true;
      this.$nextTick(() => {
        app.$refs[`inputTitle${index}`][0].focus();
      });
      this.currentFileIndex = index;
    },
    onCellChange(file) {
      let currentFile = this.files[this.currentFileIndex];
      this.files.forEach((v) => {
        v.editing = false;
      });
      const fullName = `${file.title}.${file.extension}`;
      if (fullName != currentFile.fullName) {
        edit({ title: currentFile.title, fileCode: currentFile.code }).then(
          (res) => {
            const result = checkResponse(res);
            if (!result) {
              return false;
            }
            currentFile.title = file.title;
            currentFile.fullName = fullName;
            notice(
              {
                title: "重命名成功",
              },
              "notice",
              "success"
            );
          }
        );
      }
    },
    doFile(action, fileCode) {
      let app = this;
      const actionKey = action.key;
      switch (actionKey) {
        case "delete":
          this.$confirm({
            title: "移到回收站",
            content: `您确定要把该文件移到回收站吗？`,
            okText: "移到回收站",
            okType: "danger",
            cancelText: `再想想`,
            onOk() {
              recycle(fileCode).then((res) => {
                const result = checkResponse(res);
                if (!result) {
                  return false;
                }
                app.getFiles();
              });
              notice(
                {
                  title: "成功移到回收站",
                  msg: "可在 菜单－查看回收站－文件 中查看",
                },
                "notice",
                "success",
                5
              );
              return Promise.resolve();
            },
          });
          break;
        case "copy":
          notice(
            {
              title: "复制链接成功",
              msg: "在地址栏粘贴并打开可下载该资源",
            },
            "notice",
            "success",
            5
          );
          return true;
      }
    },
    formatTime(time) {
      return relativelyTime(time);
    },
    formatSize(size) {
      let type = "KB";
      size = size / 1024;
      if (size >= 1024) {
        size /= 1024;
        type = "MB";
      }
      return `${size.toFixed(2)} ${type}`;
    },
  },
};
</script>

<style lang="less" scoped>
.project-space-files {
  .wrapper-main {
    background: initial;
  }
}
</style>
