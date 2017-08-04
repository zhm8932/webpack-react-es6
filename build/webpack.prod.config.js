/**
 * Created by haiming.zeng on 2017/8/2.
 */

const webpack =  require('webpack');
const merge =  require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackConfig = require('./webpack.config');
const commonPath = require('./commonPath');
module.exports = merge(webpackConfig,{
	plugins:[
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
		}),
		// 若要按需加载 CSS 则请注释掉该行
		new ExtractTextPlugin('css/[name].[chunkhash].css',{
			allChunks : true
		}),
		new webpack.optimize.UglifyJsPlugin({
			mangle:{ //不混淆压缩
				except:['$','exports','require'],
				screw_ie8: true,
				keep_fnames: true
			},
			compress:{
				warnings:false,
				screw_ie8: true
			},
			beautify: false,
			comments: false
		}),
	],
	module:{
		rules:[
			{
				test:/\.scss$/,
				use:ExtractTextPlugin.extract({
					fallback:'style-loader',
					use: [{
						loader: "css-loader"
					}, {
						loader: "sass-loader"
					}],
				}),
			}
		]
	}
})