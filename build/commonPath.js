/**
 * Created by haiming.zeng on 2017/8/4.
 */

const path = require('path');
const rootPath = path.resolve(__dirname, '..');     // 项目根目录
const srcPath = path.join(rootPath, 'src');             // 开发源码目录
const distPath = path.join(rootPath, 'dist');             // 开发源码目录
let commonPath = {
	rootPath,
	srcPath,
	distPath,
	indexHTML: path.join(srcPath, 'index.html'),        // 入口模板页面
}
module.exports = commonPath;