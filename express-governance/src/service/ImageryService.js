const fs = require('fs/promises')
const _ = require('lodash')
const path = require('path')
const imageryModel = require('../model/ImageryModel.js')
const express = require('express');
const commonUtils = require('../utils/CommonUtils.js');
const AppConfig = require('../../config/AppConfig');
const uuid = require('uuid');


function searchImageryListByPage(keywords, pageNum, pageSize) {
    let imageryList = imageryModel.selImageryList().filter(imagery => imagery.name.includes(keywords))

    // imageryList = [_.cloneDeep(imageryList),_.cloneDeep(imageryList),_.cloneDeep(imageryList),_.cloneDeep(imageryList),_.cloneDeep(imageryList),].flat()
    // imageryList.forEach(imagery => {
    //     imagery.id = uuid.v1()
    // });

    return { totalNum: imageryList.length, list: imageryList.slice((pageNum - 1) * pageSize, pageNum * pageSize) }
}



async function getFileStructure(directoryPath) {
    const directoryName = _.last(directoryPath.split('/'))
    const files = await fs.readdir(directoryPath);
    const directory = {
        name: directoryName,
        path: directoryPath,
        type: 'directory',
        children: []
    };
    for (let file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            directory.children.push(getFileStructure(filePath));
        } else {
            directory.children.push({
                name: file,
                path: filePath,
                type: 'file'
            })
        }
    }
    return directory;
}

function getSubStaticResource(staticUrl) {
    const staticResourcePath = AppConfig.staticResourcePath;
    // 获取子文件、文件夹列表
    let subFileList = commonUtils.getSubStaticResource(staticUrl)

    subFileList = subFileList
        .filter(file => { // 过滤掉非图片文件
            return file.type === 'directory' || ['.png', '.jpg', '.jpeg'].some(type => type === path.extname(file.path))
        })
        .sort((file1, file2) => { // 小数字在前，大数字在后
            const fileBaseName1 = path.basename(file1.name, path.extname(file1.name));
            const fileBaseName2 = path.basename(file2.name, path.extname(file1.name));
            return Number(fileBaseName1) - Number(fileBaseName2)
        })
        .sort((file1, file2) => {    // 文件夹在前，文件在后
            if (file1.type === file2.type) {
                return 0
            } else if (file1.type === "directory") {
                return -1
            } else {
                return 1
            }
        })
        .map(file => { //文件路径转为url
            file.path = '/' + path.relative(staticResourcePath, file.path).replaceAll("\\","/");
            return file
        })

    //



    return subFileList;
}

module.exports = { searchImageryListByPage, getSubStaticResource }
