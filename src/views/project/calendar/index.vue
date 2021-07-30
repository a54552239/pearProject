<template>
  <div class="calendar-index">
    <wrapper-content class="page-wrapper" :showHeader="false">
      <div class="tools">
        <project-select
          class="nav-title"
          style="display: inline-block"
          :code="code"
          :rettype="true"
          @change-project="changeProject"
        ></project-select>

        <a-popover placement="bottomRight" trigger="click">
          <div slot="content" style="max-width: 200px">
            <p>
              时间轴:
              <a-switch
                size="small"
                default-checked
                :checked-children="true"
                unchecked-children="false"
                @click="ganttChart.hideTimeaxis = !ganttChart.hideTimeaxis"
              />
            </p>
            <p>
              重叠:
              <a-switch
                size="small"
                default-checked
                :checked-children="true"
                unchecked-children="false"
                @click="ganttChart.pushOnOverlap = !ganttChart.pushOnOverlap"
              />
            </p>
            <p>
              表格线:
              <a-switch
                size="small"
                default-checked
                :checked-children="true"
                unchecked-children="false"
                @click="ganttChart.grid = !ganttChart.grid"
              />
            </p>
            <p>
              悬停突出:
              <a-switch
                size="small"
                default-checked
                :checked-children="true"
                unchecked-children="false"
                @click="ganttChart.highlightedHours = !ganttChart.highlightedHours"
              />
            </p>
            <p>
              行高:
              <a-slider
                :default-value="40"
                v-model="ganttChart.rowHeight"
                :min="10"
                :max="200"
              />
            </p>
            <p>
              行标题宽:
              <a-slider
                :default-value="6"
                v-model="ganttChart.rowLabelWidth"
                :min="1"
                :max="1000"
              />
            </p>
            <p>
              时间标记偏移:
              <a-slider
                :default-value="0"
                v-model="ganttChart.timemarkerOffset"
                :min="0"
                :max="200"
              />
            </p>
            <p>
              整体大小:
              <a-slider v-model="ganttChart.width" :min="100" :max="100000" />
            </p>
            <p>
              主题:
              <a-select
                size="small"
                default-value="default"
                v-model="ganttChart.selectedTheme"
              >
                <a-select-option
                  :value="theme.value"
                  v-for="theme in ganttChart.themes"
                  :key="'setting-theme-' + theme.value"
                  >{{ theme.name }}</a-select-option
                >
              </a-select>
            </p>
            <!-- <p>
              时间显示:
              <a-select
                size="small"
                :default-value="[...Array(24).keys()]"
                mode="multiple"
                v-model="ganttChart.hours"
              >
                <a-select-option
                  :value="hour"
                  v-for="hour in [...Array(24).keys()]"
                  :key="'setting-hour-' + hour"
                  >{{ hour }}</a-select-option
                >
              </a-select>
            </p> -->
            <p>
              时间高亮:
              <a-select
                size="small"
                :default-value="[0, 18]"
                mode="multiple"
                v-model="ganttChart.highlightedHours"
              >
                <a-select-option
                  :value="hour"
                  v-for="hour in ganttChart.hours"
                  :key="'setting-hours-' + hour"
                  >{{ hour }}</a-select-option
                >
              </a-select>
            </p>
          </div>
          <template slot="title">
            <span>设置</span>
          </template>
          <a-button size="small" type="default" shape="circle" icon="setting"></a-button>
        </a-popover>
      </div>
      <!--  :themeColors="'#f00'" -->
      <div class="calendar-layout">
        <g-gantt-chart
          class="calendar-view"
          :style="{ width: `${ganttChart.width}px` }"
          :chartWidth="ganttChart.width"
          :chart-start="ganttChart.start"
          :chart-end="ganttChart.end"
          locale="zh-cn"
          :timemarkerOffset="ganttChart.timemarkerOffset"
          :grid="ganttChart.grid"
          :hours="ganttChart.hours"
          :hide-timeaxis="ganttChart.hideTimeaxis"
          :push-on-overlap="ganttChart.pushOnOverlap"
          :highlighted-hours="ganttChart.highlightedHours"
          :row-label-width="`${ganttChart.rowLabelWidth}px`"
          :row-height="ganttChart.rowHeight"
          :theme="ganttChart.selectedTheme"
          @mousedown-bar="onMousedownBar($event)"
          @contextmenu-bar="onContextmenuBar($event)"
          @dragend-bar="stoppedDraggingBar($event)"
        >
          <g-gantt-row
            class="calendar-row"
            :highlight-on-hover="ganttChart.highlightOnHover"
            v-for="row in rowList"
            :key="row.label"
            :label="row.label"
            :bars="row.barList"
            bar-start="myStart"
            bar-end="myEnd"
          >
            <template #bar-label="{ bar }">
              <div class="calendar-row-babel">{{ bar.label }}</div>
            </template>
          </g-gantt-row>
        </g-gantt-chart>
      </div>
    </wrapper-content>
  </div>
