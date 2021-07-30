<template>
  <div id="project-select">
    <a-dropdown
      :trigger="['click']"
      v-model="visibleMenu"
      class="action-item"
      placement="bottomCenter"
    >
      <a-tooltip
        :mouseEnterDelay="0.3"
        :title="(currentProject && currentProject.name) || '全部'"
      >
        <div class="project-select" style="color: #333">
          <span>{{ (currentProject && currentProject.name) || "全部" }}</span>
          <span class="m-l-xs">
            <a-icon type="down" />
          </span>
        </div>
      </a-tooltip>
      <div slot="overlay" class="middle-menu member-menu project-select-menu">
        <div class="search-content">
          <a-input v-model="keyword" size="default" placeholder="搜索">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </div>
        <div class="member-list">
          <vue-scroll>
            <div class="list-group">
              <a-list-item
                class="member-list-item"
                slot="renderItem"
                v-if="rettype"
                @click.native="changeProject('');currentProject = null"
              >
                <span slot="actions">
                  <a-icon type="check" v-show="showCheck('')"></a-icon>
                </span>
                <a-list-item-meta>
                  <span slot="title">全部</span>
                </a-list-item-meta>
              </a-list-item>
              <a-list
                class="list-content"
                itemLayout="horizontal"
                size="small"
                :dataSource="projectList"
                :locale="{
                  emptyText:
                    keyword && keyword.length > 1 ? '没有找到该项目' : '',
                }"
              >
                <a-list-item
                  class="member-list-item"
                  slot="renderItem"
                  slot-scope="item"
                  @click.native="changeProject(item.code)"
                >
                  <span slot="actions">
                    <a-icon type="check" v-show="showCheck(item.code)"></a-icon>
                  </span>
                  <a-list-item-meta>
                    <span slot="title">{{ item.name }}</span>
                    <a-avatar slot="avatar" icon="user" :src="item.cover" />
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </div>
          </vue-scroll>
        </div>
      </div>
    </a-dropdown>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import {
  read as getProject,
  selfList as getProjectList,
} from "../../api/project";
import pagination from "../../mixins/pagination";

export default {
  name: "ProjectSelect",
  props: {
    code: {
      type: [String],
      default() {
        return "";
      },
    },
    rettype: {
      type: [Boolean],
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      visibleMenu: false,
      keyword: "",
      loading: false,
      currentProject: null,
      projectList: [],
      projectListCopy: [],
      projectTotal: 0,
    };
  },
  mixins: [pagination],
  computed: {
    ...mapState({
      currentOrganization: (state) => state.currentOrganization,
      organizationList: (state) => state.organizationList,
    }),
  },
  watch: {
    code() {
      this.init();
    },
    keyword() {
      this.search();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.code && this.getProject();
      this.getProjectList(true);
    },
    getProject() {
      getProject(this.code).then((res) => {
        this.currentProject = res.data;
      });
    },
    getProjectList(loading = true) {
      this.loading = loading;
      this.requestData.pageSize = 50;
      this.requestData.archive = -1;
      getProjectList(this.requestData).then((res) => {
        this.projectList = res.data.list;
        this.projectListCopy = res.data.list;
        this.projectTotal = res.data.total;
        this.loading = false;
      });
    },
    changeProject(code) {
      this.visibleMenu = false;
      if (this.rettype) {
        return this.$emit("change-project", code);
      }
      if (this.$route.path == "/project/space/task/" + code) {
        this.init();
      } else {
        this.$router.push("/project/space/task/" + code);
      }
    },
    showCheck(code) {
      if (code == this.code) {
        return true;
      }
    },
    search: _.debounce(function () {
      this.keyword = this.keyword.trim();
      if (!this.keyword) {
        this.projectList = JSON.parse(JSON.stringify(this.projectListCopy));
      }
      if (this.keyword.length <= 1) {
        return false;
      }
      // this.searching = true;
      this.projectList = this.projectList.filter(
        (item) => item.name.indexOf(this.keyword) != -1
      );
    }, 500),
    getPopup() {
      return document.getElementById("project-select");
    },
  },
};
</script>

<style lang="less">
#project-select {
  cursor: pointer;

  :hover {
    /*background: rgba(0, 0, 0, 0.025);*/
  }
}

.project-select-menu {
  margin-left: 10px;

  .member-list {
    height: 290px;
  }
}
</style>
