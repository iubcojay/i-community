// 这是一个脚本，用来演示车库各种场景，故事可能会修改车库起落杆状态

const uuid = require('uuid')
const _ = require('lodash');
import Car from '@/assets/js/threejs/Car'
import Garage from '@/assets/js/threejs/Garage'

const pathCollection = [
    // 南门进，北门出
    {
        enter: [
            {
                x: 50.514,
                y: 1.5,
                z: -38.009,
                isForwarded: true,

            },
            {
                x: 36.762,
                y: 1.2,
                z: -38.009,

                isForwarded: true,

            },
            {
                x: 18.82,
                y: 1.2,
                z: -38.009,

                isForwarded: true,

            },
            {
                x: 12.763,
                y: 0.8,
                z: -36.417,

                isForwarded: true,

            },
            {
                x: 10.177,
                y: 0.8,
                z: -35.608,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.8,
                z: -33.556,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -30.15,
                isForwarded: true,
            },
            {
                x: 8.06,
                y: 0.1,
                z: -26.483,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -23.08,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -13.755,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -11.727,

                isForwarded: true,

            },
            {
                x: 9.014,
                y: 0.1,
                z: -6.312,

                isForwarded: true,

            },
            {
                x: 7.129,
                y: 0.1,
                z: -4.078,

                isForwarded: true,

            },
            {
                x: 0.875,
                y: 0.1,
                z: -5.164,

                isForwarded: true,

            },
            {
                x: -3.465,
                y: 0.1,
                z: -5.164,

                isForwarded: true,

            },
            {
                x: -0.834,
                y: 0.1,
                z: -5.164,

                isForwarded: false,

            },
            {
                x: 0.268,
                y: 0.1,
                z: -5.632,

                isForwarded: false,

            },
            {
                x: 1.547,
                y: 0.1,
                z: -6.314,

                isForwarded: false,

            },
            {
                x: 2.977,
                y: 0.1,
                z: -7.115,

                isForwarded: false,

            },
            {
                x: 3.789,
                y: 0.1,
                z: -7.729,

                isForwarded: false,

            },
            {
                x: 3.789,
                y: 0.1,
                z: -8.415,

                isForwarded: false,

            },
            {
                x: 3.789,
                y: 0.1,
                z: -8.849,

                isForwarded: false,

            }
        ],
        leave: [
            {
                x: 3.789,
                y: 0.1,
                z: -8.849,

                isForwarded: true,

            },
            {
                x: 3.736,
                y: 0.1,
                z: -7.806,

                isForwarded: true,

            },
            {
                x: 3.736,
                y: 0.1,
                z: -6.13,

                isForwarded: true,

            },
            {
                x: 2.867,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -1.346,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -5.911,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -11.685,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -18.493,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -23.168,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -27.103,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -31.666,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -35.103,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -38.69,
                y: 0.1,
                z: -4.972,

                isForwarded: true,

            },
            {
                x: -39.927,
                y: 0.1,
                z: -2.186,

                isForwarded: true,

            },
            {
                x: -41.358,
                y: 0.1,
                z: 0.224,

                isForwarded: true,

            },
            {
                x: -41.95,
                y: 0.1,
                z: 3.484,

                isForwarded: true,

            },
            {
                x: -41.95,
                y: 0.1,
                z: 10.481,

                isForwarded: true,

            },
            {
                x: -41.95,
                y: 0.1,
                z: 16.786,

                isForwarded: true,

            },
            {
                x: -41.95,
                y: 0.1,
                z: 23.036,

                isForwarded: true,

            },
            {
                x: -40.439,
                y: 0.1,
                z: 27.198,

                isForwarded: true,

            },
            {
                x: -39.206,
                y: 0.1,
                z: 29.849,

                isForwarded: true,

            },
            {
                x: -39.186,
                y: 0.1,
                z: 35.889,

                isForwarded: true,

            },
            {
                x: -39.186,
                y: 0.5,
                z: 42.444,

                isForwarded: true,

            },
            {
                x: -40.756,
                y: 0.8,
                z: 45.844,

                isForwarded: true,

            },
            {
                x: -47.038,
                y: 0.8,
                z: 45.844,

                isForwarded: true,

            },
            {
                x: -53.364,
                y: 0.8,
                z: 45.844,

                isForwarded: true,

            },
            {
                x: -60.479,
                y: 1.2,
                z: 45.844,

                isForwarded: true,

            },
            {
                x: -69.045,
                y: 1.2,
                z: 45.844,

                isForwarded: true,

            },
            {
                x: -76.536,
                y: 1.5,
                z: 45.844,

                isForwarded: true,

            }
        ],
    },

    // 北门进，南门出
    {
        enter: [
            {
                x: -77.765,
                y: 1.5,
                z: 50.392,

                isForwarded: true,

            },
            {
                x: -69.685,
                y: 1.5,
                z: 50.392,

                isForwarded: true,

            },
            {
                x: -63.087,
                y: 1.2,
                z: 50.392,

                isForwarded: true,

            },
            {
                x: -56.746,
                y: 1.2,
                z: 50.392,

                isForwarded: true,

            },
            {
                x: -48.014,
                y: 1.2,
                z: 50.392,

                isForwarded: true,

            },
            {
                x: -43.593,
                y: 1.2,
                z: 50.392,

                isForwarded: true,

            },
            {
                x: -40.34,
                y: 1.2,
                z: 48.084,

                isForwarded: true,

            },
            {
                x: -36.925,
                y: 0.8,
                z: 46.662,

                isForwarded: true,

            },
            {
                x: -35.155,
                y: 0.8,
                z: 44.497,

                isForwarded: true,

            },
            {
                x: -34.724,
                y: 0.8,
                z: 42.005,

                isForwarded: true,

            },
            {
                x: -36.459,
                y: 0.1,
                z: 30.903,

                isForwarded: true,

            },
            {
                x: -38.404,
                y: 0.1,
                z: 28.401,

                isForwarded: true,

            },
            {
                x: -38.404,
                y: 0.1,
                z: 21.261,

                isForwarded: true,

            },
            {
                x: -38.404,
                y: 0.1,
                z: 14.927,

                isForwarded: true,

            },
            {
                x: -38.404,
                y: 0.1,
                z: 9.083,

                isForwarded: true,

            },
            {
                x: -38.404,
                y: 0.1,
                z: 7.083,

                isForwarded: true,

            },
            {
                x: -38.404,
                y: 0.1,
                z: 5.083,

                isForwarded: true,

            },
            {
                x: -38.404,
                y: 0.1,
                z: 7.083,

                isForwarded: false,

            },
            {
                x: -38.404,
                y: 0.1,
                z: 9.083,

                isForwarded: false,

            },
            {
                x: -39.644,
                y: 0.1,
                z: 11.363,

                isForwarded: false,

            },
            {
                x: -40.71,
                y: 0.1,
                z: 13.017,

                isForwarded: false,

            },
            {
                x: -41.729,
                y: 0.1,
                z: 14.459,

                isForwarded: false,

            },
            {
                x: -43.178,
                y: 0.1,
                z: 15.58,

                isForwarded: false,

            },
            {
                x: -44.664,
                y: 0.1,
                z: 15.865,

                isForwarded: false,

            },
            {
                x: -45.757,
                y: 0.1,
                z: 15.865,
                isForwarded: false,

            }
        ],
        leave: [
            {
                x: -45.757,
                y: 0.1,
                z: 15.865,
                isForwarded: true,

            },
            {
                x: -43.96,
                y: 0.1,
                z: 15.865,

                isForwarded: true,

            },
            {
                x: -42.344,
                y: 0.1,
                z: 15.865,

                isForwarded: true,

            },
            {
                x: -40.135,
                y: 0.1,
                z: 14.388,

                isForwarded: true,

            },
            {
                x: -38.476,
                y: 0.1,
                z: 12.504,

                isForwarded: true,

            },
            {
                x: -38.28,
                y: 0.1,
                z: 8.944,

                isForwarded: true,

            },
            {
                x: -38.28,
                y: 0.1,
                z: 2.681,

                isForwarded: true,

            },
            {
                x: -38.28,
                y: 0.1,
                z: -3.405,

                isForwarded: true,

            },
            {
                x: -38.28,
                y: 0.1,
                z: -10.254,

                isForwarded: true,

            },
            {
                x: -38.28,
                y: 0.1,
                z: -15.943,

                isForwarded: true,

            },
            {
                x: -37.786,
                y: 0.1,
                z: -18.605,

                isForwarded: true,

            },
            {
                x: -36.622,
                y: 0.1,
                z: -19.163,

                isForwarded: true,

            },
            {
                x: -33.404,
                y: 0.1,
                z: -18.37,

                isForwarded: true,

            },
            {
                x: -27.353,
                y: 0.1,
                z: -18.37,

                isForwarded: true,

            },
            {
                x: -20.242,
                y: 0.1,
                z: -18.37,

                isForwarded: true,

            },
            {
                x: -13.188,
                y: 0.1,
                z: -18.37,

                isForwarded: true,

            },
            {
                x: -4.988,
                y: 0.1,
                z: -18.37,

                isForwarded: true,

            },
            {
                x: 1.703,
                y: 0.1,
                z: -18.37,

                isForwarded: true,

            },
            {
                x: 7.125,
                y: 0.1,
                z: -18.37,

                isForwarded: true,

            },
            {
                x: 9.434,
                y: 0.1,
                z: -19.782,

                isForwarded: true,

            },
            {
                x: 11.025,
                y: 0.1,
                z: -21.004,

                isForwarded: true,

            },
            {
                x: 11.943,
                y: 0.1,
                z: -22.933,

                isForwarded: true,

            },
            {
                x: 11.943,
                y: 0.1,
                z: -28.344,

                isForwarded: true,

            },
            {
                x: 13.102,
                y: 0.5,
                z: -32.5,

                isForwarded: true,

            },
            {
                x: 14.723,
                y: 0.8,
                z: -33.506,

                isForwarded: true,

            },
            {
                x: 20.626,
                y: 0.8,
                z: -33.506,

                isForwarded: true,

            },
            {
                x: 28.143,
                y: 1.2,
                z: -33.506,

                isForwarded: true,

            },
            {
                x: 34.991,
                y: 1.2,
                z: -33.506,

                isForwarded: true,

            },
            {
                x: 41.915,
                y: 1.2,
                z: -33.506,

                isForwarded: true,

            },
            {
                x: 47.887,
                y: 1.5,
                z: -33.506,

                isForwarded: true,

            },
            {
                x: 51.98,
                y: 1.5,
                z: -33.506,

                isForwarded: true,

            }
        ],
    },

    // 南门进，北门出
    {
        enter: [
            {
                x: 50.514,
                y: 1.5,
                z: -38.009,

                isForwarded: true,

            },
            {
                x: 36.762,
                y: 1.2,
                z: -38.009,

                isForwarded: true,

            },
            {
                x: 18.82,
                y: 1.2,
                z: -38.009,

                isForwarded: true,

            },
            {
                x: 12.763,
                y: 0.8,
                z: -36.417,

                isForwarded: true,

            },
            {
                x: 10.177,
                y: 0.8,
                z: -35.608,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.8,
                z: -33.556,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -30.15,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -26.483,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -23.08,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -13.755,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -11.727,

                isForwarded: true,

            },
            {
                x: 8.06,
                y: 0.1,
                z: -8.004,

                isForwarded: true,

            },
            {
                x: 10.322,
                y: 0.1,
                z: -3.894,

                isForwarded: true,

            },
            {
                x: 14.628,
                y: 0.1,
                z: -2.052,

                isForwarded: true,

            },
            {
                x: 19.034,
                y: 0.1,
                z: -2.052,

                isForwarded: true,

            },
            {
                x: 23.609,
                y: 0.1,
                z: -2.052,

                isForwarded: true,

            },
            {
                x: 25.909,
                y: 0.1,
                z: 0.369,

                isForwarded: true,

            },
            {
                x: 24.342,
                y: 0.1,
                z: 3.307,

                isForwarded: true,

            },
            {
                x: 24.342,
                y: 0.1,
                z: 7.741,

                isForwarded: true,

            },
            {
                x: 24.342,
                y: 0.1,
                z: 11.094,

                isForwarded: true,

            },
            {
                x: 22.349,
                y: 0.1,
                z: 12.883,

                isForwarded: true,

            },
            {
                x: 18.344,
                y: 0.1,
                z: 11.482,

                isForwarded: true,

            },
            {
                x: 13.174,
                y: 0.1,
                z: 11.462,

                isForwarded: true,

            },
            {
                x: 6.847,
                y: 0.1,
                z: 11.462,

                isForwarded: true,

            },
            {
                x: 2.607,
                y: 0.1,
                z: 11.462,

                isForwarded: true,

            },
            {
                x: -5.259,
                y: 0.1,
                z: 11.462,

                isForwarded: true,

            },
            {
                x: -11.734,
                y: 0.1,
                z: 11.462,

                isForwarded: true,

            },
            {
                x: -18.498,
                y: 0.1,
                z: 11.462,

                isForwarded: true,

            },
            {
                x: -24.774,
                y: 0.1,
                z: 11.462,

                isForwarded: true,

            },
            {
                x: -28.414,
                y: 0.1,
                z: 11.462,

                isForwarded: true,

            },
            {
                x: -26.586,
                y: 0.1,
                z: 11.462,

                isForwarded: false,

            },
            {
                x: -25.249,
                y: 0.1,
                z: 11,

                isForwarded: false,

            },
            {
                x: -24.169,
                y: 0.1,
                z: 10.5,

                isForwarded: false,

            },
            {
                x: -23.215,
                y: 0.1,
                z: 9.5,

                isForwarded: false,

            },
            {
                x: -22.119,
                y: 0.1,
                z: 9,

                isForwarded: false,

            },
            {
                x: -21.535,
                y: 0.1,
                z: 8.5,

                isForwarded: false,

            },
            {
                x: -21.535,
                y: 0.1,
                z: 7.961,

                isForwarded: false,

            },
            {
                x: -21.535,
                y: 0.1,
                z: 7.779,

                isForwarded: false,

            }
        ],
        leave: [
            {
                x: -21.535,
                y: 0.1,
                z: 7.779,

                isForwarded: true,

            },
            {
                x: -22.295,
                y: 0.1,
                z: 10.475,

                isForwarded: true,

            },
            {
                x: -24.659,
                y: 0.1,
                z: 11.383,

                isForwarded: true,

            },
            {
                x: -29.77,
                y: 0.1,
                z: 11.383,

                isForwarded: true,

            },
            {
                x: -35.454,
                y: 0.1,
                z: 11.383,

                isForwarded: true,

            },
            {
                x: -39.603,
                y: 0.1,
                z: 13.062,

                isForwarded: true,

            },
            {
                x: -41.144,
                y: 0.1,
                z: 16.718,

                isForwarded: true,

            },
            {
                x: -41.144,
                y: 0.1,
                z: 23.92,

                isForwarded: true,

            },
            {
                x: -40.164,
                y: 0.1,
                z: 29.743,

                isForwarded: true,

            },
            {
                x: -39.043,
                y: 0.1,
                z: 34.163,

                isForwarded: true,

            },
            {
                x: -39.043,
                y: 0.5,
                z: 41.087,

                isForwarded: true,

            },
            {
                x: -40.465,
                y: 0.5,
                z: 44.968,

                isForwarded: true,

            },
            {
                x: -46.824,
                y: 0.8,
                z: 45.46,

                isForwarded: true,

            },
            {
                x: -56.261,
                y: 1.2,
                z: 45.46,

                isForwarded: true,

            },
            {
                x: -64.844,
                y: 1.2,
                z: 45.46,

                isForwarded: true,

            },
            {
                x: -72.903,
                y: 1.5,
                z: 45.46,

                isForwarded: true,

            },
            {
                x: -79.043,
                y: 1.5,
                z: 45.46,
                isForwarded: true,
            }
        ],
    },

    // 南门进(单项)
    {
        enter: [
            { x: 50.514, y: 1.5, z: -38.009, isForwarded: true },
            { x: 36.762, y: 1.2, z: -38.009, isForwarded: true },
            { x: 18.820, y: 1.2, z: -38.009, isForwarded: true },
            { x: 12.763, y: 0.8, z: -36.417, isForwarded: true },
            { x: 10.177, y: 0.8, z: -35.608, isForwarded: true },
            { x: 8.060, y: 0.8, z: -33.556, isForwarded: true },
            { x: 8.060, y: 0.1, z: -30.150, isForwarded: true },
            { x: 8.060, y: 0.1, z: -26.483, isForwarded: true },
            { x: 8.060, y: 0.1, z: -23.080, isForwarded: true },
            { x: 8.060, y: 0.1, z: -13.755, isForwarded: true },
            { x: 8.060, y: 0.1, z: -11.727, isForwarded: true },
            { x: 8.060, y: 0.1, z: -8.004, isForwarded: true },
            { x: 8.060, y: 0.1, z: -5.932, isForwarded: true },
            { x: 8.060, y: 0.1, z: -5.164, isForwarded: true },
            { x: 0.875, y: 0.1, z: -5.164, isForwarded: true },
            { x: -3.465, y: 0.1, z: -5.164, isForwarded: true },
            { x: -12.168, y: 0.1, z: -5.164, isForwarded: true },
            { x: -28.559, y: 0.1, z: -5.164, isForwarded: true },
            { x: -30.559, y: 0.1, z: -5.164, isForwarded: false },

            { x: -28.559, y: 0.1, z: -5.164, isForwarded: false },
            { x: -26.380, y: 0.1, z: -4.565, isForwarded: false },
            { x: -24.996, y: 0.1, z: -3.716, isForwarded: false },
            { x: -23.515, y: 0.1, z: -2.983, isForwarded: false },
            { x: -22.329, y: 0.1, z: -2.043, isForwarded: false },
            { x: -21.597, y: 0.1, z: -0.667, isForwarded: false },
            { x: -21.264, y: 0.1, z: 0.615, isForwarded: false },
            { x: -21.264, y: 0.1, z: 1.769, isForwarded: false },

        ]
    },

    // 北门进(单项)
    {
        enter: [
            { x: -77.765, y: 1.5, z: 50.392, isForwarded: true },
            { x: -69.685, y: 1.5, z: 50.392, isForwarded: true },
            { x: -63.087, y: 1.2, z: 50.392, isForwarded: true },
            { x: -56.746, y: 1.2, z: 50.392, isForwarded: true },
            { x: -48.014, y: 1.2, z: 50.392, isForwarded: true },
            { x: -43.593, y: 1.2, z: 50.392, isForwarded: true },
            { x: -40.340, y: 1.2, z: 48.084, isForwarded: true },
            { x: -36.925, y: 0.8, z: 46.662, isForwarded: true },
            { x: -35.155, y: 0.8, z: 44.497, isForwarded: true },
            { x: -34.724, y: 0.8, z: 42.005, isForwarded: true },
            { x: -36.459, y: 0.1, z: 30.903, isForwarded: true },
            { x: -38.404, y: 0.1, z: 28.401, isForwarded: true },
            { x: -38.404, y: 0.1, z: 21.261, isForwarded: true },
            { x: -38.404, y: 0.1, z: 14.927, isForwarded: true },
            { x: -38.404, y: 0.1, z: 9.083, isForwarded: true },
            { x: -38.404, y: 0.1, z: 7.083, isForwarded: true },
            { x: -38.404, y: 0.1, z: 5.083, isForwarded: true },
            { x: -38.404, y: 0.1, z: -3.388, isForwarded: true },
            { x: -38.404, y: 0.1, z: -12.022, isForwarded: true },
            { x: -38.404, y: 0.1, z: -16.518, isForwarded: true },
            { x: -36.439, y: 0.1, z: -18.323, isForwarded: true },
            { x: -32.902, y: 0.1, z: -18.263, isForwarded: false },
            { x: -34.973, y: 0.1, z: -18.263, isForwarded: false },
            { x: -37.490, y: 0.1, z: -18.263, isForwarded: false },
            { x: -39.082, y: 0.1, z: -19.300, isForwarded: false },
            { x: -40.594, y: 0.1, z: -20.583, isForwarded: false },
            { x: -42.067, y: 0.1, z: -22.008, isForwarded: false },
            { x: -42.629, y: 0.1, z: -22.971, isForwarded: false },
            { x: -42.883, y: 0.1, z: -24.047, isForwarded: false },
            { x: -42.883, y: 0.1, z: -25.067, isForwarded: false },
        ]
    },


]

