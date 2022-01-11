var path = require('path');
//基础构件base
var packageName = "base";
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const uglify = require('uglifyjs-webpack-plugin');
module.exports = {
  devtool: 'source-map',
  entry: {
    base: './component/index.js'
  },  //入口文件
  output: {
    //入口文件输出配置
    filename: '[name].js',
    libraryTarget: 'umd',
    library: "[name]",
    path: path.resolve(__dirname, './build')
  },
  //排除打包外部框架
  externals: {
    'react': "React",
    'jquery': "$",
		"antd": "antd",
    'react-dom': "ReactDOM",
    "moment": "moment",
    "react-color": "react-color"
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
                // localIdentName: 'hk-[name]-[local]'
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
		new ExtractTextPlugin('[name].css')
    
  ]
};