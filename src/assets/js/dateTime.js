/**
 * 获取本周一时间
 * @returns {number}
 */
import moment from "moment";

export const getWeekDay = () => {
    //起止日期数组
    var startStop = [];
    //获取当前时间
    var currentDate = new Date();
    //返回date是一周中的某一天
    var week = currentDate.getDay();
    //返回date是一个月中的某一天
    var month = currentDate.getDate();

    //一天的毫秒数
    var millisecond = 1000 * 60 * 60 * 24;
    //减去的天数
    var minusDay = week != 0 ? week - 1 : 6;
    //alert(minusDay)
    //本周 周一
    var monday = new Date(currentDate.getTime() - (minusDay * millisecond));
    //本周 周日
    var sunday = new Date(monday.getTime() + (6 * millisecond));
    monday = monday.getFullYear() + "-" + (monday.getMonth() + 1) + "-" + monday.getDate();
    sunday = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate();
    var week_day = {
        monday: monday,
        sunday: sunday,
    };
    return week_day
};
/**
 * 格式化相对时间
 * @returns {string}
 * @param value
 * @param now
 */
export const relativelyTime = (value, now) => {
    if (!now) {
        now = moment();
    }
    const diff = moment(now).diff(moment(value), 'hours');
    if (diff <= 1) {
        return moment(value).fromNow();
    }
    const today = moment(now).get('date');
    const current = moment(value).get('date');
    if (current < today - 1) {
        // return moment(value).format('M月D日 H:mm');
    }
    let detailTime = moment(value).format('H:mm');
    const currentDate = moment(value).format('YYYY-MM-DD');
    const currentMonday = moment().weekday(0).format('YYYY-MM-DD');
    const currentSunday = moment().weekday(6).format('YYYY-MM-DD');
    let weekDate = '';
    if (currentDate < currentMonday) {
        weekDate = '[上周]dd ' + detailTime;
    }else if (currentDate > currentSunday) {
        weekDate = '[下周]dd ' + detailTime;
    }else{
        weekDate = '[周]dd ' + detailTime;
    }
    return moment(value).calendar(null, {
        sameDay: '[今天 ]' + moment(value).format('H:mm'),
        nextDay: '[明天 ]' + detailTime,
        nextWeek: weekDate,
        lastDay: '[昨天 ]' + detailTime,
        lastWeek: weekDate,
        sameElse: 'M月D日 H:mm'
    });
};
/**
 *
 * @param value 日期
 * @param showDetailTime 是否显示具体时间
 * @returns {string}
 */
export const relativelyTaskTime = (value, showDetailTime = false) => {
    let detailTime = moment(value).format('H:mm');
    if (!showDetailTime) {
        detailTime = '';
    }
    const currentDate = moment(value).format('YYYY-MM-DD');
    const currentMonday = moment().weekday(0).format('YYYY-MM-DD');
    const currentSunday = moment().weekday(6).format('YYYY-MM-DD');
    let weekDate = '';
    if (currentDate < currentMonday) {
        weekDate = '[上周]dd ' + detailTime;
    }else if (currentDate > currentSunday) {
        weekDate = '[下周]dd ' + detailTime;
    }else{
        weekDate = '[周]dd ' + detailTime;
    }
    return moment(value).calendar(null, {
        sameDay: '[今天 ]' + moment(value).format('H:mm'),
        nextDay: '[明天 ]' + detailTime,
        nextWeek: weekDate,
        lastDay: '[昨天 ]' + detailTime,
        lastWeek: weekDate,
        sameElse: 'M月D日 H:mm'
    });
};
export const formatTaskTime = (begin, end) => {
    //如果不是今天则不显示具体时间
    if (!end && begin) {
        return relativelyTaskTime(begin) + ' 开始';
    }
    if (!begin) {
        return relativelyTaskTime(end) + ' 截止';
    }
    return relativelyTaskTime(begin) + ' - ' + relativelyTaskTime(end);
};
/**
 * 格式化时间
 * @param data
 * @param show
 * @returns {string}
 */
export const format_date = (data, show) => {
    if (show == undefined) {
        show = true
    }
    //格式化时间
    let now = new Date(data * 1000);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    // let second = now.getSeconds();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    const finally_date = {
        year: year,
        month: month,
        day: date,
        hour: hour,
        minute: minute
    };
    if (show) {
        return year + "-" + month + "-" + date + "   " + hour + ":" + minute;
    } else {
        return finally_date
    }
};

export const formatDateNow = (day) => {
    //格式化时间
    if (day == undefined) {
        day = 0;
    }
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate() + day;
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    return year + "-" + month + "-" + date;
};

/**
 *  格式化项目任务时间
 * @param begin_time
 * @param end_time
 * @returns {string}
 */
export const showTaskTime = (begin_time, end_time) => {
    let task_time = '';
    let begin_time_format = '';
    let end_time_format = '';
    begin_time = Date.parse(new Date(begin_time)) / 1000;
    end_time = Date.parse(new Date(end_time)) / 1000;
    if (begin_time > 0) {
        let begin = format_date(begin_time, false);
        begin_time_format = begin.month + '月' + begin.day + '日' + ' - '
    }
    if (end_time > 0) {
        let end = format_date(end_time, false);
        end_time_format = end.month + '月' + end.day + '日';
        if (end.hour > 12 && end.hour <= 18) {
            end_time_format += ' 下午下班前'
        }
        if (end.hour > 18) {
            end_time_format += ' 加班'
        }
        if (end.hour <= 12 && end.hour >= 8) {
            end_time_format += ' 上午下班前'
        }
        if (end.hour < 8 && end.hour > 0) {
            end_time_format += ' 通宵'
        }
    }
    if (begin_time_format == '') {
        end_time_format += '完成'
    }
    task_time += begin_time_format + end_time_format;
    return task_time
};
/**
 *
 * @returns {string}
 * @param time
 */
export const showHelloTime = (time) => {
    let time_format = '';
    if (time == undefined) {
        time = new Date();
    }
    let hr = time.getHours();
    if ((hr >= 0) && (hr <= 4))
        time_format = "深夜了，注意身体，";
    if ((hr >= 4) && (hr < 7))
        time_format = "清晨好， ";
    if ((hr >= 7) && (hr < 12))
        time_format = "早安，";
    if ((hr >= 12) && (hr <= 13))
        time_format = "午饭时间到了，";
    if ((hr >= 13) && (hr <= 17))
        time_format = "下午好，";
    if ((hr >= 17) && (hr <= 18))
        time_format = "进入傍晚了，";
    if ((hr >= 18) && (hr <= 20))
        time_format = "吃过晚饭了吗，";
    if ((hr >= 20) && (hr <= 24))
        time_format = "在加班吗？辛苦了，";
    return time_format
};

/**
 * 格式化日期对象
 * @returns {string}
 * @param date
 * @param format
 */
export const dateFormat = (date, format) => {
    let o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(),    //day
        "h+": date.getHours(),   //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
        "S": date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

/**
 * 数字转英文字母
 * 如：1->A
 * @param num
 * @returns {string}
 */
export const convert = (num) => {
    let result = "";
    while (num) {
        result = String.fromCharCode(--num % 26 + 65) + result;
        num = Math.floor(num / 26)
    }
    return result
};
