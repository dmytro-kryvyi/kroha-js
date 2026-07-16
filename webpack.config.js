const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

console.log("IS DEV:", isDev);

let htmlPageNames = ["info", "instruction"];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HTMLWebpackPlugin({
    template: `./${name}.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
  });
});

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: ["./js/index.js", "./js/burger.js"],
    info: ["./js/about.js", "./js/burger.js"],
    instruction: ["./js/instruction.js", "./js/burger.js"],
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    port: 4200,
    hot: isDev,
    liveReload: true,
    watchFiles: [path.join(__dirname, "src/**/*")],
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "./index.html",
      minify: {
        collapseWhitespace: !isDev,
      },
      chunks: ["main"],
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ].concat(multipleHtmlPlugins),
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: "all",
    },
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
};
