const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

module.exports = {
	webpack: function (config) {
		config.plugins.push(
			new MiniCssExtractPlugin({
				filename: "[name].css",
				chunkFilename: "[id].css",
			}),
			new HTMLInlineCSSWebpackPlugin(),
			new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
			new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/chunk/])
		);

		return config;
	},
};