const carTypeList = ['sedan', 'sport', 'suv', 'van', 'pickUp']
const carColorData = {
    'sedan': ['rgb(132, 137, 131)', 'rgb(2, 33, 210)', 'rgb(205, 217, 223)', 'rgb(193, 0, 1)', 'rgb(0, 0, 0)', 'rgb(3, 82, 148)', 'rgb(208, 177, 2)', 'rgb(19, 68, 29)'],
    'sport': ['rgb(132, 137, 131)', 'rgb(2, 33, 210)', 'rgb(205, 217, 223)', 'rgb(193, 0, 1)', 'rgb(0, 0, 0)', 'rgb(3, 82, 148)', 'rgb(208, 177, 2)', 'rgb(19, 68, 29)'],
    'suv': ['rgb(132, 137, 131)', 'rgb(2, 33, 210)', 'rgb(205, 217, 223)', 'rgb(193, 0, 1)', 'rgb(0, 0, 0)', 'rgb(3, 82, 148)', 'rgb(208, 177, 2)', 'rgb(19, 68, 29)'],
    'van': ['rgb(132, 137, 131)', 'rgb(205, 217, 223)', 'rgb(0, 0, 0)'],
    'pickUp': ['rgb(132, 137, 131)', 'rgb(205, 217, 223)', 'rgb(193, 0, 1)', 'rgb(0, 0, 0)', 'rgb(208, 177, 2)', 'rgb(19, 68, 29)'],

}

