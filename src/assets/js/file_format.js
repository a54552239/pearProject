/**
 * Created by vilson on 17/6/4.
 */
export const format = (file_ext) => {
        const format = file_ext || '';
        let type = '#icon-file';

        if (['gif','jpg','jpeg','png','bmp','webp'].indexOf(format) > -1) {
            type = '#icon-img';
        }
        if (['mp4','m3u8','rmvb','avi','swf','3gp','mkv','flv'].indexOf(format) > -1) {
            type = '#icon-file_video';
        }
        if (['mp3','wav','wma','ogg','aac','flac'].indexOf(format) > -1) {
            type = '#icon-MP';
        }
        if (['js'].indexOf(format) > -1) {
            type = '#icon-js';
        }
        if (['css'].indexOf(format) > -1) {
            type = '#icon-file_css';
        }
        if (['txt'].indexOf(format) > -1) {
            type = '#icon-txt';
        }
        if (['pdf'].indexOf(format) > -1) {
            type = '#icon-pdf';
        }
        if (['zip'].indexOf(format) > -1) {
            type = '#icon-zip';
        }
        if (['rar'].indexOf(format) > -1) {
            type = '#icon-rar';
        }
        if (['doc','docx','wps'].indexOf(format) > -1) {
            type = '#icon-word';
        }
        if (['pages','epub'].indexOf(format) > -1) {
            type = '#icon-file';
        }
        if (['numbers','xls','xlsx'].indexOf(format) > -1) {
            type = '#icon-excel';
        }
        if (['csv'].indexOf(format) > -1) {
            type = '#icon-file_csv';
        }
        if (['keynote','ppt','pptx'].indexOf(format) > -1) {
            type = '#icon-file_ppt';
        }

        return type;
}
