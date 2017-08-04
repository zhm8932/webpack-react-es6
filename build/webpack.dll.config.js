/**
 * Created by haiming.zeng on 2017/8/1.
 */
const webpack = require('webpack');
const path = require('path');
const commonPath = require('./commonPath');
var Node_modules = path.resolve(__dirname,'node_modules');
var PathToReact = path.resolve(Node_modules,'react/dist/react.min.js');
var PathToReactDom = path.resolve(Node_modules,'react-dom/dist/react-dom.min.js');
module.exports = {
	entry:{
		vendors:[
			'react',
			'react-dom',
		]
	},
	output:{
		path:path.join(commonPath.rootPath,'dist'),        // 所有输出文件的目标路径
		filename:'./js/[name].js',
		library:'[name]_library'

	},
	resolve:{
		//resolve属性里的alias用来告诉webpack，当引入react时，试图去匹配压缩过的react
		alias:{
			// 'react':PathToReact,
			// 'react-dom':PathToReactDom,
		}
	},
	plugins:[
		// 压缩 js、css
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		// new webpack.DefinePlugin({
		// 	'process.env': {
		// 		NODE_ENV: JSON.stringify('production')
		// 	}
		// }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
		}),
		new webpack.DllPlugin({
			path:path.join(commonPath.rootPath,'dist/[name].manifest.json'),        // 所有输出文件的目标路径
			// path:path.resolve(__dirname,'../dist/[name].manifest.json'),
			name:'[name]_library',
			context:__dirname,
		})
	]
}
/*
 高真正的build和rebuild构建效率。也就是说只要第三方库没有变化，
 之后的每次build都只需要去打包自己的业务代码，解决Externals多次引用问题。
 webpack通过webpack.DllPlugin与webpack.DllReferencePlugin两个内嵌插件实现此功能

 webpack.DllPlugin选项：
 path：manifest.json文件的输出路径，这个文件会用于后续的业务代码打包；
 name：dll暴露的对象名，要跟output.library保持一致;
 context：解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致。
* */