</template>
<script>
import { mapState } from "vuex";
import projectSelect from "@/components/project/projectSelect";
import { GGanttChart, GGanttRow } from "vue-ganttastic";
import pagination from "@/mixins/pagination";
import { list, getListByTaskTag } from "../../../api/task";
import { tasks as getTasks } from "../../../api/taskStages";
import { randomColor } from "../../../utils/utils";

const taskList = [];

export default {
  components: {
    projectSelect,
    GGanttChart,
    GGanttRow,
  },
  mixins: [pagination],
  data() {
    return {
      code: "",
      loading: false,
      ganttChart: {
        width: 14900,
        start: this.$moment().startOf("week").format("YYYY-MM-DD HH:mm:ss"),
        end: this.$moment().startOf("week").add("day", 7).format("YYYY-MM-DD HH:mm:ss"), //this.$moment().endOf("week").format("YYYY-MM-DD HH:mm:ss"),
        pushOnOverlap: false,
        grid: true,
        rowHeight: 40,
        rowLabelWidth: 50,
        hideTimeaxis: false,
        highlightOnHover: false,
        hours: [...Array(24).keys()],
        highlightedHours: [0, 18],
        showContextmenu: false,
        timemarkerOffset: 0,
        contextmenuTimeout: null,
        contextmenuX: 0,
        contextmenuY: 0,
        selectedTheme: "default",
        themes: [
          { name: "默认主题", value: "default" },
          { name: "深色主题", value: "dark" },
          { name: "蓝色主题", value: "material-blue" },
          { name: "温馨主题", value: "creamy" },
          { name: "天空主题", value: "sky" },
          { name: "slumber", value: "slumber" },
          { name: "crimson", value: "crimson" },
          { name: "grove", value: "grove" },
          { name: "fuchsia", value: "fuchsia" },
          { name: "flare", value: "flare" },
          { name: "vue", value: "vue" },
        ],
      },
      rowList: [],
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    init(reset = true) {
      if (reset) {
        this.pagination.page = 1;
        this.pagination.pageSize = 10;
      }
    },
    changeProject(code) {
      this.code = code;

      list({
        projectCode: this.code,
        //stageCode: "azfhobi08vucpj7dr25n91sl",
        //createTime: [this.ganttChart.start, this.ganttChart.end],
        beginTime: this.ganttChart.start,
        endTime: this.ganttChart.end,
      }).then((res) => {
        if (res.data.total > 0) {
          this.rowList = res.data.list
            .map((task, index) => {
              if (task.begin_time && task.end_time) {
                let color = randomColor(2);
                return {
                  label: `Row-${task.id}`,
                  barList: [
                    {
                      myStart: task.begin_time || task.create_time,
                      myEnd: task.end_time,
                      label: task.name + " - " + task.executor.name,
                      project_code: task.project_code,
                      code: task.code,
                      id: task.id,
                      ganttBarConfig: {
                        color: color,
                        backgroundColor: color,
                        bundle: "groveBundle",
                        opacity: 1,
                        immobile: true,
                        handles: false, //缩放
                        borderRadius: 20,
                      },
                    },
                  ],
                };
              }
            })
            .filter((e) => e);
        } else {
          this.rowList = [];
        }
      });
    },
    onMousedownBar({ bar }) {
      window.open(
        `/#/project/space/task/${bar.project_code}/detail/${bar.code}`,
        "_blank"
      );
    },
    stoppedDraggingBar() {},
    onContextmenuBar(e) {
      e.event.preventDefault();
      this.contextmenuY = e.event.clientY;
      this.contextmenuX = e.event.clientX;
      this.showContextmenu = true;
      if (this.contextmenuTimeout) {
        clearTimeout(this.contextmenuTimeout);
      }
      this.contextmenuTimeout = setTimeout(() => (this.showContextmenu = false), 3000);
    },
  },
};
</script>
<style lang="less">
.g-gantt-bar {
  &:hover {
    filter: brightness(1.1);
  }
}
</style>

<style lang="less" scoped>
.calendar-index {
  .page-wrapper {
    .tools {
      margin: 0 0 1rem 0;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
    }
    .calendar-layout {
      overflow: auto;
      position: relative;
      #g-timeaxis {
        box-shadow: 0px 1px 3px 2px rgb(234 234 234 / 66%);
      }
      #g-timeaxis-marker {
        width: 2px;
        background: rgb(0 0 0 / 50%);
      }
      .g-gantt-row > .g-gantt-row-bars-container {
        width: 80%;
      }
      .calendar-view {
        position: relative;
        /* width: max-content; */
        min-width: 100%;
        .calendar-row {
          position: relative;
          .calendar-row-babel {
            filter: invert(1) brightness(1.4);
            color: inherit;
            white-space: normal;
            font-size: 50%;
          }

          .g-gantt-bar-label > * {
            overflow: initial;
            text-overflow: unset;
          }
        }
      }
    }
  }
}
</style>
