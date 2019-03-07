<template>
    <div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {getStore, setStore} from '@/assets/js/storage'
    import {bindClientId} from "../../api/common";
    import config from "../../config/config";


    export default {
        data() {
            return {
                websocket: null,
            }
        },
        methods: {
            threadPoxi() {  // 实际调用的方法
                //参数
                const agentData = {uid: this.$store.state.userInfo.id};
                //若是ws开启状态
                if (this.websocket.readyState === this.websocket.OPEN) {
                    this.websocketSend(agentData)
                }
                // 若是 正在开启状态，则等待300毫秒
                else if (this.websocket.readyState === this.websocket.CONNECTING) {
                    let that = this;//保存当前对象this
                    setTimeout(function () {
                        that.websocketSend(agentData)
                    }, 300);
                }
                // 若未开启 ，则等待500毫秒
                else {
                    this.initWebSocket();
                    let that = this;//保存当前对象this
                    setTimeout(function () {
                        that.websocketSend(agentData)
                    }, 500);
                }
            },
            initWebSocket() { //初始化weosocket
                //ws地址
                const WS_URI = config.WS_URI;
                this.websocket = new WebSocket(WS_URI);
                this.websocket.onmessage = this.websocketOnMessage;
                this.websocket.onclose = this.websocketClose;
                Vue.prototype.$websocket = this.websocket;

            },
            websocketOnMessage(e) { //数据接收
                const data = JSON.parse(e.data);
                if (data.action != 'ping') {
                    console.log(data);
                    this.$store.commit('catchSocketAction', data);
                }
                if (data.action === 'connect') {
                    if (data.data.client_id) {
                        if (!this.$store.state.boundClient) {
                            setStore('client_id', data.data.client_id);
                            const userInfo = getStore('userInfo', true);
                            const uid = userInfo ? userInfo.code : '';
                            if (uid) {
                                bindClientId(data.data.client_id, uid);
                                this.$store.dispatch('setBoundClient', true);
                            }
                        }
                    }
                }
            },
            websocketSend(agentData) {//数据发送
                console.log("发送消息：");
                console.log(agentData);
                this.websocket.send(agentData);
            },
            websocketClose(e) {  //关闭
                console.log("connection closed (" + e.code + ")");
            }
        },
        created() {
            this.initWebSocket()
        }
    }
</script>