const fixedCarInfoList = [
    {
        id: uuid.v1(),
        type: 'sedan',
        license: generateCarLicenseTag(),
        color: _.sample(carColorData['sedan']),
        enterPathInfoList: _.cloneDeep(pathCollection[3].enter),
        leavePathInfoList: [],
        parkingStatus: Car.PARKING_STATUS_STOP,
        alarmType: Car.ALARM_TYPE_NONE,
        parkingSpaceNumber: "B013"

    },
    {
        id: uuid.v1(),
        type: 'sport',
        license: generateCarLicenseTag(),
        color: _.sample(carColorData['sport']),
        enterPathInfoList: _.cloneDeep(pathCollection[4].enter),
        leavePathInfoList: [],
        parkingStatus: Car.PARKING_STATUS_STOP,
        alarmType: Car.ALARM_TYPE_NONE,
        parkingSpaceNumber: "A016"
    },
    {
        id: uuid.v1(),
        type: 'sport',
        license: generateCarLicenseTag(),
        color: _.sample(carColorData['sport']),
        enterPathInfoList: [
            { x: 3.85, y: 0.1, z: 0.862, isForwarded: false },
            { x: 3.85, y: 0.1, z: 1.696, isForwarded: false },
        ],
        leavePathInfoList: [],
        parkingStatus: Car.PARKING_STATUS_STOP,
        alarmType: Car.ALARM_TYPE_NONE,
        parkingSpaceNumber: "A036"
    },
    {
        id: uuid.v1(),
        type: 'suv',
        license: generateCarLicenseTag(),
        color: _.sample(carColorData['suv']),
        enterPathInfoList: [
            { x: 1.464, y: 0.1, z: 8.736, isForwarded: false },
            { x: 1.464, y: 0.1, z: 7.593, isForwarded: false },
        ],
        leavePathInfoList: [],
        parkingStatus: Car.PARKING_STATUS_STOP,
        alarmType: Car.ALARM_TYPE_NONE,
        parkingSpaceNumber: "A042"
    },
    {
        id: uuid.v1(),
        type: 'pickUp',
        license: generateCarLicenseTag(),
        color: _.sample(carColorData['pickUp']),
        enterPathInfoList: [
            { x: 18.383, y: 0.1, z: -7.640, isForwarded: false },
            { x: 18.383, y: 0.1, z: -8.633, isForwarded: false },
        ],
        leavePathInfoList: [],
        parkingStatus: Car.PARKING_STATUS_STOP,
        alarmType: Car.ALARM_TYPE_NONE,
        parkingSpaceNumber: "A036"
    },
    {
        id: uuid.v1(),
        type: 'van',
        license: generateCarLicenseTag(),
        color: _.sample(carColorData['van']),
        enterPathInfoList: [
            { x: -23.572, y: 0.1, z: -23.809, isForwarded: false },
            { x: -23.572, y: 0.1, z: -25.251, isForwarded: false },
        ],
        leavePathInfoList: [],
        parkingStatus: Car.PARKING_STATUS_STOP,
        alarmType: Car.ALARM_TYPE_NONE,
        parkingSpaceNumber: "C008"
    },
]


