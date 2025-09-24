const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './src/server.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
    clean: true,
  },
  externals: [
    nodeExternals({
      allowlist: [/^react-router-dom\/server(\/.*)?$/],
      additionalModuleDirs: [
        path.resolve(__dirname, '../../node_modules'),
        path.resolve(__dirname, 'node_modules'),
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../client/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.server.json',
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['ignore-loader'],
      },
      {
        test: /(\.png|jpe?g|gif|svg|woff2?|ttf|eot)$/,
        use: ['ignore-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __SERVER_PORT__: JSON.stringify(process.env.SERVER_PORT || 3001),
    }),
  ],
};
