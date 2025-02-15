import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
    // [
    //     'umi-plugin-react',
    //     {
    //         antd: true,
    //         dva: {
    //             hmr: true,
    //         },
    //         locale: {
    //             // default false
    //             enable: true,
    //             // default zh-CN
    //             default: 'zh-CN',
    //             // default true, when it is true, will use `navigator.language` overwrite default
    //             baseNavigator: true,
    //         },
    //         dynamicImport: {
    //             loadingComponent: './components/PageLoading/index',
    //             webpackChunkName: true,
    //             level: 2,
    //         },
    //         pwa: pwa
    //             ? {
    //                   workboxPluginMode: 'InjectManifest',
    //                   workboxOptions: {
    //                       importWorkboxFrom: 'local',
    //                   },
    //               }
    //             : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
    //         // dll features https://webpack.js.org/plugins/dll-plugin/
    //         // dll: {
    //         //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
    //         //   exclude: ['@babel/runtime', 'netlify-lambda'],
    //         // },
    //     },
    // ],
    // [
    //     'umi-plugin-pro-block',
    //     {
    //         moveMock: false,
    //         moveService: false,
    //         modifyRequest: true,
    //         autoAddMenu: true,
    //     },
    // ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码
// if (isAntDesignProPreview) {
//     plugins.push([
//         'umi-plugin-ga',
//         {
//             code: 'UA-72788897-6',
//         },
//     ]);
// }

export default {
    plugins,
    dva: {},
    antd: {},
    hash: true,
    history: {
        type: 'hash',
    },
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
                    path: '/diy',
                    name: '创建DIY',
                    icon: 'edit',
                    component: './diy',
                    authority: ['admin', 'productor', 'designer', 'customer'],
                    layout: false
                },
                {
                    path: '/',
                    component: '../layouts/BasicLayout',
                    routes: [
                        {
                            path: '/',
                            redirect: '/welcome',
                        },
                        {
                            path: '/welcome',
                            component: './welcome/index.jsx',
                        },
                        {
                            path: '/creativeCapsule',
                            name: '创意胶囊',
                            icon: 'camera',
                            component: './creativeCapsule',
                            authority: ['admin', 'productor', 'designer', 'customer'],
                        },
                        {
                            path: '/myFavorites',
                            name: '我的收藏',
                            icon: 'star',
                            component: './myFavorites',
                            authority: ['admin', 'productor', 'designer', 'customer'],
                        },
                        {
                            path: '/notices',
                            name: '通知发布',
                            icon: 'bell',
                            component: './notices',
                            authority: ['admin', 'productor', 'designer', 'customer'],
                        },
                        {
                            path: '/myDiy',
                            name: '我的创建',
                            icon: 'skin',
                            component: './myDiy',
                            authority: ['admin', 'productor', 'designer', 'customer'],
                        },
                        {
                            path: '/diy',
                            name: '创建DIY',
                            icon: 'edit',
                            component: './diy',
                            authority: ['admin', 'productor', 'designer', 'customer'],
                        },
                        {
                            path: '/userManage',
                            name: '用户管理',
                            icon: 'user',
                            authority: ['admin', 'productor'],
                            routes: [
                                {
                                    path: '/userManage/channel',
                                    name: '通道管理',
                                    component: './userManage/channel/index.jsx',
                                    authority: ['admin', 'productor'],
                                },
                                {
                                    // name: '通道详情',
                                    path: '/userManage/channel/detail/:id',
                                    
                                    component: './userManage/channel/detail/index.jsx',
                                },
                                {
                                    path: '/userManage/productor',
                                    name: '产品经理',
                                    component: './userManage/productor/index.jsx',
                                    authority: ['admin'],
                                },
                                {
                                    path: '/userManage/customer',
                                    name: '客户',
                                    component: './userManage/customer',
                                    authority: ['admin', 'productor'],
                                },
                                {
                                    path: '/userManage/designer',
                                    name: '设计人员',
                                    component: './userManage/designer',
                                    authority: ['admin'],
                                },
                                {
                                    path: '/userManage/graphicDesigner',
                                    name: '美工',
                                    component: './userManage/graphicDesigner',
                                    authority: ['admin'],
                                },
                            ],
                        },
                        {
                            path: '/productManage',
                            name: '素材管理',
                            icon: 'sketch',
                            authority: ['admin', 'graphicDesigner'],
                            routes: [
                                // {
                                //     path: '/productManage/productInfo',
                                //     name: '产品基础信息',
                                //     component: './productManage/productInfo/index.jsx',
                                // },
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
                                    name: '商品分类',
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
                            path: '/capsule',
                            name: '胶囊管理',
                            icon: 'copyright',
                            component: './capsule',
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
        // 'process.env.APIURL': 'http://localhost:3001',
        // 'process.env.APIURL': 'http://8.209.64.159:3001',
        // 'process.env.APIURL': 'http://192.168.71.117:3001',
        // 'process.env.APIURL': 'https://we-idesign.com',
        
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
            ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    },
    ignoreMomentLocale: true,
    lessLoader: {
        javascriptEnabled: true,
    },
    cssLoader: {
        modules: {
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
    },
    manifest: {
        basePath: '/',
    },
    chainWebpack: webpackPlugin,
    proxy: {
        '/api/': {
            //192.168.8.107
            // target: 'https://crm.we-idesign.com/',
            target: 'http://192.168.71.117:3001',
            // target: 'http://localhost:3001',
            changeOrigin: true, //   pathRewrite: { '^/server': '' },
        },
        '/uploads/': {
            //192.168.8.107
            // target: 'http://192.168.124.25:3000',
            // target: 'http://8.209.64.159:3001',
            target: 'http://localhost:3001',
            // target: 'https://crm.we-idesign.com/',
            changeOrigin: true,
        },
        '/uploadskit/': {
            //192.168.8.107
            // target: 'http://192.168.124.25:3000',
            target: 'http://8.209.64.159:3001',
            // target: 'http://localhost:3001',
            changeOrigin: true,
        },
    },
};
