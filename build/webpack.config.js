/**
 * Created by haiming.zeng on 2017/8/3.
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonPath = require('./commonPath');

module.exports = {
	entry:{
		index:path.join(commonPath.srcPath,'js/main.js'),
	},
	output:{
		path:path.join(commonPath.rootPath,'dist'),        // 所有输出文件的目标路径
		filename:'./js/[name].[hash].js', //不要在开发环境下使用 [chunkhash]
		publicPath:'/'      // 输出解析文件的目录，url 相对于 HTML 页面 跟HMR热更新有关 对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误
	},
	resolve:{
		extensions:['.js','.jsx','.json','.scss'],   // 使用的扩展名
		alias:{
			// 模块别名列表
			components:path.join(commonPath.srcPath,'js/components'),
			images:path.join(commonPath.srcPath,'images'),
		}
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({name:'common',minChunks:4}),
		new HtmlWebpackPlugin({
			filename: 'index.html',      //输出的 HTML 文件名，默认是 index.html
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
		//css 单独打包 会使scss修改时热更新失效
		// new ExtractTextPlugin('css/style.[chunkhash].css'),
		new webpack.HotModuleReplacementPlugin(), // 启用 HMR
		new webpack.DllReferencePlugin({
			context:__dirname,  //context：需要跟之前保持一致，这个用来指导webpack匹配manifest.json中库的路径
			manifest:require('../dist/vendors.manifest.json') //用来引入刚才输出的manifest.json文件
		}),
		new CopyWebpackPlugin([
			{
				from: path.join(commonPath.srcPath,'data'),
				to:path.join(commonPath.distPath,'data'),
				// to:'build/'
			},

		] ),
		new CleanWebpackPlugin(
			['dist'],　 //匹配删除的文件
			{
				root: commonPath.rootPath,　　　　　　　　//根目录
				verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
				dry:      true,        　　　　　　　　　　//启用删除文件
				exclude: ["vendors.js"]//排除不删除的目录，主要用于避免删除公用的文件
			}
		)
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
	}
}