export class RegularStroy {
    constructor({ lifterList, lightList }) {
        this.lifterList = lifterList

        this.lightList = lightList

        // 请求次数
        this.askTimes = 0

        // 循环次数
        this.repeatTimes = 0

        // 不动车辆,在路径上加上伪造的时间戳
        this.fixedCarInfoList = _.cloneDeep((fixedCarInfoList))
        this.fixedCarInfoList.forEach((carInfo, index) => {
            const stopTime = Math.random() * (6 - 1) + 1
            const beginTime = new Date().getTime() - stopTime * 24 * 60 * 60 * 1000
            carInfo.enterPathInfoList.forEach((pathInfo) => {
                pathInfo.timeStamp = beginTime + index * 3000
            })
        })



        this.garageCurrentInfo = {
            lifter: [],
            // 初始化常驻车辆信息
            car: [...this.fixedCarInfoList]
        }

        this.activeCarStopTime = 15

        this.activeCarInfoList = [{
            carEnterTime: 0,
            carStopTime: pathCollection[0].enter.length,
            carLeaveTime: pathCollection[0].enter.length + this.activeCarStopTime,
            carOutTime: pathCollection[0].enter.length + this.activeCarStopTime + pathCollection[0].leave.length,
            pathTemplate: pathCollection[0],
            lifterInfoList: [{ lifterId: 2, raisedTimes: [7, 8, 9] }, { lifterId: 3, raisedTimes: [49, 50, 51, 52] }],
            targetParkingSpaceNumber: 'A034',
            carInfo: {
                id: uuid.v1(),
                type: '',
                color: '',
                license: '',
                enterPathInfoList: [],
                leavePathInfoList: [],
                parkingStatus: Car.PARKING_STATUS_STOP,
                alarmType: Car.ALARM_TYPE_NONE,
            }
        }, {
            carEnterTime: 0,
            carStopTime: pathCollection[1].enter.length,
            carLeaveTime: pathCollection[1].enter.length + this.activeCarStopTime,
            carOutTime: pathCollection[1].enter.length + this.activeCarStopTime + pathCollection[1].leave.length,
            pathTemplate: pathCollection[1],
            lifterInfoList: [{ lifterId: 4, raisedTimes: [10, 11, 12] }, { lifterId: 1, raisedTimes: [59, 60, 61, 62] }],
            targetParkingSpaceNumber: 'C026',
            carInfo: {
                id: uuid.v1(),
                type: '',
                color: '',
                license: '',
                enterPathInfoList: [],
                leavePathInfoList: [],
                parkingStatus: Car.PARKING_STATUS_STOP,
                alarmType: Car.ALARM_TYPE_NONE,
            }
        }]

        this.activeCarList = []

        // -1表示不在库内
        this.activeCarSteps = []


    }

    // getCurrentGarageInfo() {
    //     // 循环
    //     if (this.activeCarSteps.every(item => item === -1)) {
    //         this.resetStory()
    //     }

    //     // 所有自动抬杆道闸初始化为降下
    //     this.lifterList.forEach(lifter => {

    //         if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
    //             lifter.isRaised = false
    //         }

    //     })

    //     // 第一辆车进场
    //     if (this.askTimes === 0) {
    //         this.activeCarSteps[0] = 0
    //     }

    //     // 第二辆车进场
    //     if (this.askTimes === 15) {

    //         this.activeCarSteps[1] = 0
    //     }

    //     // 更新车辆信息
    //     this.activeCarList.forEach(
    //         (activeCar, index) => {
    //             // activeCar 的步骤索引
    //             let activeCarStep = this.activeCarSteps[index]

    //             // 车辆在库内
    //             if (activeCarStep >= 0) {
    //                 // 车辆被道闸阻拦的标志
    //                 let flag = true

    //                 // 道闸
    //                 activeCar.lifterInfoList.forEach(lifterInfo => {
    //                     // 尝试自动升杆
    //                     if (lifterInfo.raisedTimes.includes(activeCarStep)) {
    //                         const lifter = this.lifterList.find(lifter => lifter.id === lifterInfo.lifterId)

    //                         // 可自动升杆
    //                         if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
    //                             lifter.isRaised = true
    //                         } else if (!lifter.isRaised) { // 不可自动升杆,且杆子未手动升起
    //                             flag = false

