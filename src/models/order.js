// import { routerRedux } from 'dva/router';
// import { stringify } from 'querystring';
import {
    getList as queryList,
    getCapsuleList as queryCapsuleList,
    getShopList as queryShopList,
    del,
    diyOrderDownload,
    shopOrderDownload,
    capsuleOrderDownload,
} from '@/services/order';

const Model = {
    namespace: 'order',
    state: {
        list: [],
    },
    effects: {
        *getList({ payload }, { call, put }) {
            let queryListFun = queryList;
            if (payload.orderType === 'capsule') {
                queryListFun = queryCapsuleList;
            } else if (payload.orderType === 'shop') {
                queryListFun = queryShopList;
            }
            const res = yield call(queryListFun, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'setOrderList',
                    payload: res.data,
                });
            }
        },
        *download({ payload }, { call, put }) {
            console.log('downloaddownloaddownload');
            let orderDownload = diyOrderDownload;
            if (payload.orderType === 'capsule') {
                queryListFun = capsuleOrderDownload;
            } else if (payload.orderType === 'shop') {
                queryListFun = shopOrderDownload;
            }
            const res = yield call(orderDownload, payload);
            console.log(res);
            if (res && res.data && res.data.url) {
                window.open(`https://crm.we-idesign.com/${res.data.url}`);
            }
        },
        *del({ payload }, { call, put }) {
            const res = yield call(del, payload);
            console.log(res);
            if (res.success) {
                yield put({
                    type: 'getList',
                });
            }
        },
    },
    reducers: {
        setOrderList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
    },
};
export default Model;
