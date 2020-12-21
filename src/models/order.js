// import { routerRedux } from 'dva/router';
// import { stringify } from 'querystring';
import { getList as queryList, del, orderDownload } from '@/services/order';

const Model = {
    namespace: 'order',
    state: {
        list: [],
    },
    effects: {
        *getList({ payload }, { call, put }) {
            const res = yield call(queryList, payload);
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
            const res = yield call(orderDownload, payload);
            console.log(res);
            if (res && res.data && res.data.url) {
                window.open(`http://crm.we-idesign.com/${res.data.url}`);
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
