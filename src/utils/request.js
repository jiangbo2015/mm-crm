/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { history } from 'umi'

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '请登录',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
    console.log('error', error);
    const { response } = error;

    if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;
        const { status, url } = response;
        console.log("status：",status)
        if(status === 401) {
            history.push('/user/login')
        } else {
            notification.error({
                message: `请求错误 ${status}: ${url}`,
                description: errorText,
            });
        }
    } else if (!response) {
        notification.error({
            description: '您的网络发生异常，无法连接服务器',
            message: '网络异常',
        });
    }

    return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
    errorHandler,
    // 默认错误处理
    // credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use(async (url, options) => {
    const { token } = localStorage;
    options.headers.Authorization = `Bearer ${token}`;
    return {
        url,
        options,
    };
});

request.use(async (ctx, next) => {
    await next();

    const { res } = ctx;
    const { success = false, message } = res; // 假设返回结果为 : { success: false, errorCode: 'B001' }
    if (!success) {
        notification.error({
            description: message || '操作失败',
            message: '提示',
        });
    }
});

export default request;
