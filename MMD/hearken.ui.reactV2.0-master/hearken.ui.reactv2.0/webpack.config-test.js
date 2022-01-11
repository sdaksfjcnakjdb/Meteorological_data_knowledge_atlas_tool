var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var packageName = "base";

module.exports = {
	devtool: 'source-map',
	entry: {
		HKComponentTest: './ComponentTest.js'
	},  //入口文件
	output: {                //入口文件输出配置
		path: path.resolve(__dirname, 'build'),
		publicPath: "/build/",
		libraryTarget: 'umd',
		library: packageName,
		filename: '[name].js',
	},
	//排除打包外部框架
	externals: {
		'react': "React",
		'jquery': "$",
		'react-dom': "ReactDOM",
		"antd": "antd",
		"moment": "moment",
		"react-color": "react-color"
	},
	// 配置服务器
	devServer: {
		contentBase: './',
		// colors: true,
		historyApiFallback: true,
		inline: true,
		port: 8080
	},
	module: {
		rules: [     //加载器
			{
				test: /\.(css|less)$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[local]'
							},
						}
					}, 'less-loader']
				})
			},
			{
				exclude: [
					/\.html$/,
					/\.(js|jsx)$/,
					/\.(css|less)$/,
					/\.json$/,
					/\.bmp$/,
					/\.gif$/,
					/\.jpe?g$/,
					/\.png$/,
				],
				loader: require.resolve('file-loader'),
				options: {
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader'),
				options: {
					limit: 1,
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			{
				test: /\.json$/,
				loader: "json-loader"
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env", "@babel/preset-react"],
							plugins: ["@babel/plugin-proposal-class-properties"]
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin('[name].css')
	],
};