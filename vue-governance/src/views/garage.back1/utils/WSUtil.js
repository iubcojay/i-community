export async function createWs(url) {
    return new Promise((resolve, reject) => {
        if ('WebSocket' in window) {
            const ws = new WebSocket(url)

            // ws.onclose = (event) => {  //readyState  0：连接尚未建立 1：websocket链接已建立 2、连接正在关闭 3、已经关闭或者不可用
            //     console.log('== websocket close ==', event)
            //     // ws.close()
            // }

            ws.onopen = () => {
                resolve(ws)
            }
        } else {
            reject('Current browser Not support websocket')
        }
    })
}
