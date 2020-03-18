import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
    [
        'umi-plugin-react',
        {
            antd: true,
            dva: {
                hmr: true,
            },
            locale: {
                // default false
                enable: true,
                // default zh-CN
                default: 'zh-CN',
                // default true, when it is true, will use `navigator.language` overwrite default
                baseNavigator: true,
            },
            dynamicImport: {
                loadingComponent: './components/PageLoading/index',
                webpackChunkName: true,
                level: 2,
            },
            pwa: pwa
                ? {
                      workboxPluginMode: 'InjectManifest',
                      workboxOptions: {
                          importWorkboxFrom: 'local',
                      },
                  }
                : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
            // dll features https://webpack.js.org/plugins/dll-plugin/
            // dll: {
            //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
            //   exclude: ['@babel/runtime', 'netlify-lambda'],
            // },
        },
    ],
    [
        'umi-plugin-pro-block',
        {
            moveMock: false,
            moveService: false,
            modifyRequest: true,
            autoAddMenu: true,
        },
    ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
    plugins.push([
        'umi-plugin-ga',
        {
            code: 'UA-72788897-6',
        },
    ]);
}

export default {
    plugins,
    block: {
        // 国内用户可以使用码云
        // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
        defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
    },
    hash: true,
    treeShaking: true,
    targets: {
        ie: 11,
    },
    devtool: isAntDesignProPreview ? 'source-map' : false,
    // umi routes: https://umijs.org/zh/guide/router.html
    routes: [
        {
            path: '/user',
            component: '../layouts/UserLayout',
            routes: [
                {
                    name: 'login',
                    path: '/user/login',
                    component: './user/login',
                },
            ],
        },
        {
            path: '/',
            component: '../layouts/SecurityLayout',
            routes: [
                {
                    path: '/',
                    component: '../layouts/BasicLayout',
                    authority: ['admin', 'user'],
                    routes: [
                        {
                            path: '/',
                            redirect: '/welcome',
                        },
                        {
                            path: '/userManage',
                            name: '用户管理',
                            icon: 'user',
                            routes: [
                                {
                                    path: '/userManage/channel',
                                    name: '通道管理',
                                    component: './userManage/channel/index.jsx',
                                },
                                {
                                    path: '/userManage/productor',
                                    name: '产品经理',
                                    component: './userManage/productor/index.jsx',
                                },
                                {
                                    path: '/userManage/customer',
                                    name: '客户',
                                    component: './userManage/customer',
                                },
                                {
                                    path: '/userManage/designer',
                                    name: '设计人员',
                                    component: './userManage/designer',
                                },
                            ],
                        },
                        {
                            path: '/productManage',
                            name: '产品管理',
                            icon: 'sketch',
                            routes: [
                                {
                                    path: '/productManage/productInfo',
                                    name: '产品基础信息',
                                    component: './productManage/productInfo/index.jsx',
                                },
                                {
                                    path: '/productManage/colors',
                                    name: '素色管理',
                                    component: './productManage/colors/index.jsx',
                                },
                                {
                                    path: '/productManage/flower',
                                    name: '花布管理',
                                    component: './productManage/flower/index.jsx',
                                },
                                {
                                    path: '/productManage/goods',
                                    name: '商品管理',
                                    component: './productManage/goods',
                                },
                                {
                                    path: '/productManage/styles',
                                    name: '款式管理',
                                    component: './productManage/styles',
                                },
                            ],
                        },
                        {
                            path: '/orderManage',
                            name: '订单管理',
                            icon: 'dollar',
                            routes: [
                                {
                                    path: '/orderManage/order',
                                    name: '订单列表',
                                    component: './orderManage/order/index.jsx',
                                },
                            ],
                        },
                        {
                            path: '/systemSetup',
                            name: '系统设置',
                            icon: 'tool',
                            component: './systemSetup',
                        },
                        {
                            path: '/admin',
                            name: 'admin',
                            icon: 'crown',
                            component: './Admin',
                            authority: ['admin'],
                        },
                        {
                            component: './404',
                        },
                    ],
                },
                {
                    component: './404',
                },
            ],
        },
        {
            component: './404',
        },
    ],
    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
        'primary-color': primaryColor,
    },
    define: {
        'process.env.APIURL': 'http://192.168.8.109:3000',
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
            ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    },
    ignoreMomentLocale: true,
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    disableRedirectHoist: true,
    cssLoaderOptions: {
        modules: true,
        getLocalIdent: (context, _, localName) => {
            if (
                context.resourcePath.includes('node_modules') ||
                context.resourcePath.includes('ant.design.pro.less') ||
                context.resourcePath.includes('global.less')
            ) {
                return localName;
            }

            const match = context.resourcePath.match(/src(.*)/);

            if (match && match[1]) {
                const antdProPath = match[1].replace('.less', '');
                const arr = slash(antdProPath)
                    .split('/')
                    .map(a => a.replace(/([A-Z])/g, '-$1'))
                    .map(a => a.toLowerCase());
                return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
            }

            return localName;
        },
    },
    manifest: {
        basePath: '/',
    },
    chainWebpack: webpackPlugin,

    proxy: {
        '/api/': {
            //192.168.8.107
            target: 'http://192.168.8.109:3000',
            // target: 'http://8.209.64.159:3001',
            changeOrigin: true,
            //   pathRewrite: { '^/server': '' },
        },
        '/uploads/': {
            //192.168.8.107
            target: 'http://192.168.8.109:3000',
            // target: 'http://8.209.64.159:3001',
            changeOrigin: true,
        },
    },
};
