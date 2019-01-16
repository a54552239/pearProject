const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

const HOST = '127.0.0.1';
const PORT = '8045';
const DEV_URL = 'http://127.0.0.1/pearProjectApi/index.php';
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    productionSourceMap: false,
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    blue: '#3a82f8',
                    'text-color': '#333'
                },
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        host: HOST,
        port: PORT,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                //要访问的跨域的api的域名
                target: `${DEV_URL}/`,
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },
    configureWebpack: config => {
        config.resolve = {
            extensions: ['.js', '.vue', '.json', ".css"],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src'),
                'assets': resolve('src/assets'),
                'components': resolve('src/components')
            }
        }
    },
    lintOnSave: undefined
};
