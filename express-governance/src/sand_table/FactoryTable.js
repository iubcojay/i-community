

const { VehicleStory } = require('./VehicleStory');
class FactoryTable {
    constructor() {
        this.interval = 3;
        this.wsList = [];
        this.vehicleStory = new VehicleStory();
        this.beginSendMessage();
        this.messageInterval = undefined
    }

    beginSendMessage() {
        this.messageInterval = setInterval(() => {
            // 发送信息
            this.sendMessage();

        }, this.interval * 1000)
    }

    endSendMessage() {
        clearInterval(this.messageInterval);
        this.messageInterval = undefined;
    }


    sendMessage() {
        const message = this.getMessage();
        // 遍历连接池发送信息
        this.wsList.forEach(ws => {
            ws.send(JSON.stringify(message));
        })
    }

    getMessage() {
        const message = {}
        message.timeStamp = new Date().getTime();
        message.vehicle = this.getVehicleMessage();
        return message;
    }

    getVehicleMessage() {
        return this.vehicleStory.getMessage();
    }


    addWs(ws) {
        this.wsList.push(ws);
    }

    removeWs(ws) {
        let index = this.wsList.findIndex(item => item === ws);
        index !== -1 && this.wsList.splice(index, 1);
    }

    stopVehicle(vehicleId) {
        this.vehicleStory.stopVehicle(vehicleId);
    }

    activeVehicle(vehicleId) {
        this.vehicleStory.activeVehicle(vehicleId);
    }

    brokeVehicle(vehicleId) {
        this.vehicleStory.brokeVehicle(vehicleId);
    }
}



module.exports = { FactoryTable };