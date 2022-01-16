const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		chunkFilename: 'chunk.[contenthash].js'
	},
	module: {
		rules: [
			{
				test: /\.(jsx|js)$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env' ]
							]
						}
					}
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|geojson|json|csv)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource'
	      },
	      {
				test: /\.(topojson)$/i,
				type: 'asset/resource'
	      },
	      {
				test: /\.less$/i,
				use: [ 
					{ loader: "style-loader"},
					{ loader: "css-loader"},
					{ loader: "less-loader"}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template:'src/entrypoints/avoid.html',
			filename:'avoid/index.html'
		}),
		new HtmlWebpackPlugin({
			template:'src/entrypoints/shift.html',
			filename:'shift/index.html'
		}),
		new HtmlWebpackPlugin({
			template:'src/entrypoints/improve.html',
			filename:'improve/index.html'
		}),
		new HtmlWebpackPlugin({
			template:'src/entrypoints/fuel.html',
			filename:'fuel/index.html'
		})
	],
	resolve: {
		extensions: ['.js', '.jsx']
	}
}
