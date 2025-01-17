let menuOptions = [
    {
        iconClass: "icon-community",
        title: "社区综治",
        children: [
            {
                iconClass: "icon-model",
                title: "模型数据",
                children: [
                    {
                        title: "倾斜摄影",
                        path: "",
                    },
                    {
                        title: "瓦片模型",
                        path: "",
                    },
                    {
                        title: "GLTF模型",
                        path: "",
                    },
                ],
            },
            {
                iconClass: "icon-text",
                title: "文本数据",
                children: [
                    {
                        title: "社交媒体文本",
                        path: "",
                    },
                    {
                        title: "政府文件",
                        path: "",
                    },
                    {
                        title: "新闻报道",
                        path: "",
                    },
                ],
            },
            {
                iconClass: "icon-image",
                title: "图像数据",
                children: [
                    {
                        title: "违规照片",
                        path: "",
                    },
                    {
                        title: "卫星图像",
                        path: "",
                    },
                    {
                        title: "社交媒体照片",
                        path: "",
                    },
                ],
            },
            //ceshiceshiceshi
            //000
            {
                iconClass: "icon-video",
                title: "视频数据",
                children: [
                    {
                        title: "监控摄像",
                        path: "",
                    },
                    {
                        title: "卫星影像",
                        path: "",
                    },
                    {
                        title: "社交媒体视频",
                        path: "",
                    },
                ],
            },
            {
                iconClass: "icon-music",
                title: "音频数据",
                children: [
                    {
                        title: "电话录音数据",
                        path: "",
                    },
                    {
                        title: "社交媒体音频数据",
                        path: "",
                    },
                    {
                        title: "城市环境声音数据",
                        path: "",
                    },
                    {
                        title: "政府会议音频数据",
                        path: "",
                    },
                ],
            },
            {
                iconClass: "icon-database",
                title: "数据库数据",
                children: [
                    {
                        title: "人口统计数据",
                        path: "",
                    },
                    {
                        title: "经济指标数据",
                        path: "",
                    },
                    {
                        title: "犯罪数据",
                        path: "",
                    },
                    {
                        title: "医疗健康数据",
                        path: "",
                    },
                    {
                        title: "交通运输数据",
                        path: "",
                    },
                    {
                        title: "教育数据",
                        path: "",
                    },
                ],
            },

            {
                iconClass: "icon-geography",
                title: "地理信息数据",
                children: [
                    {
                        title: "栅格数据",
                        path: "",
                    },
                    {
                        title: "二维矢量",
                        path: "",
                    },
                ],
            },
            {
                iconClass: "icon-line-chart",
                title: "时间序列数据",
                children: [
                    {
                        title: "经济指标时间序列数据",
                        path: "",
                    },
                    {
                        title: "气象数据",
                        path: "",
                    },
                    {
                        title: "交通流量数据",
                        path: "",
                    },
                    {
                        title: "疫情统计数据",
                        path: "",
                    },
                ],
            },
            {
                iconClass: "icon-web",
                title: "社交媒体数据",
                children: [
                    {
                        title: "用户个人资料数据",
                        path: "",
                    },
                    {
                        title: "用户社交网络数据",
                        path: "",
                    },
                    {
                        title: "用户发布内容数据",
                        path: "",
                    },
                    {
                        title: "用户行为数据",
                        path: "",
                    },
                ],
            },
            {
                iconClass: "icon-user",
                title: "人口统计数据",
                children: [
                    {
                        title: "年龄分布数据",
                        path: "",
                    },
                    {
                        title: "性别分布数据",
                        path: "",
                    },
                    {
                        title: "教育水平数据",
                        path: "",
                    },
                    {
                        title: "就业状况数据",
                        path: "",
                    },
                    {
                        title: "家庭结构数据",
                        path: "",
                    },
                ],
            },
        ],
    },
    {
        iconClass: "icon-community",
        title: "矛盾调处",
        children:[]
    },
    {
        iconClass: "icon-community",
        title: "舆情分析",
        children:[]
    },
]

menuOptions.forEach((firstMenu,index1)=>{
    firstMenu.id =`${index1+1}`
    firstMenu.children.forEach((secondMenu,index2)=>{
        secondMenu.id = `${index1+1}_${index2+1}`
        secondMenu.children.forEach((thirdMenu,index3)=>{
            thirdMenu.id = `${index1+1}_${index2+1}_${index3+1}`
        })
    })
})


console.log(menuOptions);