    //                         }
    //                     }
    //                 })

    //                 // 车辆没被道闸阻拦
    //                 if (flag) {
    //                     // 初始化车辆
    //                     if (activeCarStep === activeCar.carEnterTime) {
    //                         this.garageCurrentInfo.car.push(activeCar.carInfo)
    //                     }
    //                     activeCar.carInfo.parkingSpaceNumber = null

    //                     // 车辆入库
    //                     if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
    //                         const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
    //                         currentPositionInfo.timeStamp = new Date().getTime()
    //                         activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ENTER
    //                         activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
    //                     }

    //                     // 车辆停车
    //                     if (activeCar.carStopTime <= activeCarStep && activeCarStep < activeCar.carLeaveTime) {
    //                         activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_STOP
    //                         activeCar.carInfo.parkingSpaceNumber = activeCar.targetParkingSpaceNumber
    //                     }

    //                     // 车辆出库
    //                     if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
    //                         const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
    //                         currentPositionInfo.timeStamp = new Date().getTime()
    //                         activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_LEAVE
    //                         activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
    //                     }

    //                     // 车辆完全离开库
    //                     if (activeCarStep >= activeCar.carOutTime) {
    //                         _.remove(this.garageCurrentInfo.car, carInfo => carInfo.id === activeCar.carInfo.id)
    //                         this.activeCarSteps[index] = -2
    //                     }

    //                     this.activeCarSteps[index] = this.activeCarSteps[index] + 1
    //                 } else {// 车辆被道闸阻拦
    //                     activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ANOMALY
    //                     // 设置车辆持续鸣笛
    //                     activeCar.carInfo.alarmType = Car.ALARM_TYPE_WHISTLE

    //                     activeCarStep = activeCarStep - 1

    //                     // 车辆入库
    //                     if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
    //                         const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
    //                         currentPositionInfo.timeStamp = new Date().getTime()
    //                         activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
    //                     }

    //                     // 车辆出库
    //                     if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
    //                         const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
    //                         currentPositionInfo.timeStamp = new Date().getTime()
    //                         activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
    //                     }
    //                 }
    //             }
    //         }
    //     )

    //     this.askTimes++

    //     this.garageCurrentInfo.lifter = this.lifterList

    //     this.garageCurrentInfo.light = this.lightList

    //     this.repeatTimesCounter()

    //     return this.garageCurrentInfo
    // }
    getCurrentGarageInfo() {
        // 循环
        if (this.activeCarSteps.every(item => item === -1)) {
            this.resetStory()
        }

        // 第一辆车进场
        if (this.askTimes === 0) {
            this.activeCarSteps[0] = 0
        }

        // 第二辆车进场
        if (this.askTimes === 0) {
            this.activeCarSteps[1] = 0
        }

        // 所有自动抬杆道闸初始化为降下
        this.lifterList.forEach(lifter => {

            if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
                lifter.isRaised = false
            }

        })

        // 更新车辆信息
        this.activeCarList.forEach(
            (activeCar, index) => {
                // activeCar 的步骤索引
                let activeCarStep = this.activeCarSteps[index]
                activeCar.carInfo.alarmType = Car.ALARM_TYPE_NONE

                // 车辆在库内
                if (activeCarStep >= 0) {
                    // 车辆被道闸阻拦的标志
                    let flag = true

                    // 道闸
                    activeCar.lifterInfoList.forEach(lifterInfo => {
                        // 尝试自动升杆
                        if (lifterInfo.raisedTimes.includes(activeCarStep)) {
                            const lifter = this.lifterList.find(lifter => lifter.id === lifterInfo.lifterId)

                            // 可自动升杆
                            if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
                                lifter.isRaised = true
                            } else if (!lifter.isRaised) { // 不可自动升杆,且杆子未手动升起
                                flag = false

                            }
                        }
                    })


                    // 车辆没被道闸阻拦
                    if (flag) {
                        // 初始化车辆
                        if (activeCarStep === activeCar.carEnterTime) {
                            this.garageCurrentInfo.car.push(activeCar.carInfo)
                        }

                        activeCar.carInfo.parkingSpaceNumber = null

                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ENTER
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆停车
                        if (activeCar.carStopTime <= activeCarStep && activeCarStep < activeCar.carLeaveTime) {
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_STOP
                            activeCar.carInfo.parkingSpaceNumber = activeCar.targetParkingSpaceNumber
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_LEAVE
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }

                        // 车辆完全离开库
                        if (activeCarStep >= activeCar.carOutTime) {
                            _.remove(this.garageCurrentInfo.car, carInfo => carInfo.id === activeCar.carInfo.id)
                            this.activeCarSteps[index] = -2
                        }

                        this.activeCarSteps[index] = this.activeCarSteps[index] + 1
                    } else {// 车辆被道闸阻拦
                        activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ANOMALY
                        activeCar.carInfo.alarmType = Car.ALARM_TYPE_WHISTLE
                        activeCarStep = activeCarStep - 1

                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }
                    }
                }
            }
        )

        this.askTimes++

        this.garageCurrentInfo.lifter = this.lifterList

        this.garageCurrentInfo.light = this.lightList

        this.repeatTimesCounter()

        return this.garageCurrentInfo
    }

    resetStory() {
        this.askTimes = 0
        this.activeCarList = _.cloneDeep(this.activeCarInfoList)
        // // 充值活跃车辆的轨迹，id，类型和颜色信息
        // this.activeCarList.forEach(({ carInfo }) => {
        //     const carType = _.sample(carTypeList)
        //     carInfo.id = uuid.v1()
        //     carInfo.type = carType
        //     carInfo.license = generateCarLicenseTag()
        //     carInfo.color = _.sample(carColorData[carType])
        // })
        this.activeCarList.forEach(({ carInfo }) => {
            carInfo.id = uuid.v1()
            carInfo.type = carTypeList[1]
            carInfo.license = generateCarLicenseTag()
            carInfo.color = carColorData[carTypeList[1]][4]
        })

        this.activeCarSteps = this.activeCarList.map(() => -1)
    }

    repeatTimesCounter() {
        if (this.activeCarSteps.every(item => item === -1)) {
            this.repeatTimes++
        }
    }
}

