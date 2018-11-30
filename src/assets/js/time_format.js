/**
 * Created by vilson on 17/6/4.
 */
import moment from 'moment'
export const showBeforeTime = (time,format) => {
  if(format === undefined) {
    return moment(time,'YYYYMMDDHHmm').locale('zh-cn').fromNow()
  }else{
    return moment(time).locale('zh-cn').format("YYYY年MMMDo HH:mm");
  }
}
