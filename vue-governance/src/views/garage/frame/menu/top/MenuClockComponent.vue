<template>
    <div class="dateBox">
        <div class="time_panel">{{ time }}</div>
        <div class="date_panel">
            <span>{{ weekDay }}</span>
            <span>{{ date }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "MenuClockComponent",
    data() {
        return {
            date: null,
            time: null,
            weekDay: null,
            clockIntervalId: null,
            
        }
    },
    methods: {
        // 日期时间格式化——获取当前日期时间，格式化为 2021/08/30 和 15:35:06
        formatDate(currentDate) {
            let on1 = '/'
            let on2 = ':'
            let onY = currentDate.getFullYear() // 年
            let onM = currentDate.getMonth() + 1 // 月
            let onD = currentDate.getDate() // 日
            let onS = currentDate.getHours() // 时
            let onF = currentDate.getMinutes() // 分
            let onN = currentDate.getSeconds() // 秒

            if (onM >= 1 && onM <= 9) {
                // 月
                onM = '0' + onM
            }
            if (onD >= 1 && onD <= 9) {
                // 日
                onD = '0' + onD
            }
            if (onS >= 0 && onS <= 9) {
                // 时
                onS = '0' + onS
            }
            if (onF >= 0 && onF <= 9) {
                // 分
                onF = '0' + onF
            }
            if (onN >= 0 && onN <= 9) {
                // 秒
                onN = '0' + onN
            }

            const weekDay = currentDate.getDay()
            switch (weekDay) {
                case 0:
                    this.weekDay = "星期天"
                    break
                case 1:
                    this.weekDay = "星期一"
                    break
                case 2:
                    this.weekDay = "星期二"
                    break
                case 3:
                    this.weekDay = "星期三"
                    break
                case 4:
                    this.weekDay = "星期四"
                    break
                case 5:
                    this.weekDay = "星期五"
                    break
                case 6:
                    this.weekDay = "星期六"
                    break


            }

            return {
                date: onY + on1 + onM + on1 + onD,
                time: onS + on2 + onF + on2 + onN
            }
        },


    },
    mounted() {
        const currentDate = new Date()
        // currentDate.setHours(2)
        // currentDate.setMinutes(0)
        // currentDate.setSeconds(0)
        this.clockIntervalId = setInterval(() => {
            this.date = this.formatDate(currentDate).date
            this.time = this.formatDate(currentDate).time
            currentDate.setTime(currentDate.getTime() + 1000)
        }, 1000)
    },

    beforeDestroy() {
        this.clockIntervalId && clearInterval(this.clockIntervalId)
    },

}
</script>

<style lang="less" scoped>
.dateBox {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: white;
    padding-left: 20px;

    .time_panel {
        font-size: 35px;
        font-weight: 700;
        text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
    }

    .date_panel {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 10px;
        font-weight: 700;

    }

}
</style>    