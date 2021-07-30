export default {
    VERSION: '2.9.1',
};
/*
1. 新增甘特图
2. 项目选择器组件完善内部调用
3. 新增工时小数显示

ALTER TABLE `pear_task` MODIFY COLUMN `work_time` decimal(10,1)  NULL DEFAULT 0.0 COMMENT '预估工时' AFTER `features_code`;
ALTER TABLE `pear_task_work_time` MODIFY COLUMN `num` decimal(10,1)  NULL DEFAULT 0.0 COMMENT '工时' AFTER `begin_time`;

4. 优化一些项目创建默认设置

ALTER TABLE `pear_project` MODIFY COLUMN `open_begin_time` tinyint(1) NULL DEFAULT 1 COMMENT '是否开启任务开始时间' AFTER `archive_time`;
ALTER TABLE `pear_project` MODIFY COLUMN `auto_update_schedule` tinyint(1) NULL DEFAULT 1 COMMENT '自动更新项目进度' AFTER `end_time`;
UPDATE `projectdb`.`pear_project` SET `auto_update_schedule`=1;
UPDATE `projectdb`.`pear_project` SET `open_begin_time`=1;

5. 增加文件物理删除
ALTER TABLE `pear_project_log` ADD COLUMN `file_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '文件id' AFTER `is_robot`;


*/