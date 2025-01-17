
const _ = require("lodash");
const crypto = require("crypto");


let facilityList = [
    {
        "id": "5113fdba-4438-b1a6-da54-ab0a6cf2057e",
        "type": 1,
        "position": [
            117.0441534,
            36.6635452
        ],
        "status": 1,
        "picture": "/img/facility/hydrant.png",
        "model": "/model/facility/fire_hydrant/scene.gltf",
        "modelFormat": "gltf",
        "modelScale": [
            0.03,
            0.03,
            0.03
        ],
        "createTime": "2023-06-24T08:22:47.964Z",
        "updatedTime": "2023-06-24T08:22:47.964Z"
    },
    {
        "id": "5113fdba-4438-b1a6-da54-ab0a6cf2057d",
        "type": 1,
        "position": [
            117.0441534,
            36.6635452
        ],
        "status": 1,
        "picture": "/img/facility/hydrant.png",
        "model": "/model/garage/car/sport.gltf",
        "modelFormat": "gltf",
        "modelScale": [
            2,
            2,
            2
        ],
        "createTime": "2023-06-24T08:22:47.964Z",
        "updatedTime": "2023-06-24T08:22:47.964Z"
    },
    {
        "id": "2ce44770-126c-11ee-b976-47ae76eeb8fc",
        "type": 2,
        "position": [
            117.0424211,
            36.6628005
        ],
        "status": 1,
        "picture": "/img/facility/cap.png",
        "model": "/model/facility/manhole_cover_scan/scene.gltf",
        "modelFormat": "gltf",
        "modelScale": [
            0.5,
            0.5,
            0.5
        ],
        "createTime": "2023-06-24T08:22:47.964Z",
        "updatedTime": "2023-06-24T08:22:47.964Z"
    },
    {
        "id": "2ce44770-126c-11ee-b976-47ae76eeb8fd",
        "type": 4,
        "position": [
            117.0434980,
            36.6651881
        ],
        "status": 1,
        "picture": "/img/facility/trashcan.png",
        "model": "/model/facility/trash_can/scene.gltf",
        "modelFormat": "gltf",
        "modelScale": [
            6,
            6,
            6
        ],
        "createTime": "2023-06-24T08:22:47.964Z",
        "updatedTime": "2023-06-24T08:22:47.964Z"
    },
    {
        "id": "2ce44770-126c-11ee-b976-47ae76eeb8fe",
        "type": 3,
        "position": [
            117.0437609,
            36.6635380
        ],
        "status": 1,
        "picture": "/img/facility/monitor.png",
        "model": "/model/facility/security_camera/scene.gltf",
        "modelFormat": "gltf",
        "modelScale": [
            0.01,
            0.01,
            0.01
        ],
        "createTime": "2023-06-24T08:22:47.964Z",
        "updatedTime": "2023-06-24T08:22:47.964Z"
    }
]


facilityList = [_.cloneDeep(facilityList),_.cloneDeep(facilityList),_.cloneDeep(facilityList),_.cloneDeep(facilityList),_.cloneDeep(facilityList)].flat()
facilityList.forEach(
    facility => {
        const id =  crypto.randomUUID()
        facility.id = id
    }
)



const str = JSON.stringify(facilityList)

