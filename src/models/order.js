import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { getList as queryList } from '@/services/order';

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
