onmessage = (event) => {
    const data = event.data;
    if (data.message === "start") {
        const roadEntityIdList = data.roadEntityIdList;

        self.myEarth.viewer.entities.forEach((entity) => {
            if (entity.id in roadEntityIdList) {
                self.myEarth.viewer.entities.remove(entity.id)
            }
        });
    }


    // 将结果发送回主线程
    postMessage({ message: "finish" });
};