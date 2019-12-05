const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 基本路径
    publicPath: './',

    configureWebpack: {
        externals: { //忽略不需要打包的库,在index.html中使用cdn引入
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'element-ui': 'ELEMENT',
            'axios': 'axios',
            'AMap': 'AMap'
        }
    },

    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config.resolve.alias
            .set('assets', resolve('src/assets'))
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: process.env.NODE_ENV==='development'?true:false,

    // webpack-dev-server 相关配置
    devServer: {
        proxy: {
            '/api': {
                // target: 'http://192.168.0.254:8765',
                // target: 'http://111.47.18.22:13782/yanxue',
                target: 'http://47.96.165.125:80',
            },
        }
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }

}