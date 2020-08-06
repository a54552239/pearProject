<template>
  <div v-if="userInfo">
    <template v-if="type==1">
      <a-dropdown class="action-item" placement="bottomRight">
        <div class="user-info">
          <a-avatar :src="userInfo.avatar" alt>{{userInfo.name}}</a-avatar>
          <span>{{userInfo.name}}</span>
        </div>
        <a-menu slot="overlay" class="middle-menu" :selectable="false" @click="userAction">
          <a-menu-item key="setting">
            <a href="javascript:;">
              <a-icon type="user"></a-icon>个人设置
            </a>
          </a-menu-item>
          <a-menu-item key="theme">
            <a href="javascript:;">
              <a-icon type="swap" />切换主题
            </a>
          </a-menu-item>
          <a-menu-divider></a-menu-divider>
          <a-menu-item key="logout">
            <a href="javascript:;">
              <a-icon type="logout"></a-icon>退出登录
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </template>
    <template v-else>
      <div class="drawer-setting">
        <div class="user-info">
          <a-avatar :src="userInfo.avatar" alt>{{userInfo.name}}</a-avatar>
          <span>{{userInfo.name}}</span>
        </div>
        <div @click="userAction({key:'setting'})" key="setting">
          <a-icon type="user"></a-icon>个人设置
        </div>
        <div @click="userAction({key:'theme'})" key="theme">
          <a-icon type="swap" />
          {{theme=='dark'?'炫彩':'暗黑'}}模式
        </div>
        <div class="group"></div>
        <div @click="userAction({key:'logout'})" class="logout">
          <a-icon type="logout"></a-icon>退出登录
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { _out } from "../../../api/user";

export default {
  name: "HeaderAvatar",
  props: {
    type: {
      type: [String, Number],
      default: function () {
        return 1;
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      theme: (state) => state.theme,
    }),
  },
  methods: {
    userAction(action) {
      console.log(action.key);
      let app = this;
      if (action.key == "logout") {
        _out();
        app.$store.dispatch("SET_LOGOUT");
      } else if (action.key == "setting") {
        app.$router.push("/account/setting/base");
      } else if (action.key == "theme") {
        let theme = "light";
        if (this.theme == theme) {
          theme = "dark";
        }
        this.$store.dispatch("setTheme", theme);
      } else {
      }
      this.$emit("finish");
    },
  },
};
</script>

<style lang="less">
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.avatar-uploader img {
  width: 100%;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.drawer-setting {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  user-select: none;
  color: #878787;
  > * {
    padding: 0.5rem;
    line-height: 2;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
    cursor: pointer;
    transition: all 0.2s ease;
    .anticon {
      margin-right: 0.2rem;
    }
    &:active {
      background: darken(#fff, 6%);
      transition: all 0.2s ease;
    }
    &.user-info {
      padding: 1rem 0.5rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      .ant-avatar {
        margin-right: 0.5rem;
      }
      &:active {
        background: unset;
      }
    }
    &.logout {
      background: #f14242;
      color: #fff;
      border-radius: 2rem;
      text-align: center;
      word-spacing: 6px;
      letter-spacing: 0.3rem;
      &:active {
        background: darken(#f14242, 12%);
      }
    }
    &:nth-child(n + 2):not(.group) {
      border-top: solid 1px #efefef;
    }
  }
}
</style>