export class LifterBrokenStory {
    constructor({ lifterList, lightList }) {
        this.lifterList = lifterList

        this.lightList = lightList

        // 请求次数
        this.askTimes = 0

        // 循环次数
        this.repeatTimes = 0

        // 不动车辆,在路径上加上伪造的时间戳
        this.fixedCarInfoList = _.cloneDeep((fixedCarInfoList))
        this.fixedCarInfoList.forEach((carInfo, index) => {
            const stopTime = Math.random() * (6 - 1) + 1
            const beginTime = new Date().getTime() - stopTime * 24 * 60 * 60 * 1000
            carInfo.enterPathInfoList.forEach((pathInfo) => {
                pathInfo.timeStamp = beginTime + index * 3000
            })
        })

        this.garageCurrentInfo = {
            lifter: [],
            // 初始化常驻车辆信息
            car: [...this.fixedCarInfoList]
        }

        this.activeCarStopTime = 15

        this.activeCarInfoList = [
            {
                carEnterTime: 0,
                carStopTime: pathCollection[0].enter.length,
                carLeaveTime: pathCollection[0].enter.length + this.activeCarStopTime,
                carOutTime: pathCollection[0].enter.length + this.activeCarStopTime + pathCollection[0].leave.length,
                pathTemplate: pathCollection[0],
                lifterInfoList: [{ lifterId: 2, raisedTimes: [7, 8, 9] }, { lifterId: 3, raisedTimes: [49, 50, 51, 52] }],
                targetParkingSpaceNumber: 'A034',
                carInfo: {
                    id: uuid.v1(),
                    type: '',
                    color: '',
                    license: '',
                    enterPathInfoList: [],
                    leavePathInfoList: [],
                    parkingStatus: Car.PARKING_STATUS_STOP,
                    alarmType: Car.ALARM_TYPE_NONE,
                }
            },
            {
                carEnterTime: 0,
                carStopTime: pathCollection[2].enter.length,
                carLeaveTime: pathCollection[2].enter.length + this.activeCarStopTime,
                carOutTime: pathCollection[2].enter.length + this.activeCarStopTime + pathCollection[2].leave.length,
                pathTemplate: pathCollection[2],
                lifterInfoList: [{ lifterId: 2, raisedTimes: [5, 6, 7] }, { lifterId: 3, raisedTimes: [50, 51, 52, 53] }],
                targetParkingSpaceNumber: 'B042',
                carInfo: {
                    id: uuid.v1(),
                    type: '',
                    color: '',
                    license: '',
                    enterPathInfoList: [],
                    leavePathInfoList: [],
                    parkingStatus: Car.PARKING_STATUS_STOP,
                    alarmType: Car.ALARM_TYPE_NONE,
                }
            },
        ]

        this.activeCarList = []

        // -1表示不在库内
        this.activeCarSteps = []
    }

    getCurrentGarageInfo() {
        // 循环
        if (this.activeCarSteps.every(item => item === -1)) {
            this.resetStory()
        }

        // 第一辆车进场
        if (this.askTimes === 0) {
            this.activeCarSteps[0] = 0
        }

        // 第二辆车进场
        if (this.askTimes === 2) {

            this.activeCarSteps[1] = 0
        }

        // 第三辆车进场
        if (this.askTimes === 0) {

            this.activeCarSteps[2] = 0
        }

        // 初始化道闸
        this.lifterList.forEach(lifter => {
            if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
                lifter.isRaised = false
            }
        })


        // 手动设置南门入口道闸自动感应故障
        this.lifterList.find(lifer => lifer.id === 2).status = Garage.LIFTER_STATUS_ANOMALY

        // 更新车辆信息
        this.activeCarList.forEach(
            (activeCar, index) => {
                // activeCar 的步骤索引
                let activeCarStep = this.activeCarSteps[index]

                // 车辆在库内
                if (activeCarStep >= 0) {
                    // 车辆被道闸阻拦的标志
                    let flag = true

                    // 道闸
                    activeCar.lifterInfoList.forEach(lifterInfo => {
                        // 尝试自动升杆
                        if (lifterInfo.raisedTimes.includes(activeCarStep)) {
                            const lifter = this.lifterList.find(lifter => lifter.id === lifterInfo.lifterId)

                            // 可自动升杆
                            if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
                                lifter.isRaised = true
                            } else if (!lifter.isRaised) { // 不可自动升杆,且杆子未手动升起
                                flag = false

                            }
                        }
                    })
                    // 车辆没被道闸阻拦
                    if (flag) {
                        // 初始化车辆
                        if (activeCarStep === activeCar.carEnterTime) {
                            this.garageCurrentInfo.car.push(activeCar.carInfo)
                        }
                        activeCar.carInfo.alarmType = Car.ALARM_TYPE_NONE
                        activeCar.carInfo.parkingSpaceNumber = null

                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ENTER
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆停车
                        if (activeCar.carStopTime <= activeCarStep && activeCarStep < activeCar.carLeaveTime) {
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_STOP
                            activeCar.carInfo.parkingSpaceNumber = activeCar.targetParkingSpaceNumber
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_LEAVE
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }

                        // 车辆完全离开库
                        if (activeCarStep >= activeCar.carOutTime) {
                            _.remove(this.garageCurrentInfo.car, carInfo => carInfo.id === activeCar.carInfo.id)
                            this.activeCarSteps[index] = -2
                        }

                        this.activeCarSteps[index] = this.activeCarSteps[index] + 1
                    } else {// 车辆被道闸阻拦
                        activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ANOMALY
                        // 设置车辆持续鸣笛
                        activeCar.carInfo.alarmType = Car.ALARM_TYPE_WHISTLE
                        activeCarStep = activeCarStep - 1
                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }
                    }
                }
            }
        )

        this.askTimes++

        this.garageCurrentInfo.lifter = this.lifterList

        this.garageCurrentInfo.light = this.lightList

        this.repeatTimesCounter()

        return this.garageCurrentInfo
    }

    resetStory() {
        this.askTimes = 0
        this.activeCarList = _.cloneDeep(this.activeCarInfoList)
        // 充值活跃车辆的轨迹，id，类型和颜色信息
        this.activeCarList.forEach(({ carInfo }) => {
            const carType = _.sample(carTypeList)
            carInfo.id = uuid.v1()
            carInfo.type = carType
            carInfo.license = generateCarLicenseTag()
            carInfo.color = _.sample(carColorData[carType])

        })

        this.activeCarSteps = this.activeCarList.map(() => -1)
    }

    repeatTimesCounter() {
        if (this.activeCarSteps.every(item => item === -1)) {
            this.repeatTimes++
        }
    }

}

export class LifterBrokenLightCloseStory {
    constructor({ lifterList, lightList }) {
        this.lifterList = lifterList

        this.lightList = lightList

        // 请求次数
        this.askTimes = 0

        // 循环次数
        this.repeatTimes = 0

        // 不动车辆,在路径上加上伪造的时间戳
        this.fixedCarInfoList = _.cloneDeep((fixedCarInfoList))
        this.fixedCarInfoList.forEach((carInfo, index) => {
            const stopTime = Math.random() * (6 - 1) + 1
            const beginTime = new Date().getTime() - stopTime * 24 * 60 * 60 * 1000
            carInfo.enterPathInfoList.forEach((pathInfo) => {
                pathInfo.timeStamp = beginTime + index * 3000
            })
        })

        this.garageCurrentInfo = {
            lifter: [],
            // 初始化常驻车辆信息
            car: [...this.fixedCarInfoList]
        }

        this.activeCarStopTime = 15

        this.activeCarInfoList = [
            {
                carEnterTime: 0,
                carStopTime: pathCollection[0].enter.length,
                carLeaveTime: pathCollection[0].enter.length + this.activeCarStopTime,
                carOutTime: pathCollection[0].enter.length + this.activeCarStopTime + pathCollection[0].leave.length,
                pathTemplate: pathCollection[0],
                lifterInfoList: [{ lifterId: 2, raisedTimes: [7, 8, 9] }, { lifterId: 3, raisedTimes: [49, 50, 51, 52] }],
                targetParkingSpaceNumber: 'A034',
                carInfo: {
                    id: uuid.v1(),
                    type: '',
                    color: '',
                    license: '',
                    enterPathInfoList: [],
                    leavePathInfoList: [],
                    parkingStatus: Car.PARKING_STATUS_STOP,
                    alarmType: Car.ALARM_TYPE_NONE,

                }
            },
            {
                carEnterTime: 0,
                carStopTime: pathCollection[2].enter.length,
                carLeaveTime: pathCollection[2].enter.length + this.activeCarStopTime,
                carOutTime: pathCollection[2].enter.length + this.activeCarStopTime + pathCollection[2].leave.length,
                pathTemplate: pathCollection[2],
                lifterInfoList: [{ lifterId: 2, raisedTimes: [5, 6, 7] }, { lifterId: 3, raisedTimes: [50, 51, 52, 53] }],
                targetParkingSpaceNumber: 'B042',
                carInfo: {
                    id: uuid.v1(),
                    type: '',
                    color: '',
                    license: '',
                    enterPathInfoList: [],
                    leavePathInfoList: [],
                    parkingStatus: Car.PARKING_STATUS_STOP,
                    alarmType: Car.ALARM_TYPE_NONE,
                }
            },
            {
                carEnterTime: 0,
                carStopTime: pathCollection[1].enter.length,
                carLeaveTime: pathCollection[1].enter.length + this.activeCarStopTime,
                carOutTime: pathCollection[1].enter.length + this.activeCarStopTime + pathCollection[1].leave.length,
                pathTemplate: pathCollection[1],
                lifterInfoList: [{ lifterId: 4, raisedTimes: [8, 9, 10] }, { lifterId: 1, raisedTimes: [59, 60, 61, 62] }],
                targetParkingSpaceNumber: 'C026',
                carInfo: {
                    id: uuid.v1(),
                    type: '',
                    color: '',
                    license: '',
                    enterPathInfoList: [],
                    leavePathInfoList: [],
                    parkingStatus: Car.PARKING_STATUS_STOP,
                    alarmType: Car.ALARM_TYPE_NONE,
                }
            }
        ]

        this.activeCarList = []

        // -1表示不在库内
        this.activeCarSteps = []
    }

