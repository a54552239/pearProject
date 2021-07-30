
/***
 * 随机颜色生成
 * param type为1是生成rgb三色的随机，为2则是十六进制的颜色
 */
export function randomColor(type = 1) {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  if (type == 1) {
    //rgb颜色随机
    return "rgb(" + r + "," + g + "," + b + ")";
  } else {
    //十六进制颜色随机
    return "#" + r.toString(16) + g.toString(16) + b.toString(16);
  }
}
