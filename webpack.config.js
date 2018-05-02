const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.tsx',
    stories: './src/stories.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.?worker\.ts$/,
        use: ['worker-loader']
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'stories.html',
      template: './index.html',
      chunks: ['stories'],
    })
  ],
  devServer: {
    port: 8088
  },
  mode: 'development',
  devtool: 'inline-source-map'
};