    getCurrentGarageInfo() {
        // 循环
        if (this.activeCarSteps.every(item => item === -1)) {
            this.resetStory()
        }

        // 第一辆车进场
        if (this.askTimes === 0) {
            this.activeCarSteps[0] = 0
        }

        // 第二辆车进场
        if (this.askTimes === 2) {

            this.activeCarSteps[1] = 0
        }

        // 第三辆车进场
        if (this.askTimes === 0) {

            this.activeCarSteps[2] = 0
        }

        // 初始化道闸
        this.lifterList.forEach(lifter => {
            if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
                lifter.isRaised = false
            }
        })


        // 手动设置南门入口道闸自动感应故障
        this.lifterList.find(lifer => lifer.id === 2).status = Garage.LIFTER_STATUS_ANOMALY

        // 更新车辆信息
        this.activeCarList.forEach(
            (activeCar, index) => {
                // activeCar 的步骤索引
                let activeCarStep = this.activeCarSteps[index]
                activeCar.carInfo.alarmType = Car.ALARM_TYPE_NONE


                // 特别的，设置第三辆车在入库时等待A(id:1),B(id:2)开灯
                if (index === 2) {
                    const light1 = this.lightList.find(item => item.id === 1)
                    const light2 = this.lightList.find(item => item.id === 2)
                    // 车辆在AB的区域内，且没开灯
                    if ((13 <= activeCarStep && activeCarStep <= 37) && (!light1.isOpen || !light2.isOpen)) {

                        activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ANOMALY
                        activeCar.carInfo.alarmType = Car.ALARM_TYPE_WHISTLE

                        activeCarStep = activeCarStep - 1

                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }
                        return


                    }
                }

                // 车辆在库内
                if (activeCarStep >= 0) {
                    // 车辆被道闸阻拦的标志
                    let flag = true

                    // 道闸
                    activeCar.lifterInfoList.forEach(lifterInfo => {
                        // 尝试自动升杆
                        if (lifterInfo.raisedTimes.includes(activeCarStep)) {
                            const lifter = this.lifterList.find(lifter => lifter.id === lifterInfo.lifterId)

                            // 可自动升杆
                            if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
                                lifter.isRaised = true
                            } else if (!lifter.isRaised) { // 不可自动升杆,且杆子未手动升起
                                flag = false

                            }
                        }
                    })


                    // 车辆没被道闸阻拦
                    if (flag) {
                        // 初始化车辆
                        if (activeCarStep === activeCar.carEnterTime) {
                            this.garageCurrentInfo.car.push(activeCar.carInfo)
                        }

                        activeCar.carInfo.parkingSpaceNumber = null

                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ENTER
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆停车
                        if (activeCar.carStopTime <= activeCarStep && activeCarStep < activeCar.carLeaveTime) {
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_STOP
                            activeCar.carInfo.parkingSpaceNumber = activeCar.targetParkingSpaceNumber
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_LEAVE
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }

                        // 车辆完全离开库
                        if (activeCarStep >= activeCar.carOutTime) {
                            _.remove(this.garageCurrentInfo.car, carInfo => carInfo.id === activeCar.carInfo.id)
                            this.activeCarSteps[index] = -2
                        }

                        this.activeCarSteps[index] = this.activeCarSteps[index] + 1
                    } else {// 车辆被道闸阻拦
                        activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ANOMALY
                        activeCar.carInfo.alarmType = Car.ALARM_TYPE_WHISTLE
                        activeCarStep = activeCarStep - 1

                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }
                    }
                }
            }
        )

        this.askTimes++

        this.garageCurrentInfo.lifter = this.lifterList

        this.garageCurrentInfo.light = this.lightList

        this.repeatTimesCounter()

        return this.garageCurrentInfo
    }

    resetStory() {
        this.askTimes = 0
        this.activeCarList = _.cloneDeep(this.activeCarInfoList)
        // 充值活跃车辆的轨迹，id，类型和颜色信息
        this.activeCarList.forEach(({ carInfo }) => {
            const carType = _.sample(carTypeList)
            carInfo.id = uuid.v1()
            carInfo.type = carType
            carInfo.license = generateCarLicenseTag()
            carInfo.color = _.sample(carColorData[carType])
        })

        this.activeCarSteps = this.activeCarList.map(() => -1)
    }

    repeatTimesCounter() {
        if (this.activeCarSteps.every(item => item === -1)) {
            this.repeatTimes++
        }
    }

}

