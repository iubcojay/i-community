
const { LifterFaultStory } = require("./story/LifterFaultStory")
// const { NightStory } = require("./story/NightStory")
const { getBaseInfo, LIFTER_TYPE } = require("./utils")
const { RegularStory } = require("./story/RegularStory");


const { lifterList, lightList, areaData } = getBaseInfo()

class GarageTable {
    constructor() {
        this.interval = 1;
        this.wsList = [];
        // this.beginSendMessage();
        this.messageInterval = undefined
        this.lifterList = lifterList;
        this.lightList = lightList;
        this.storynum = 1
        this.LifterFaultStory = new LifterFaultStory(this);
        this.RegularStory = new RegularStory(this);
        // console.log(this.lifterList)
    }

    beginSendMessage() {

        // if(this.storynum === 1)
        //     this.updateLifter()
        if(this.storynum === 2 ){
            this.LifterFaultStory.resetStory(1)
            this.updateLifter_fault()
        }
        //
        // this.LifterFaultStory = new LifterFaultStory(this);
        // this.RegularStory = new RegularStory(this);

        this.messageInterval = setInterval(() => {
            // 发送信息
            this.sendMessage();

        }, this.interval * 1000)
    }

    updateLifter_fault() {
        this.LifterFaultStory.lifterList.forEach(lifter => {
            this.changeLifterStatus(1, 1)
            this.downLifter(1)
            if (lifter.status === LIFTER_TYPE.LIFTER_STATUS_AUTO) {
                this.downLifter(lifter.id)
            }

        })
    }
    updateLifter(){
        this.RegularStory.lifterList.forEach(lifter => {
            this.changeLifterStatus(lifter.id , 0)
            if (lifter.status === LIFTER_TYPE.LIFTER_STATUS_AUTO) {
                this.downLifter(lifter.id)
            }

        })
    }

    stopSendMessage() {
        clearInterval(this.messageInterval); // 清除定时器，停止发送消息
        console.log('发送消息已停止');
    }

    endSendMessage() {
        clearInterval(this.messageInterval);
        this.messageInterval = undefined;
    }



    sendMessage() {
        const message = this.getMessage(this.storynum);
        // 遍历连接池发送信息
        this.wsList.forEach(ws => {
            ws.send(JSON.stringify(message));
        })
    }
    // set_a(value){
    //     this.a
    // }
    getMessage(a) {
        if(a === 1){
            // console.log("进入regular")
            return { tag: "garage_status", data: this.RegularStory.getMessage() }}
        else if (a === 2) {
            // console.log("进入Night")
            return { tag: "garage_status", data: this.LifterFaultStory.getMessage()}}
        // return { tag: "garage_status", data: this.nightStory.getMessage() }
    }


    addWs(ws) {
        this.wsList.push(ws);
    }

    removeWs(ws) {
        let index = this.wsList.findIndex(item => item === ws);
        index !== -1 && this.wsList.splice(index, 1);
    }

    upLifter(id) {
        id = parseInt(id)
        const lifter = this.lifterList.find(lifter => lifter.id === id && lifter.status !== LIFTER_TYPE.LIFTER_STATUS_ANOMALY)
        if (lifter) {
            lifter.isRaised = true;
        }
    }

    downLifter(id) {
        id = parseInt(id)
        const lifter = this.lifterList.find(lifter => lifter.id === id && lifter.status !== LIFTER_TYPE.LIFTER_STATUS_ANOMALY)
        if (lifter) {
            lifter.isRaised = false;
        }
    }

    changeLifterStatus(id, status) {
        const lifter = this.lifterList.find(lifter => lifter.id === id && lifter.status !== LIFTER_TYPE.LIFTER_STATUS_ANOMALY)
        if (lifter) {
            lifter.status = status;
        }
    }



}



module.exports = { GarageTable };