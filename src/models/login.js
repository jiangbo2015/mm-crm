import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { message } from 'antd';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
    namespace: 'login',
    state: {
        status: undefined,
    },
    effects: {
        *login({ payload }, { call, put }) {
            const response = yield call(fakeAccountLogin, payload);
            console.log(response);
            yield put({
                type: 'changeLoginStatus',
                payload: response.data,
            }); // Login successfully

            if (response.success) {
                console.log(response.data, 'response');
                if (response.data && response.data.role !== 0 && response.data.role !== 2) {
                    message.error('您没有权限登录');
                    return;
                }
                localStorage.token = response.data.token;

                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params;

                if (redirect) {
                    const redirectUrlParams = new URL(redirect);

                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);

                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        window.location.href = '/';
                        return;
                    }
                }

                yield put(routerRedux.replace(redirect || '/'));
            }
        },

        *getCaptcha({ payload }, { call }) {
            yield call(getFakeCaptcha, payload);
        },

        *logout(_, { put }) {
            const { redirect } = getPageQuery(); // redirect
            localStorage.token = '';
            localStorage['antd-pro-authority'] = '';
            if (window.location.pathname !== '/user/login' && !redirect) {
                yield put(
                    routerRedux.replace({
                        pathname: '/user/login',
                        search: stringify({
                            redirect: window.location.href,
                        }),
                    }),
                );
            }
        },
    },
    reducers: {
        changeLoginStatus(state, { payload }) {
            setAuthority(payload.token);
            return { ...state, status: payload.status, type: payload.type };
        },
    },
};
export default Model;
