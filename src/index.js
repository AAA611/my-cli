#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ProgressBar = require('progress');

function scan() {
  // 获取当前工作目录
  const currentDir = process.cwd();

  // 扫描目录
  const files = scanDir(currentDir);

  // 将扫描到的文件名写入 markdown 表格
  const markdownContent = `| 文件名 |\n| --- |\n${files.map(file => `| ${file} |\n`).join('')}`;

  // 将 markdown 表格写入文件
  fs.writeFileSync(path.join(currentDir, 'files.md'), markdownContent, 'utf-8');
}

// 扫描目录
function scanDir(dirPath) {
  // 读取目录下的文件和文件夹
  const files = fs.readdirSync(dirPath);
  const bar = new ProgressBar(':bar :current/:total', { total: files.length });
  const scannedFiles = [];

  // 遍历目录下的文件和文件夹
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(dirPath, file);

    // 判断是否是文件夹
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      // 如果是文件夹，递归扫描子目录
      scannedFiles.push(...scanDir(filePath));
    } else {
      // 如果是文件，加入到扫描到的文件列表中
      scannedFiles.push(file);
    }

    bar.tick();
  }

  return scannedFiles;
}

scan();
