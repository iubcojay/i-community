export default class WSUtil {
    constructor(url) {
        this.wsUrl = url //接口地址
        this.ws = null // webscoket实例
        this.lockReconnect = false // 避免重复重连
        this.reconnectTimes = 0 // 重连次数  

    }

    // webSocket 打开
    async create() {
        return new Promise((resolve, reject) => {
            if (this.lockReconnect) return;
            this.lockReconnect = true;
            if ('WebSocket' in window) {
                this.ws = new WebSocket(this.wsUrl)
                this.ws.onerror = this.error
                this.ws.onclose = this.close
                this.ws.onopen = () => {
                    resolve(this.ws)
                }
            } else {
                reject('Current browser Not support websocket')
            }
        })

    }

    // websocket 发生错误
    error(err) {
        console.log('== websocket error ==', err)
        // 发生错误重连socket
        if (this.reconnectTimes < 10) {
            this.reconnect()
        }
    }

    // websocket 关闭连接
    close(event) {  //readyState  0：连接尚未建立 1：websocket链接已建立 2、连接正在关闭 3、已经关闭或者不可用
        console.log('== websocket close ==', event)
        if (this.ws && this.ws.readyState === 1) {
            this.ws.close()
        }
        this.lockReconnect = false
        if (this.reconnectTimes < 3) { // 设置重连次数为10次
            this.reconnect()
        }
    }

    reconnect() {
        console.log('Reconnection Socket', this.reconnectTimes)
        if (this.lockReconnect) return
        this.reconnectTimes++
        this.lockReconnect = true
        setTimeout(function () { // 没连接上会一直重连，设置延迟避免请求过多
            this.create()
            this.lockReconnect = true
        }, 6000)
    }

}