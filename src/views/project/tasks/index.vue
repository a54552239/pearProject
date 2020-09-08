<template>
  <div class="project-list-index">
    <wrapper-content :showHeader="false">
      <div class="page-search">
        <a-form
          layout="inline"
          :autoFormCreate="(form)=>{this.searchForm = form}"
          @submit.prevent="handleSearchSubmit"
        >
          <a-form-item label="关键词" fieldDecoratorId="keyword">
            <a-input placeholder="请输入" allowClear />
          </a-form-item>
          <!-- <a-form-item label="创建日期" fieldDecoratorId="date">
            <a-range-picker :placeholder="['开始日期','结束日期']"></a-range-picker>
          </a-form-item>:loading="actionInfo.confirmLoading" -->
          <a-form-item>
            <a-button
              icon="search"
              type="primary"
              htmlType="submit"
              
            >搜索</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-list class="project-list" :loading="loading" size="small">
        <a-list-item :style="{padding:'8px 0'}" :key="index" v-for="(item, index) in list">
          <a-list-item-meta>
            <div slot="title">
              <div style="display: flex;justify-content: space-between ">
                <router-link
                  target="_blank"
                  class="task-title-wrap"
                  :to="`/project/space/task/${item.project_code}/detail/${item.code}`"
                >
                  <a-tooltip :title="item.name">{{ item.name }}</a-tooltip>
                </router-link>
                <router-link
                  target="_blank"
                  class="muted hidden-xs"
                  :to="'/project/space/task/' + item.project_code"
                >
                  <a-tooltip title="所属项目">{{ item.organization.project_name }}</a-tooltip>
                </router-link>
              </div>
            </div>
            <!-- <div slot="description">
            </div>-->
          </a-list-item-meta>
          <span slot="actions">
            <a-tooltip :title="item.stared ? '取消收藏' : '加入收藏'" @click="doAction(item,'star',index)">
              <a-icon type="star" v-show="!item.stared" />
              <a-icon type="star" theme="filled" style="color: #ffaf38;" v-show="item.stared" />
            </a-tooltip>
          </span>
        </a-list-item>
        <div
          v-if="showLoadingMore"
          slot="loadMore"
          :style="{ textAlign: 'center', marginTop: '3rem',marginBottom: '3rem', height: '32px', lineHeight: '32px' }"
        >
          <a-spin v-if="loadingMore">
            <a-icon slot="indicator" type="loading" style="font-size: 2rem" spin />
          </a-spin>
          <a-button v-else @click="onLoadMore">查看更多项目</a-button>
        </div>
      </a-list>
    </wrapper-content>
  </div>
</template>
<script>
import { checkResponse } from "@/assets/js/utils";
import pagination from "@/mixins/pagination";
import moment from "moment";
import { list, star } from "../../../api/task";

export default {
  components: {},
  mixins: [pagination],
  data() {
    return {
      list: [],
      loading: {
        spinning: false,
        indicator: <a-icon type="loading" style="font-size: 2rem" spin />,
      },
      showLoadingMore: false,
      loadingMore: false,
      form: this.$form.createForm(this),
      searchForm: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    moment,
    init(reset = true) {
      let app = this;
      if (reset) {
        this.list = [];
        this.pagination.page = 1;
        this.pagination.pageSize = 100;
        this.showLoadingMore = false;
      }
      this.requestData.public = "faq";
      app.loading.spinning = true;
      list(app.requestData).then((res) => {
        app.list = app.list.concat(res.data.list);
        app.pagination.total = res.data.total;
        app.showLoadingMore = app.pagination.total > app.list.length;
        app.loading.spinning = false;
        app.loadingMore = false;
      });
    },
    onLoadMore() {
      this.loadingMore = true;
      this.pagination.page++;
      this.init(false);
    },
    handleSearchSubmit() {
      let app = this;
      app.searchForm.validateFields((err) => {
        if (!err) {
          app.search();
        }
      });
    },
    search() {
      let obj = this.searchForm.getFieldsValue();
      if (Array.isArray(obj.date) && obj.date.length >= 2) {
        obj.date[0] =
          obj.date[0].format instanceof Function
            ? obj.date[0].format("YYYY-MM-DD")
            : obj.date[0];
        obj.date[1] =
          obj.date[1].format instanceof Function
            ? obj.date[1].format("YYYY-MM-DD")
            : obj.date[1];
      }
      Object.assign(this.requestData, obj);
      this.init();
    },
    doAction(record, action, index) {
      let app = this;
      if (action == "star") {
        star(record.code, record.stared ? 0 : 1).then(() => {
          app.$set(app.list[index], "stared", !record.stared);
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.wrapper-main {
  padding: 0;
}
</style>