export class NightStory {
    constructor({ lifterList, lightList }) {
        this.lifterList = lifterList

        this.lightList = lightList

        // 请求次数
        this.askTimes = 0

        // 循环次数
        this.repeatTimes = 0

        // 不动车辆,在路径上加上伪造的时间戳
        this.fixedCarInfoList = _.cloneDeep((fixedCarInfoList))
        this.fixedCarInfoList.forEach((carInfo, index) => {
            const stopTime = Math.random() * (6 - 1) + 1
            const beginTime = new Date().getTime() - stopTime * 24 * 60 * 60 * 1000
            carInfo.enterPathInfoList.forEach((pathInfo) => {
                pathInfo.timeStamp = beginTime + index * 3000
            })
        })

        this.garageCurrentInfo = {
            lifter: [],
            // 初始化常驻车辆信息
            car: [...this.fixedCarInfoList]
        }

        this.activeCarStopTime = 50

        this.activeCarInfoList = [

            {
                carEnterTime: 0,
                carStopTime: pathCollection[2].enter.length,
                carLeaveTime: pathCollection[2].enter.length + this.activeCarStopTime,
                carOutTime: pathCollection[2].enter.length + this.activeCarStopTime + pathCollection[2].leave.length,
                pathTemplate: pathCollection[2],
                lifterInfoList: [{ lifterId: 2, raisedTimes: [7, 8, 9] }, { lifterId: 3, raisedTimes: [60, 61, 62, 63] }],
                targetParkingSpaceNumber: 'B042',
                carInfo: {
                    id: uuid.v1(),
                    type: '',
                    color: '',
                    license: '',
                    enterPathInfoList: [],
                    leavePathInfoList: [],
                    parkingStatus: Car.PARKING_STATUS_STOP,
                    alarmType: Car.ALARM_TYPE_NONE,
                }
            },

            {
                carEnterTime: 0,
                carStopTime: pathCollection[1].enter.length,
                carLeaveTime: pathCollection[1].enter.length + this.activeCarStopTime,
                carOutTime: pathCollection[1].enter.length + this.activeCarStopTime + pathCollection[1].leave.length,
                pathTemplate: pathCollection[1],
                lifterInfoList: [{ lifterId: 4, raisedTimes: [10, 11, 12] }, { lifterId: 1, raisedTimes: [59, 60, 61, 62] }],
                targetParkingSpaceNumber: 'C026',
                carInfo: {
                    id: uuid.v1(),
                    type: '',
                    color: '',
                    license: '',
                    enterPathInfoList: [],
                    leavePathInfoList: [],
                    parkingStatus: Car.PARKING_STATUS_STOP,
                    alarmType: Car.ALARM_TYPE_NONE,
                }
            }

        ]

        this.activeCarList = []

        // -1表示不在库内
        this.activeCarSteps = []

        // 初始化道闸，南门入口处故障
        this.lifterList.forEach(lifter => {
            lifter.isRaised = false
            if (lifter.id === 2) {
                lifter.status = Garage.LIFTER_STATUS_ANOMALY
            } else {
                lifter.status = Garage.LIFTER_STATUS_AUTO
            }
        })

        // 初始化照明
        this.lightList.forEach(light => {
            if (light.title === "G区" || light.title === "F区") {
                light.isOpen = false
            } else {
                light.isOpen = true
            }
        })

    }

    getCurrentGarageInfo() {
        // 循环
        if (this.activeCarSteps.every(item => item === -1)) {
            this.resetStory()
        }

        // 第一辆车进场
        if (this.askTimes === 0) {
            this.activeCarSteps[0] = 0
        }

        // 第二辆车进场
        if (this.askTimes === 0) {
            this.activeCarSteps[1] = 0
        }

        // 所有自动抬杆道闸初始化为降下
        this.lifterList.forEach(lifter => {

            if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
                lifter.isRaised = false
            }

        })

        // 更新车辆信息
        this.activeCarList.forEach(
            (activeCar, index) => {
                // activeCar 的步骤索引
                let activeCarStep = this.activeCarSteps[index]
                activeCar.carInfo.alarmType = Car.ALARM_TYPE_NONE

                // 车辆在库内
                if (activeCarStep >= 0) {
                    // 车辆被道闸阻拦的标志
                    let flag = true

                    // 道闸
                    activeCar.lifterInfoList.forEach(lifterInfo => {
                        // 尝试自动升杆
                        if (lifterInfo.raisedTimes.includes(activeCarStep)) {
                            const lifter = this.lifterList.find(lifter => lifter.id === lifterInfo.lifterId)

                            // 可自动升杆
                            if (lifter.status === Garage.LIFTER_STATUS_AUTO) {
                                lifter.isRaised = true
                            } else if (!lifter.isRaised) { // 不可自动升杆,且杆子未手动升起
                                flag = false

                            }
                        }
                    })


                    // 车辆没被道闸阻拦
                    if (flag) {
                        // 初始化车辆
                        if (activeCarStep === activeCar.carEnterTime) {
                            this.garageCurrentInfo.car.push(activeCar.carInfo)
                        }

                        activeCar.carInfo.parkingSpaceNumber = null

                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ENTER
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆停车
                        if (activeCar.carStopTime <= activeCarStep && activeCarStep < activeCar.carLeaveTime) {
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_STOP
                            activeCar.carInfo.parkingSpaceNumber = activeCar.targetParkingSpaceNumber
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_LEAVE
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }

                        // 车辆完全离开库
                        if (activeCarStep >= activeCar.carOutTime) {
                            _.remove(this.garageCurrentInfo.car, carInfo => carInfo.id === activeCar.carInfo.id)
                            this.activeCarSteps[index] = -2
                        }

                        this.activeCarSteps[index] = this.activeCarSteps[index] + 1
                    } else {// 车辆被道闸阻拦
                        activeCar.carInfo.parkingStatus = Car.PARKING_STATUS_ANOMALY
                        activeCar.carInfo.alarmType = Car.ALARM_TYPE_WHISTLE
                        activeCarStep = activeCarStep - 1

                        // 车辆入库
                        if (activeCar.carEnterTime <= activeCarStep && activeCarStep < activeCar.carStopTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.enter[activeCarStep])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.enterPathInfoList.push(currentPositionInfo)
                        }

                        // 车辆出库
                        if (activeCar.carLeaveTime <= activeCarStep && activeCarStep < activeCar.carOutTime) {
                            const currentPositionInfo = _.cloneDeep(activeCar.pathTemplate.leave[activeCarStep - activeCar.carLeaveTime])
                            currentPositionInfo.timeStamp = new Date().getTime()
                            activeCar.carInfo.leavePathInfoList.push(currentPositionInfo)
                        }
                    }
                }
            }
        )

        this.askTimes++

        this.garageCurrentInfo.lifter = this.lifterList

        this.garageCurrentInfo.light = this.lightList

        this.repeatTimesCounter()

        return this.garageCurrentInfo
    }

    resetStory() {
        this.askTimes = 0
        this.activeCarList = _.cloneDeep(this.activeCarInfoList)
        // 充值活跃车辆的轨迹，id，类型和颜色信息
        this.activeCarList.forEach(({ carInfo }, index) => {

            let carType = "sedan"
            switch (index) {
                case 0:
                    carType = "sedan"
                    carInfo.id = uuid.v1()
                    carInfo.type = carType
                    carInfo.license = "苏B·M2089"
                    carInfo.color = "rgb(0, 0, 0)"
                    break
                case 1:
                    carType = "suv"
                    carInfo.id = uuid.v1()
                    carInfo.type = carType
                    carInfo.license = "鲁A·88B66"
                    carInfo.color = "rgb(193, 0, 1)"
                    break
            }

        })

        this.activeCarSteps = this.activeCarList.map(() => -1)
    }

    repeatTimesCounter() {
        if (this.activeCarSteps.every(item => item === -1)) {
            this.repeatTimes++
        }
    }

}


function generateCarLicenseTag() {

    const cityList = ["鲁"];
    //车牌号所在地区
    const areaList = ["A", "S", "B", "U", "C", "D", "E", "F", "Y", "G", "V", "H", "J", "K", "L", "M", "N", "P", "Q", "R"]
    //车牌号后5位
    const numberList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    const letterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "J", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    const letterNum = Math.floor((Math.random() * 3));
    //区域生成
    const city = _.sample(cityList)
    const area = _.sample(areaList)
    let numList = []

    for (let index = 0; index < letterNum; index++) {
        numList.push(_.sample(letterList))
    }

    for (let index = 0; index < 5 - letterNum; index++) {
        numList.push(_.sample(numberList))
    }
    numList = _.shuffle(numList)
    return city + area + '·' + numList.join('')
}

