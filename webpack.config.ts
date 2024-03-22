module.exports = {
    mode: "development",

    entry: {
        main: "./src/frontend/App.ts",
        user: "./src/frontend/UserApp.ts"
    },

    output: {
        filename: "[name].bundle.js",
        chunkFilename: '[name].chunk.js',
        path: __dirname + "/dist/frontend",
        publicPath: "/assets/"
    },
    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".js", ".tsx"]
    },
    module: {
        rules: [
            {
                test:  /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        },
        usedExports: true
    }
}