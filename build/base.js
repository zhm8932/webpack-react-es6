/**
 * Created by haiming.zeng on 2017/8/3.
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootPath = path.resolve(__dirname, '..');     // 项目根目录
const srcPath = path.join(rootPath, 'src');             // 开发源码目录
const distPath = path.join(rootPath, 'dist');             // 开发源码目录

let commonPath = {
	rootPath:rootPath,
	srcPath:srcPath,
	distPath:distPath,
	indexHTML: path.join(srcPath, 'test.html'),        // 入口模板页面
}
module.exports = {
	entry:{
		index:path.join(srcPath,'js/main.js'),
	},
	output:{
		path:path.join(rootPath,'dist'),        // 所有输出文件的目标路径
		filename:'./js/[name].[hash].js', //不要在开发环境下使用 [chunkhash]
		publicPath:'/'      // 输出解析文件的目录，url 相对于 HTML 页面 跟HMR热更新有关 对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误
	},
	resolve:{
		extensions:['.js','.jsx','.json','.scss'],   // 使用的扩展名
		alias:{
			// 模块别名列表
			components:path.join(srcPath,'js/components'),
			images:path.join(srcPath,'images'),
		}
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({name:'common',minChunks:4}),
		new HtmlWebpackPlugin({
			filename: 'test.html',      //输出的 HTML 文件名，默认是 index.html
			title: '自定义测试11111111111',          //用来生成页面的 title 元素
			template: commonPath.indexHTML,         //// 模板文件路径，支持加载器，比如 html!./index.html
			// template: 'src/test.html',
			files:{
				js: [ "js/vendors.js"],
			}
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
		}),
		new ExtractTextPlugin('css/style.[chunkhash].css'),
		new webpack.HotModuleReplacementPlugin(), // 启用 HMR
		new webpack.DllReferencePlugin({
			context:__dirname,  //context：需要跟之前保持一致，这个用来指导webpack匹配manifest.json中库的路径
			manifest:require('../dist/vendors.manifest.json') //用来引入刚才输出的manifest.json文件
		})
	],
	module:{
		//忽略某些模块的解析可以进一步加快速度
		// noParse:[PathToReact,PathToReactDom],  //module中的noParse则是告诉当webpack尝试去解析压缩文件时，这种行为是不允许的
		// 从 webpack 3.0.0 开始
		rules:[     // 模块规则（配置 loader、解析器等选项）
			{
				test:/\.jsx?$/,
				use:'babel-loader',
				exclude:/node_modules/,
			},{
				test:/\.scss$/,
				// use: [{
				// 	loader: "style-loader" // creates style nodes from JS strings
				// }, {
				// 	loader: "css-loader" // translates CSS into CommonJS
				// }, {
				// 	loader: "sass-loader" // compiles Sass to CSS
				// }]
				use:ExtractTextPlugin.extract({
					fallback:'style-loader',
					use: [{
						loader: "css-loader"
					}, {
						loader: "sass-loader"
					}],
				}),
			},{
				test: /\.(png|jpe?g|gif|svg)$/,
				include:/src/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1024*16,  //当图片大小小于限制时会自动转成 base64 码引用
							name:'./images/[name].[ext]',
							prefix: 'img'
						},

					}
				]

			},{
				test: /\.(woff2?|eot|ttf|otf)$/,
				include:/src/,
				// use: 'url-loader?limit=10240&name=./fonts/[name]-[hash:6].[ext]'
				use:{
					loader: 'url-loader',
					options: {
						limit:10240,
						name: './fonts/[name]-[hash:6].[ext]',
					},
				}
			}
		]
	},
	devtool: "cheap-source-map", // cheap-source-map 不包含列信息，不包含 loader 的 sourcemap，（譬如 babel 的 sourcemap）
	devServer:{
		contentBase:path.join(rootPath, 'dist'),        //默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录，告诉服务器从哪里提供内容
		inline:true,    //设置为true，当源文件改变时会自动刷新页面
		stats: { colors: true },  //设置为true，使终端输出的文件为彩色的
		hot:true,       // 告诉 dev-server 我们在使用 HMR 启用 webpack 的模块热替换特性
		port:3333,      //  port:默认为8080
		publicPath:'/', //此路径下的打包文件可在浏览器中访问 模块热替换所必需的
		historyApiFallback:true  //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
	},
}