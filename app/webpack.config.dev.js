const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dashboard = require('webpack-dashboard')
const DashboardPlugin = require('webpack-dashboard/plugin')
const dashboard = new Dashboard()

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new DashboardPlugin(dashboard.setData),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new webpack.DefinePlugin({ API_BASE_URL: JSON.stringify('http://localhost:3000/api') })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }]
  },
  devServer: {
    contentBase: './dist',
    publicPath: '/',
    quiet: true
  }
}
