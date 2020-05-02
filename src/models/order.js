import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { getList as queryList, del } from '@/services/order';

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
